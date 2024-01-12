const router = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app.use(bodyParser.json())


//register
router.post("/register",jsonParser, async (req, res) => {
    try {
        
      const salt = await bcrypt.genSalt(10)
    //   console.log("nnnnnnnnnnnnn")
    //   console.log(req.query)
    //   console.log(req.body.password)
    //   console.log(req.body.email)
    //   console.log(req.body.name)
      const hashedPass = await bcrypt.hash(req.body.password, salt)
        // console.log("aaaaaaaaaaaaaaaa")
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
      })
  
      const user = await newUser.save()
      res.status(200).json(user)

    } catch (error) {
      res.status(500).json(error)
    }
})

//login

router.post("/login",jsonParser, async (req, res) => {
    try {
        // console.log("nnnnnn")
        // console.log(req.body.username)
        const user = await User.findOne({username: req.body.username})
        // console.log(user.password)
        !user && res.status(400).json("No user")
        //if same user then compare password
        const validate = await bcrypt.compare(req.body.password , user.password)

        !validate && res.status(400).json("Wrong credentials!")

        const {password, ...other} = user._doc
        res.status(200).json(other)
    }catch(error){
        res.status(500).json(error)
    }
})

module.exports = router
