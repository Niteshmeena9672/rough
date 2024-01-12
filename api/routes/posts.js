const router = require("express").Router()
const Post = require("../models/post")

var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//create post
router.post("/",jsonParser, async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savePost = await newPost.save()
    res.status(200).json(savePost)
  } catch (error) {
    res.status(500).json(error)
  }
})


// update post
router.put("/:id", jsonParser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.username === req.body.username) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        )
        res.status(200).json(updatePost)
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(401).json("You can update only your post!")
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

// delete
router.delete("/:id",jsonParser, async (req, res) => {
  try {
    // console.log(req.params.id)
    const post = await Post.findById(req.params.id)
    // console.log(post.username)
    if (post.username === req.body.username) {
      try {
        // console.log(post.username)

        await post.deleteOne()
        // console.log(post.username)

        res.status(200).json("Post Has been delete!")
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(401).json("You can delete only your post!")
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

// get post
router.get("/:id",jsonParser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json(error)
  }
})

// get all post
router.get("/", jsonParser, async (req, res) => {
  const username = req.query.user
  const catName = req.query.cat
  try {
    let posts
    if (username) {
      posts = await Post.find({ username: username })
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      })
    } else {
      posts = await Post.find()
    }
    res.status(200).json(posts)
  } catch (error) {
    res.status(404).json(error)
  }
})

//localhost:5000/posts?user=ram

module.exports = router