require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const authorizationMiddleware = require('./authorization-middleware');

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

app.get('/api/chefs/:chefId', (req, res) => {
  const chefId = Number(req.params.chefId);
  if (!Number.isInteger(chefId) || chefId < 1) {
    res.status(400).json({ error: 'grade must be a positive integer' });
  }
  const sql = `
    select   "chefId", "chefs"."name", "photoUrl", avg(distinct "rating"), count(distinct "reviewId"), string_agg(distinct "cuisines"."name", ', ') as "cuisineType"
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
        res.status(404).json({ error: `cannot find chef with chefId ${chefId}` });
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => console.error(err));
});

app.get('/api/dishes/:chefId', (req, res) => {
  const chefId = Number(req.params.chefId);
  if (!Number.isInteger(chefId) || chefId < 1) {
    res.status(400).json({ error: 'grade must be a positive integer' });
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
        res.status(404).json({ error: `cannot find dishes with chefId ${chefId}` });
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => console.error(err));
});

app.get('/api/reviews/:chefId', (req, res) => {
  const chefId = Number(req.params.chefId);
  if (!Number.isInteger(chefId) || chefId < 1) {
    res.status(400).json({ error: 'grade must be a positive integer' });
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
        res.status(404).json({ error: `cannot find dishes with chefId ${chefId}` });
      } else {
        res.json(result.rows);
      }
    })
    .catch(err => console.error(err));
});

app.get('/api/search/:cuisineType', (req, res) => {
  const cuisineType = req.params.cuisineType;
  if (Number.isInteger(cuisineType)) {
    res.status(400).json({ error: 'cuisineType must be letters' });
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
    .catch(err => console.error(err));
});

app.get('/api/cuisines/', (req, res) => {
  const sql = `
  select *
  from "cuisines"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => console.error(err));
});

app.use(authorizationMiddleware);

app.use(staticMiddleware);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
