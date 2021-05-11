//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname +"/date.js");
const _ = require("lodash");

const mongooose = require("mongoose");

mongooose.connect("mongodb://localhost:27017/todolistDB" , {useNewUrlParser: true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//Home page list schema 


const itemsSchema = {
    name: String
};

const Item = mongooose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to to do list"
});

const item2 = new Item({
    name: "Hit + to add new item"
});

const item3 = new Item({
    name: "<- Hit here to clear this item"
});

const defaultItems = [item1, item2, item3];

//A new schema for custom lists

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongooose.model("List", listSchema);


//Routes

app.get("/",function(req,res){

    // let day = date();

    Item.find({}, function(err, foundItems) {

        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("Successfully save items to DB");
                }
            });
            res.redirect("/");
        }

        res.render("list", {listTitle: "Today", newListItems: foundItems});
    })

});

app.post("/", function(req,res){

    console.log(req.body);

   const itemName = req.body.newItem;
   const listName = req.body.list;

   const item = new Item({
       name: itemName
   });

   if(listName === "Today") {
    item.save();

    res.redirect("/");
   } 
   else {
       List.findOne({name: listName}, function(err, foundList){
           foundList.items.push(item);
           foundList.save();
           res.redirect("/"+listName)
       })
   }


});

app.get("/:customListName", function(req,res){

    const customListName = _.capitalize(req.params.customListName);


    List.findOne({name: customListName}, function(err, foundList){
        if(!err) {
            if(!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();

                res.redirect("/"+ customListName);
            } else {
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    })

});


app.post("/work", function(req,res){
    item = req.body.newItem;

    workItems.push(item);
    res.redirect("/work");
})

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err) {
                console.log("successfully deleted item");
                res.redirect("/");
            }
        });
    
    }
    else {
        List.findByIdAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}, function(err, foundList){
            if(!err) {
                res.redirect("/"+ listName);
            }
        }
        });
    }


});

app.listen(3000, function(){
    console.log("Server started at port 3000");
});