//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let newItems = ["Buy Food", "Cook Food", "Eat Food"]

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

//GET Home route
app.get("/", function(req, res){
  let today = new Date()

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  let day = today.toLocaleDateString("en-US", options)

  res.render("list", {kindOfDay: day, newListItems: newItems})
});

//POST After clicking button
app.post("/", function (req,res) {

  let newItem = req.body.todo
  
  newItems.push(newItem)

  res.redirect("/")
  })


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
