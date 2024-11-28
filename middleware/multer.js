import multer from "multer";
import express from "express";


const app = express();

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null,file.originalname)
    }
}) 

const upload = multer({ dest: 'uploads/' });
// You could separate fields like this if you're also sending other data
app.post('/add', upload.none(), (req, res) => {
  console.log(req.body); // Non-file fields like name, description, etc.
});


export default upload