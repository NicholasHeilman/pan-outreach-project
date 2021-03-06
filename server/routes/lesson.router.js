const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    let queryText = (`SELECT lesson_plan.*, category.name AS category_name FROM "lesson_plan" left JOIN "category" ON "lesson_plan".category_id = "category".id ORDER BY "id" DESC;`);
    pool.query(queryText).then((result) => {
        console.log('result.rows:', result.rows);
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    })
});

// search lesson plan GET
router.get('/search/:category/:name', rejectUnauthenticated, (req, res) => {
    let name = req.params.name;
    let category = req.params.category;
    if (name === '*') { name = null }
    if (category === '*') { category = null }
    console.log('hit router:', name, category);
    let queryValues;
    let queryString;
    if (name) {
      queryString = `SELECT lesson_plan.*, category.name AS category_name FROM "lesson_plan"
                          left JOIN "category" ON "lesson_plan".category_id = "category".id
                          WHERE
                          ($1::text is NULL or "lesson_plan".name ~~* $1) and
                          ($2::integer is NULL or "category_id" = $2)`;
      queryValues = [`%${name}%`, category]
    } else {
      queryString = `SELECT lesson_plan.*, category.name AS category_name FROM "lesson_plan"
                          left JOIN "category" ON "lesson_plan".category_id = "category".id
                          WHERE "category_id" = $1;`;
      queryValues = [category]
    }
    pool.query(queryString, queryValues)
        .then((result) => {
            console.log(result.rows);
            res.send(result.rows);
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});
/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {
    const lesson = req.body;
    const queryText = `INSERT INTO "lesson_plan" ("name", "category_id", "url") VALUES ($1, $2, $3);`;
    pool.query(queryText, [lesson.name, lesson.category_id, lesson.url])
    .then((result) => {
        console.log('result.rows:', result.rows);
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    })
});

// update lesson
router.put('/:id', rejectUnauthenticated, function(req, res){
    const id = req.params.id;
    console.log('hit put');
    const lesson = req.body; // This the data we sent
    const query = `UPDATE "lesson_plan" SET "name" = $2, "category_id" = $3 WHERE id = $1;`
    console.log('yeahah:', req.body);
    pool.query(query, [id, lesson.name, lesson.category_id])
    .then((result)=>{
        console.log(result);
        res.sendStatus(201);
    }).catch((err)=>{
        console.log('hit query',err);
        res.sendStatus( 500);
    })
})

// delete lesson
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const id = req.params.id;
    const queryText = 'DELETE FROM "lesson_plan" WHERE id = $1;';
    pool.query(queryText, [id])
    .then(result => {
        res.sendStatus(202);
    })
    .catch(error => {
        console.log('error in delete', error);
        res.sendStatus(500);
    })
})
module.exports = router;
