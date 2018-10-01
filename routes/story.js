const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");

router.get("/new", (req, res) => {
  res.render("stories/new");
});

// Stories Index
router.get("/", (req, res) => {
  // fetch public stories
  Story.find({ status: "public" })
    // populate suer with user fields : access association
    .populate("user")
    .sort({ date: "desc" })
    .then(stories => {
      console.log(stories);
      // res.send('STORIES');
      res.render("stories/index", {
        stories: stories
      });
    });
});

// route for the show page
router.get("/show/:id", (req, res) => {
  // find the story from the database that matched the id
  Story.findOne({
    _id: req.params.id
  })
    // bring in user info from collection to access image, firstname and lastName
    .populate("user")
    .then(story => {
      console.log(story);
      res
        .render("stories/show", {
          story: story
        })
        .catch(err => console.log(err));
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  // fetch the data save to the story database and redirect to stories/index
  let allowComments;
  if (req.allowComments == "on") {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };
  new Story(newStory)
    .save()
    .then(story => res.redirect("/stories"))
    .catch(err => console.log(err));
});

module.exports = router;
