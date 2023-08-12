const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2023, 98.7% of websites use JavaScript on the client side for webpage behavior, often incorporating third-party libraries.";
const contactContent1 = "Name: Md Mahedy Hasan Noman"
const contactContent2 = "Email: mehedynoman11@gmail.com"
const contactContent3 = "Phone: +880 1575-306802"

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

require('dotenv').config();
console.log(process.env.MONGODB_URI); // Check if the value is printed to the console

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Rest of your code


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

let posts = [];

app.get("/", function(req, res){
  Post.find()
  .then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })
  .catch(err => {
    console.error(err);

  })
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent1: contactContent1,
    contactContent2: contactContent2,
    contactContent3: contactContent3,
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ( {
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});


app.get("/posts/:postName", function(req, res) {
  const requestedTitle = req.params.postName;

  // Create a case-insensitive regular expression for the title
  const caseInsensitiveTitle = new RegExp(requestedTitle, "i");

  Post.findOne({ title: caseInsensitiveTitle })
    .then(post => {
      if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      } else {
        res.status(404).send("Post not found");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});


const server = app.listen(3000, function() {
  const today = new Date();
  const currentTime = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  console.log(`Server is running at port 3000. Current time is ${currentTime}.`);
});
