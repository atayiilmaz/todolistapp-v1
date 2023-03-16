//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")

const app = express()
let newItems = ["Buy Food", "Cook Food", "Eat Food"]
let workItems = []

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

//GET Home route
app.get("/", function(req, res){
  
  let day = date.getDate()

  res.render("list", {listOfTitle: day, newListItems: newItems})
});

//POST After clicking button
app.post("/", function (req,res) {

  let newItem = req.body.todo

  if(req.body.list === "Work"){
    workItems.push(newItem)
    res.redirect("/work")
  } else{
    
    newItems.push(newItem)
    res.redirect("/")
  }
  })

  app.get("/work", function(req,res){

    res.render("list", {listOfTitle: "Work List", newListItems: workItems})
  })

  app.post("/work", function (req,res) {
    let item = req.body.newItem
    workItems.push(item)
    res.redirect("/work")
    })

app.get("/about", function (req,res) {

  res.render("about")
  })


app.listen(3000, function(){
  console.log("Server started on port 3000.")
})
