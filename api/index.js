const express = require('express')
const app = express()

const dotenv = require(("dotenv"))
const multer = require("multer")
const path = require("path")

const mongoose = require("mongoose")
const bodyParser = require('body-parser')


//routes
const authRoute = require("./routes/auth")
const authUser = require("./routes/user")
const authPost = require("./routes/posts")
const authCat = require("./routes/categories")

dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))

const cors = require('cors');
app.use(cors({
  origin: '*'
}));


mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to Mongodb"))
.catch((err) => console.log(err))

const storage = multer.diskStorage({
    destination: (req, file, callb) => {
      // console.log(req)
      callb(null, "images")
    },
    filename: (req, file, callb) => {
      // callb(null, "file.png")
      // console.log(file.originalname)
      callb(null, file.originalname)
    },
  })

const upload = multer({ storage: storage })
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("asdsafdsasadsadasdasasdfafdfa : ", res);
  res.status(200).json("File has been uploaded")
})

app.use('/auth', authRoute);
app.use('/users', authUser);
app.use('/posts', authPost);
app.use("/category", authCat)

app.use(bodyParser.json())
// app.use(bodyParser.json())

app.listen("5000", () => {
    console.log("server has started on http://localhost:5000")
})