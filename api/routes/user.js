const router = require("express").Router()
const User = require("../models/user")
const Post = require("../models/post")
const bcrypt = require("bcrypt")
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//update
router.put("/:id", jsonParser , async (req, res) => {
    if(req.body.userId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,{
                    $set: req.body,
                },{
                    new: true 
                }
            )
            res.status(200).json(updateUser)
        } catch (error) {
            res.status(401).json(error)
        }
        
    }else{
        res.status(401).json("you can update your account")
    }

})

//delete user
router.delete("/:id", jsonParser,  async (req, res) => {
    console.log(req.body.userId)
    console.log(req.params.id)

    if (req.body.userId === req.params.id) {
      // delete all post of user and user account
    //   console.log("aaaaaaaaaaaa")
      try {
        // console.log('nn')
        const user = await User.findById(req.params.id)
        try {
            // console.log('nn')
          await Post.deleteMany({ username: user.username })
          // only delete user account
          await User.findByIdAndDelete(req.params.id)
          res.status(200).json("User has been deleted...")
        } catch (error) {
          res.status(500).json(error)
        }
      } catch (error) {
        res.status(404).json("User not found")
      }
    } else {
      res.status(401).json("You can delete only your account")
    }
  })

// get   user
router.get("/:id", jsonParser, async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      const { password, ...other } = user._doc
      res.status(200).json(other)
    } catch (error) {
      res.status(400).json(error)
    }
  })


module.exports = router