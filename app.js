const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articlesSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articlesSchema);

const a1 = new Article({
  title: "Sum",
  content: "A + B ",
});

// a1.save();

app
  .route("/articles")
  .get((req, res) => {
    Article.find({})
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => console.log(err));
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save().then(() => res.send(article));
  })
  .delete((req, res) => {
    Article.deleteMany().then((deletedArticles) => res.send(deletedArticles));
  });

app
  .route("/articles/:articleName")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleName })
      .then((foundArticle) => res.send(foundArticle))
      .catch((err) => console.log(err));
  })
  .put((req, res) => {
    // const updateArticle = new Article({
    //   title: req.body.title,
    //   content: req.body.content,
    // });

    Article.replaceOne(
      { title: req.params.articleName },
      { title: req.body.title, content: req.body.content }
    )
      .then((updateArticle) => res.send(updateArticle))
      .catch((err) => res.send(err));
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleName }, { $set: req.body })
      .then((updateArticle) => res.send(updateArticle))
      .catch((err) => console.log(err));
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleName })
      .then((foundArticle) => res.send(foundArticle))
      .catch((err) => console.log(err));
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
