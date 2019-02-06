const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

// configure the keys for accessing AWS
AWS.config.update({
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: `${process.env.S3_BUCKET}`,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
};

// Define POST route
router.post('/sheet-music', (request, response) => {
    console.log('POST hit');
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        console.log('fields: ', fields);
        console.log('files: ', files);

        if (error) throw new Error(error);
        try {
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const timestamp = Date.now().toString();
            const fileName = `sheet-music/${timestamp}-lg`;
            const data = await uploadFile(buffer, fileName, type);
            const name = fields.name[0];
            const instrument = fields.instrument[0];
            const difficulty = parseInt(fields.difficulty[0]);
            const queryValues = [name, instrument, difficulty, data.Location];
            const queryText = `INSERT INTO sheet_music (name, instrument, difficulty, url)
            VALUES ($1, $2, $3, $4);`;
            pool.query(queryText, queryValues)
              .then((res) => {
                res.sendStatus(201);
              })
              .catch((err) => {
                console.log('POST event error: ', err);
              });
            // return response.status(200).send(data);
            return
        } catch (error) {
            return response.status(400).send(error);
        }
    });
});


router.post('/', (req, res) => {

  let { user_id, title, start, end } = req.body;
  start = new Date(start);
  end = new Date(end);
  const queryValues = [title, start, end, user_id];
  const queryText = `INSERT INTO event (title, start, end, user_id)
                    VALUES ($1, $2, $3, $4);`;
  console.log(queryValues);
  pool.query(queryText, queryValues)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('POST event error: ', err);
    });
});

module.exports = router;