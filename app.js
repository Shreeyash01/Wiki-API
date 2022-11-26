const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);

app.route("/articles")
.get(function(req,res){
    Article.find({},function(err,foundArticles){
        // console.log(foundArticles);
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }  
    });
})
.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Article added!");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Deleted!")
        }else{
            res.send(err);
        }
    });
});

// app.get("/articles",function(req,res){
//     Article.find({},function(err,foundArticles){
//         // console.log(foundArticles);
//         if(!err){
//             res.send(foundArticles);
//         }else{
//             res.send(err);
//         }
        
//     })
// })

// app.post("/articles",function(req,res){
//     // console.log(req.body.title);
//     // console.log(req.body.content);

//     const newArticle=new Article({
//         title:req.body.title,
//         content:req.body.content
//     });
//     newArticle.save(function(err){
//         if(!err){
//             res.send("Article added!");
//         }else{
//             res.send(err);
//         }
//     });
// });

// app.delete("/articles",function(req,res){
//     Article.deleteMany(function(err){
//         if(!err){
//             res.send("Deleted!")
//         }else{
//             res.send(err);
//         }
//     });
// });

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No matching articles.");
        }
    })
});

app.listen(5500, function() {
  console.log("Server started on port 5500");
});