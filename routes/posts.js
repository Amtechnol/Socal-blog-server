const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = await Post.create(req.body);
  try {
    // const savedPost = await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE POST

router.put("/:id", async (req, res) => {
  console.log("update-post", req.body);
  try {
    // const post = await Post.findById(req.params.id);
    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      console.log("udpate-post", updatedPost);

      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json(err);
    }
    // if (post.username === req.body.username) {

    // } else {
    //   res.status(401).json("You can update only your post!");
    // }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    post.photo = `${process.env.BASE_URL}/images/${post.photo}`;
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL POSTS

router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username }).lean();
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      }).lean();
    } else {
      posts = await Post.find();
    }
    posts.map((data) => {
      data.photo = `${process.env.BASE_URL}/images/${data.photo}`;
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
