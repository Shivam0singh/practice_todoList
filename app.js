const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const newDate = require(__dirname+"/date.js")

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/newTodo", { useNewUrlParser: true, useUnifiedTopology: true });

let itemsArr = []

const listSchema = mongoose.Schema({
    name : String
})
const List = mongoose.model("List",listSchema)
const list1 = new List({
    name: "gadgets"
})
const list2 = new  List({
    name: "super cars"
})
const list3 = new List({
    name: "fighter jets"
})

const addItems = [list1,list2,list3]
//new Document for custom page

const userListSchema = mongoose.Schema({
    name: String,
    items : [listSchema]
})

const UserList = mongoose.model("UserList",userListSchema)

//user choice input
app.get("/:userChoice",function(req,res){
    const userChoice = _.capitalize(req.params.userChoice)
    
    UserList.findOne({name:userChoice})
    .then((foundList)=>{
        if(!foundList){
            console.log("doesnt exist")
            const customList = new UserList({
                name: userChoice,
                items: addItems
            })
            customList.save();
            res.redirect("/"+userChoice)
        }else{
            console.log("list already exist")
        res.render("main",{heading:foundList.name,items:foundList.items})
        }
    })
    .catch((err)=>{
        console.log(err)
    })
    
})

app.get("/",function(req,res){
    // const currentDate = newDate.printDate();
    List.find()
    .then((content)=>{
        if(content.length ===0){
            List.insertMany(addItems)
            redirect("/")
        }else{
            res.render("main",{heading:"Today",items: content})
        }
       
    })
    .catch((err)=>{
        console.log(err)
    })
    
})

app.post("/",function(req,res){
    // const currentDate = newDate.printDate();
    const newItem = req.body.addNewItem
    const buttonItem = req.body.btn
    const addUserItem = new List({
        name: newItem
    })
    if(buttonItem==="Today"){
        addUserItem.save();
        res.redirect("/")
    }else{
        UserList.findOne({name:buttonItem})
        .then((foundList)=>{
            foundList.items.push(addUserItem)
            foundList.save();
            res.redirect("/"+buttonItem)
        })
    }
    
})

app.post("/delete",function(req,res){
    let checkboxID = req.body.selectCheckbox
    let listName = req.body.listName 

    if(listName==="Today"){
        List.findByIdAndRemove(checkboxID)
    .then(()=>{
        console.log("deleted.")
        res.redirect("/")
    })
    .catch((err)=>{
        console.log(err)
    })
    }else{
        UserList.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkboxID}}})
        .then(()=>{{
                console.log("no errors. rdy to delete.")
                res.redirect("/"+listName)
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    
});


app.listen(2200,(()=>{
    console.log("running on port 2200.")
}))