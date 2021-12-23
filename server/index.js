require('dotenv/config');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
// const { json } = require('express');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

// app.get('/api/chefs', (req, res) => {
//   const sql = `
//     select *
//     from "chefs"
//   `
//   db.query(sql)
//     .then(result => {
//       res.json(result.rows)
//     })
//     .catch(err => next(err))
// })

app.use(staticMiddleware);

app.get('/api/chefs/:chefId', (req, res) => {
  const chefId = Number(req.params.chefId);
  const sql = `
    select *
    from "chefs"
    where "chefId" = $1
  `;
  const params = [chefId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => console.error(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
