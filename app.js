//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose")
const _ = require('lodash')

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

//Database connection
mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {useNewUrlParser: true})

const Schema = mongoose.Schema
const itemSchema = new Schema({name: String})
const listSchema = new Schema({name: String, item: [itemSchema]})

const Item = mongoose.model("Item", itemSchema)
const List = mongoose.model("List", listSchema)

const item1 = new Item({
  name: "Welcome to your todolist!"
})

const item2 = new Item({
  name: "Hit the + button to add a new item."
})

const item3 = new Item({
  name: "<-- Hit this to delete an item."
})

const defaultItem = [item1,item2,item3]

// Adding default items to db
//Item.insertMany(defaultItem)


//GET Home route
app.get("/", function(req, res){
  
     Item.find({}).then((foundItems) => {

      if(foundItems.length === 0){
        Item.insertMany(defaultItem).catch((err)) ; {
          console.log(err);
        }
      res.redirect("/")
    } else {
      res.render("list", {listOfTitle: "Today", newListItems: foundItems})
    }
    })

});

//POST After clicking button
app.post("/", function (req,res) {

  //Adding new items to db
  const itemName = req.body.todo
  const listName = req.body.list
  
  const item = new Item({
    name: itemName
  })

  if(listName === "Today"){
    item.save()
    res.redirect("/")
  } else {
      List.findOne({name: listName}).then((foundList) => {
        foundList.item.push(item)
        foundList.save()
        res.redirect("/" + listName)
      })
    }
  })

  app.post("/delete", function (req,res) {

      const checkedItemId = req.body.checkbox
      const listName = req.body.listName

        if(listName === "Today"){
          Item.findByIdAndRemove(checkedItemId).exec()
          res.redirect("/")
        } else {
          List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: checkedItemId}}}).exec()
          res.redirect("/" + listName)
        }


    })

  app.get("/:customListName", function (req,res) {

    const customListName = _.capitalize(req.params.customListName)

    List.findOne({name: customListName}).exec().then((foundList) => {

      if(!foundList){
        //create a new list
        const list = new List({
          name: customListName,
          items: defaultItem
        })

        list.save()
        res.redirect("/" + customListName)
      } else {
        //show an existing list
        res.render("list", {listOfTitle: foundList.name, newListItems: foundList.item})
      }
    })
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
