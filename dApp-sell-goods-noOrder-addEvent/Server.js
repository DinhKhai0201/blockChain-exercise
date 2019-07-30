var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

app.use(express.static(__dirname + '/views/images')); 
app.use(express.static(__dirname + '/views/css')); 
app.use(express.static(__dirname + '/views/js')); 

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/cart",function(req,res){
  res.sendFile(path + "cart.html");
});

router.get("/manage",function(req,res){
  res.sendFile(path + "manage.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("run...");
});