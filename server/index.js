require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const authorizationMiddleware = require('./authorization-middleware');
const uploadsMiddleware = require('./uploads-middleware');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  // eslint-disable-next-line no-console
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', data => {
    socket.join(data);
    // eslint-disable-next-line no-console
    console.log(`User with ${socket.id} joined room: ${data}`);
  });
  socket.on('send_message', data => {
    socket.to(data.roomId).emit('receive_message', data);
  });
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('User disconnected', socket.id);
  });
});

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(password => {
      const sql = `
      insert into "users" ("username", "password", "photoUrl", "createdAt")
      values ($1, $2, 'images/testing-image.jpeg', current_timestamp)
      returning "username", "createdAt", "userId"
      `;
      const params = [username, password];
      db.query(sql, params)
        .then(result => {
          const [newUser] = result.rows;
          res.status(201).json(newUser);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  const sql = `
    select "userId",
           "password"
    from   "users"
    where  "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId } = user;
      argon2
        .verify(user.password, req.body.password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/chefs', (req, res, next) => {
  const sql = `
  select "chefId"
  from "chefs"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/chefs/:chefId', (req, res, next) => {
  const chefId = Number(req.params.chefId);
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'grade must be a positive integer');
  }
  const sql = `
    select   "chefId", "chefs"."username", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType", "bio"
    from     "chefs"
    join     "reviews" using ("chefId")
    join     "chefCuisines" using ("chefId")
    join     "cuisines" using ("cuisineId")
    where    "chefId" = $1
    group by "chefs"."chefId"
  `;
  const params = [chefId];
  db.query(sql, params)
    .then(result => {
      const [chef] = result.rows;
      if (!chef) {
        throw new ClientError(404, `cannot find chef with chefId ${chefId}`);
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => next(err));
});

app.get('/api/dishes/:chefId', (req, res, next) => {
  const chefId = Number(req.params.chefId);
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'grade must be a positive integer');
  }
  const sql = `
  select *
  from "dishes"
  where "chefId" = $1
  `;
  const params = [chefId];
  db.query(sql, params)
    .then(result => {
      const [dishes] = result.rows;
      if (!dishes) {
        throw new ClientError(404, `cannot find dishes with chefId ${chefId}`);
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => next(err));
});

app.get('/api/reviews/:chefId', (req, res, next) => {
  const chefId = Number(req.params.chefId);
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'grade must be a positive integer');
  }
  const sql = `
  select *
  from "reviews"
  join "users" using ("userId")
  where "chefId" = $1
  `;
  const params = [chefId];
  db.query(sql, params)
    .then(result => {
      const [reviews] = result.rows;
      if (!reviews) {
        throw new ClientError(404, `cannot find dishes with chefId ${chefId}`);
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => next(err));
});

app.get('/api/search/:cuisineType', (req, res, next) => {
  const cuisineType = req.params.cuisineType;
  if (Number.isInteger(cuisineType)) {
    throw new ClientError(400, 'cuisineType must be letters');
  }
  const sql = `
    select   "chefId", "chefs"."username", "photoUrl", avg(distinct "rating"), count(distinct "reviewId")
    from     "chefs"
    join     "reviews" using ("chefId")
    join     "chefCuisines" using ("chefId")
    join     "cuisines" using ("cuisineId")
    where    "cuisines"."name" = $1
    group by "chefs"."chefId"
  `;
  const params = [cuisineType];
  db.query(sql, params)
    .then(result => {
      const [cuisines] = result.rows;
      if (!cuisines) {
        res.json([]);
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => next(err));
});

app.get('/api/cuisines/', (req, res, next) => {
  const sql = `
  select *
  from "cuisines"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.post('/api/review/:chefId/', (req, res, next) => {
  const chefId = Number(req.params.chefId);
  const { userId } = req.user;
  const content = req.body.content;
  const rating = req.body.rating;
  const sql = `
    insert into "reviews" ("userId", "chefId", "content", "rating", "createdAt")
    values ($1, $2, $3, $4, current_timestamp)
    returning "userId", "chefId", "content", "rating", "createdAt", "reviewId"
  `;
  const params = [userId, chefId, content, rating];
  db.query(sql, params)
    .then(result => {
      const [review] = result.rows;
      res.json(review);
    })
    .catch(err => next(err));
});

app.get('/api/userProfile/', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select "username", "photoUrl"
    from   "users"
    where  "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const photoUrl = req.file.location;
  const sql = `
  update "users"
     set "photoUrl" = $1
   where "userId" = $2
   returning *
  `;
  const params = [photoUrl, userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/changeChefProfilePhoto/:chefId', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const photoUrl = req.file.location;
  const chefId = Number(req.params.chefId);
  const sql = `
  update "chefs"
     set "photoUrl" = $1
   where "userId" = $2 and
         "chefId" = $3
   returning *
  `;
  const params = [photoUrl, userId, chefId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/images', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
  select "photoUrl"
  from "users"
  where "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/userProfile/:chefId', (req, res, next) => {
  const { userId } = req.user;
  const chefId = Number(req.params.chefId);
  if (!chefId) {
    throw new ClientError(400, 'chefId is a required field');
  }
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'chefId must be a positive integer');
  }
  const sql = `
  insert into "favorites" ("chefId", "userId")
  values ($1, $2)
  returning *
  `;
  const params = [chefId, userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/userProfile/chefs', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select   "chefId", "chefs"."username", "chefs"."photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType"
    from     "favorites"
    join     "users" using ("userId")
    join     "chefs" using ("chefId")
    join     "chefCuisines" using ("chefId")
    join     "cuisines" using ("cuisineId")
    join     "reviews" using ("chefId")
    where    "users"."userId" = $1
    group by "favorites"."chefId",
             "chefs"."username",
             "chefs"."photoUrl",
             "users"."username"
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.delete('/api/userProfile/:chefId', (req, res, next) => {
  const { userId } = req.user;
  const chefId = Number(req.params.chefId);
  if (!chefId) {
    throw new ClientError(400, 'chefId is a required field');
  }
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'chefId must be a positive integer');
  }
  const sql = `
    delete from "favorites"
      where "chefId" = $1
      and   "userId" = $2
  `;
  const params = [chefId, userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/userProfile/reviews', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select *
    from   "reviews"
    join   "chefs" using ("chefId")
    where  "reviews"."userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/becomeChef/:chefId', (req, res, next) => {
  const { userId } = req.user;
  const photoUrl = req.body.photoUrl;
  const username = req.body.username;
  const bio = req.body.bio;
  const chefId = Number(req.params.chefId);
  const sql = `
    insert into "chefs" ("username", "photoUrl", "bio", "userId", "chefId", "createdAt")
    values ($1, $2, $3, $4, $5, current_timestamp)
    returning *
  `;
  const params = [username, photoUrl, bio, userId, chefId];
  db.query(sql, params)
    .then(result => {
      const [newChef] = result.rows;
      res.json(newChef);
    })
    .catch(err => next(err));
});

app.post('/api/becomeChef/cuisines/:chefId', (req, res, next) => {
  const { userId } = req.user;
  const chefId = Number(req.params.chefId);
  const cuisineId = req.body.cuisineId;
  const sql = `
    insert into "chefCuisines" ("chefId", "cuisineId", "userId")
    values ($1, $2, $3)
    returning *
  `;
  const params = [chefId, cuisineId, userId];
  db.query(sql, params)
    .then(result => {
      const [newChef] = result.rows;
      res.json(newChef);
    })
    .catch(err => next(err));
});

app.post('/api/becomeChef/dishPhoto/:chefId', uploadsMiddleware, (req, res, next) => {
  const { userId } = req.user;
  const chefId = Number(req.params.chefId);
  const photoUrl = req.file.location;
  const sql = `
    insert into "dishes" ("chefId", "photoUrl", "userId")
    values ($1, $2, $3)
    returning *
  `;
  const params = [chefId, photoUrl, userId];
  db.query(sql, params)
    .then(result => {
      const [newChef] = result.rows;
      res.json(newChef);
    })
    .catch(err => next(err));
});

app.post('/api/becomeChef/dishName/:chefId', (req, res, next) => {
  const { userId } = req.user;
  const chefId = Number(req.params.chefId);
  const name = req.body.name;
  const dishId = req.body.dishId;
  const sql = `
  update "dishes"
     set "name" = $1
   where "chefId" = $2 and
         "userId" = $3 and
         "dishId" = $4
   returning *
  `;
  const params = [name, chefId, userId, dishId];
  db.query(sql, params)
    .then(result => {
      const [newChef] = result.rows;
      res.json(newChef);
    })
    .catch(err => next(err));
});

app.post('/api/createChatRoom/:chefId', (req, res, next) => {
  const { userId } = req.user;
  const chefId = Number(req.params.chefId);
  const sql = `
    insert into "chatRooms" ("userId", "chefId")
    values ($1, $2)
    returning *
  `;
  const params = [userId, chefId];
  db.query(sql, params)
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
