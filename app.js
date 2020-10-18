//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname +"/date.js");

const app = express();
let items = ["Buy Food","Cook Food","Eat Food"];
let workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){

    let day = date();

    res.render("list", {listTitle: day, newListItems: items});

});

app.post("/", function(req,res){

    console.log(req.body);

    item = req.body.newItem;

    if(req.body.list === "Work")
    { workItems.push(item);
      res.redirect("/work");
    }
    else  {
        items.push(item);
        res.redirect("/");
        
    }


})

app.get("/work",function(req,res){
    res.render("list", {listTitle: "Work", newListItems: workItems})
});

app.post("/work", function(req,res){
    item = req.body.newItem;

    workItems.push(item);
    res.redirect("/work");
})


app.listen(3000, function(){
    console.log("Server started at port 3000");
});