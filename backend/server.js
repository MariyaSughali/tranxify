const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const app = express();
const PORT = 3008;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "131619", 
  database: "lyricTrans_profileUpdate",
  port: 5432,
});
//edit user data
app.put('/editdata', async (req, res) => {
  try {
    const { firstname, secondname, email, phone, language, role } = req.body;
    await pool.query(
      "UPDATE profile SET firstname = $1, secondname = $2, email = $3, phone = $4, language = $5, role = $6 WHERE id = 1",
      [firstname, secondname, email, phone, language, role]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//get user data from db
app.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM profile WHERE id = 1");
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// cahnge user password
app.put('/changepassword', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userResult = await pool.query('SELECT password FROM profile WHERE id = 1');
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query('UPDATE profile SET password = $1 WHERE id = 1', [hashedNewPassword]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//profile picture update
const aws= require("aws-sdk");
const multer= require ("multer");
const multers3= require ("multer-s3");

aws.config.update({
    accessKeyId:"AKIAWJUYWBOYM2OA5BTO",
    secretAccessKey:"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",
    signatureVersion: 'v4',
    region: 'ap-south-1',
    endpoint:'s3.ap-south-1.amazonaws.com'
  });

const s3 = new aws.S3({
    accessKeyId:"AKIAWJUYWBOYM2OA5BTO",
    secretAccessKey:"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",
    signatureVersion: 'v4',
    region: 'ap-south-1',
    endpoint:'s3.ap-south-1.amazonaws.com'

  });

const upload = multer(
    {
        storage: multers3({
          s3: s3,
          bucket: "tranxify",
          metadata: function (req, file, cb) {
            console.log(file);
            cb(null, { fieldName: file.originalname });
          },
          key: function (req, file, cb) {
            cb(null, file.originalname);
          },
        }),
      }
      );

 // extract url from aws
app.get('/url/:filename', (req, res, next) => {
  const params = {
    Bucket: "tranxify",
    Key: req.params.filename,
    Expires: 86400
  };

  s3.getSignedUrl("getObject", params, function (err, url) {
    if (err) {
      console.log(err);
      res.status(500).send('Error generating signed URL');
    } else {
      const imageUrl = url;
 // Update the PostgreSQL database with the generated URL
      pool.query("UPDATE profile SET image=$1 WHERE id=1", [imageUrl])
        .then(() => {
          console.log("Image uploaded to the database:  "+url);
          res.send(url);
        })
        .catch(error => {
          console.error('Error updating the database with image URL:', error);
          res.status(500).send('Error updating the database with image URL');
        });
    }
  });
});

   

app.post('/up', upload.single('photos'), function (req, res, next) {
    res.send({ data: req.file, msg: 'Successfully uploaded files!' });
  //res.set('Content-Type', 'image/png');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
