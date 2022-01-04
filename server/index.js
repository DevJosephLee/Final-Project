require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const authorizationMiddleware = require('./authorization-middleware');
// const { Client } = require('pg/lib');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

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
      insert into "users" ("username", "password", "createdAt")
      values ($1, $2, current_timestamp)
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

app.get('/api/chefs/:chefId', (req, res, next) => {
  const chefId = Number(req.params.chefId);
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'grade must be a positive integer');
  }
  const sql = `
    select   "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType", "bio"
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
    select   "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId")
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

app.post('/api/review/:chefId/:userId', (req, res, next) => {
  const chefId = Number(req.params.chefId);
  const userId = Number(req.params.userId);
  const content = req.body.content;
  const rating = Number(req.body.rating);
  if (!chefId || !userId) {
    throw new ClientError(400, 'chefId and userId are required fields');
  } else if (!content || !rating) {
    throw new ClientError(400, 'content and rating are required fields');
  }
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'chefId must be a positive integer');
  } else if (!Number.isInteger(userId) || userId < 1) {
    throw new ClientError(400, 'userId must be a positive integer');
  } else if (Number.isInteger(content)) {
    throw new ClientError(400, 'review content must be letters');
  } else if (!Number.isInteger(rating) || rating < 1) {
    throw new ClientError(400, 'rating must be a positive integer');
  }
  const sql = `
    insert into "reviews" ("userId", "chefId", "content", "rating", "createdAt")
    values ($1, $2, $3, $4, current_timestamp)
    returning "userId", "chefId", "content", "rating", "createdAt" , "reviewId"
  `;
  const params = [userId, chefId, content, rating];
  db.query(sql, params)
    .then(result => {
      const [review] = result.rows;
      res.json(review);
    })
    .catch(err => next(err));
});

app.get('/api/userProfile/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    throw new ClientError(400, 'userId is a required field');
  }
  if (!Number.isInteger(userId) || userId < 1) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  const sql = `
    select "username"
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

app.post('api/userProfile/:chefId/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  const chefId = Number(req.params.chefId);
  if (!chefId || !userId) {
    throw new ClientError(400, 'chefId and userId are required fields');
  }
  if (!Number.isInteger(chefId) || chefId < 1) {
    throw new ClientError(400, 'chefId must be a positive integer');
  } else if (!Number.isInteger(userId) || userId < 1) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
});

app.use(errorMiddleware);

app.use(authorizationMiddleware);

app.use(staticMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
