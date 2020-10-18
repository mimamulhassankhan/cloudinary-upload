const express = require('express');
const cloudinary = require('cloudinary');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const storage = multer.diskStorage({
  destination: (req, file, callback) =>{
      callback(null, 'uploads')
  },
  filename: (req, file, callback) =>{
      callback(null, file.fieldname+path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
});

app.post('/upload', upload.single('imageFile'), async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    if(result){
      console.log(result.secure_url);
      res.status(200).send({url : result.secure_url});
    }
    else{
      res.status(404).send('Upload Failed');
    }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(5000)