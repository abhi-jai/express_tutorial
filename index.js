var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');
var path = require('path');
//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views','./views');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/Script'));
app.get('/first', function(req, res){
   res.render('first_view');
});

app.get('/dynamic_view', function(req, res){
   	res.render('first_view',{
   		user: {"name" : "push", "age" :"18"} 
	});
});

app.get('/',function(req,res){
  // res.sendFile("index.html", {"root": './views'});
  		res.sendFile('index.html');
});

var personSchema = mongoose.Schema({
   nme: String,
   email: String,
   mob: Number,
   pass: String
});
var Person = mongoose.model("Person", personSchema);

app.post('/save_dtl',urlencodedParser, function(req, res){
   var personInfo = req.body; //Get the parsed information
   console.log(req.body);
   if(!req.body.nme || !personInfo.email || !personInfo.mob){
      res.render('first_view', {
         message: "Sorry, you provided worng info", type: "error"});
   } else {
      var newPerson = new Person({
         nme: personInfo.nme,
         email: personInfo.email,
         mob: personInfo.mob,
         pass: personInfo.pass
      });
		
      newPerson.save(function(err, Person){
         if(err)
            res.render('first_view', {message: "Database error", type: "error"});
         else
            res.render('first_view', {
               message: "New person added", type: "success", person: personInfo});
      });
   }
});

app.get('/show_dtl', function(req, res){
	//res.render('sho_data', {nme: "Database error", type: "error"});
	Person.find(function(err, response){
  		res.render('sho_data',{
  			response :response,
  			title: "show detail"
   			});
	});
});

app.get('/update', function(req, res){
	Person.findOne(function(err, response){
  		res.render('update',{
  			response :response,
  			title: "show detail"
   			});
	});
});


app.listen(3000);
