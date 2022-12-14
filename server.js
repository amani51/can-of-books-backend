"use strict";

//------IMPORT SECTIONS-------//
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
let Book = require("./schema");

//------MONGOOSE CONFIGURATION-------//
// mongoose.connect("mongodb://localhost:27017/Book", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(`${process.env.mongodb_url}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//------SEEDING DATA-------//
async function seedData() {
  const firstBook = new Book({
    title: "Quran",
    description:
      "The Quran, also romanized Qur'an or Koran, is the central religious text of Islam, believed by Muslims to be a revelation from God. It is organized into 114 chapters, which consist of verses",
    status: "Favorite Five",
    email: process.env.email
  });

  const secondBook = new Book({
    title: "Ar-Raheeq- ul-Makhtum",
    description:
      "Published in 1983 this book is a biography of Messenger Mohammad PBUH. The Book revolves around old Arab sources that go back to the 9th century, and some of the chapters are translated for the first time. So the book offers new insights and details. The biography contains 85 chapters and is translated into many languages.",
    status: "Favorite Five",
    email: process.env.email
  });

  const thirdBook = new Book({
    title: "Loving our Parents",
    description:
      "The book is a collection of stories from people regarding treating our parents with respect and honor. Abdul Malik Mujahid details our duties and obligations to our parents in the light of Sunnah who has sacrificed to raise and educate us.",
    status: "Recommended To Me",
    email: process.env.email
  });

  await firstBook.save();
  await secondBook.save();
  await thirdBook.save();
}
// seedData()
//------ROUTE SECTIONS-------//
app.get("/", getHomeHandler);
app.get("/test", getTestHandler);
app.get("/books", getBookHandler);
app.post("/books", addBookHandler);
app.delete('/books/:id',deleteBookHandler);
app.put('/books/:id',updateBookHandler);
app.get("*", getDefaultHandler);

//------HANDLER SECTIONS-------//

// http://localhost:3001/
function getHomeHandler(req, res) {
  res.send("HI FROM HOME ROUTE");
}

// http://localhost:3001/test
function getTestHandler(request, response) {
  response.send("test request received");
}
// http://localhost:3001/books
function getBookHandler(req,res) {
  console.log("req.query.email",req.query.email)
  Book.find({email:req.query.email},(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      else
      {
          console.log(result);
          res.json(result);
      }
  })
}

// http://localhost:3001/books // addBooks
// http://localhost:3001/books?title=vghv&description=jhjiu&status=ljhbgjb
async function addBookHandler(req,res){
  console.log(req.body.email)
  const {title,description,status,email} = req.body
 await Book.create({
    title: title,
    description:description,
    status:status ,
    email:email
  })
  Book.find({email:email},(err,result)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log(result);
        res.json(result);
    }
})
}

function deleteBookHandler(req,res){
  const bookId = req.params.id;
  console.log("req.params",req.params)
  // const email=req.query
  console.log("email",req.query.email)
  Book.deleteOne({_id:bookId},(err,result)=>{
    Book.find({email:req.query.email},(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      else
      {
          console.log(result);
          res.json(result);
      }
  })

  })
}

function updateBookHandler(req,res){
  const id = req.params.id;
  const {title,description,status,email} = req.body
    console.log(req.body);
    Book.findByIdAndUpdate(id,{title,description,status,email},(err,result)=>{
        if(err) {
            console.log(err);
        }
        else {
          Book.find({email:email},(err,result)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log(result);
                res.json(result);
            }
        })
        }
    })
}

// http://localhost:3001/*
function getDefaultHandler(req, res) {
  res.status(404).send("SORRY! PAGE IS NOT FOUND");
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
