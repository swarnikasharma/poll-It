
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var asyn =    require('async');
var glob_username="";
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var urlParser = bodyParser.urlencoded({ extended: true })

var pollData;
///////////////////////////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost/polldb',{ useMongoClient: true });

mongoose.connection.once('open',function(){

  console.log("connected mongo db success");

}).on('error',function(){

  console.log("connection to  mongo db is failed");

});



const Schema = mongoose.Schema;
///////////////////////////////////////////////////////////////////////////////////////
const RegisterUserSchema = new Schema({

  username:String,
  password:String,
  email:String

});

const RegisterUser = mongoose.model('users',RegisterUserSchema);
//module.exports=RegisterUser;
//////////////////////////////////////////////////////////////////////////////////
const PollUserSchema = new Schema({
  pollname:String,
  username:String,
  ques1:String,
  option1:String,
  option2:String,
  option3:String,
  option4:String,

  vote1:Number,
  vote2:Number,
  vote3:Number,
  vote4:Number,


});

const PollUser = mongoose.model('polluser',PollUserSchema);




/////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

  app.get('/login',function(req,res){

      console.log("login successful");

      res.render('login');

  });

  app.get('/register',function(req,res){

    console.log("register");

      res.render('register');
  });

  app.get('/home',function(req,res){

    console.log("inside home");

      res.render('home');
  });

  app.get('/createPoll',function(req,res){

    console.log("inside poll");

      res.render('createPoll');
  });

  app.get('/viewpoll',function(req,res){

    console.log("view poll");

      res.render('viewpoll');
  });
  app.get('/viewAll',function(req,res){

    console.log("view poll");

      res.render('viewAll');
  });
  app.get('/votePoll',function(req,res){
    console.log("votePoll called");
    res.render('votePoll');//,pollData);
  });


//////////////////////////////////////////////////////////////////////////////////////
  app.post('/register_user_database',urlencodedParser,function(req,res){


        console.log("register_user_database");
        console.log(req.body);

        const user1 = new RegisterUser({
          username:req.body.username,
          password:req.body.password
        });

        user1.save().then(function(result){

              console.log("file inserted to register_user_database");
              res.json(result);
        });


  });

/////////////////////////////////////////////////////////////////////

  app.post('/poll_user_database',urlencodedParser,function(req,res){


        console.log("poll_user_database");
        console.log(req.body);

        const user = new PollUser({
          pollname:req.body.pollname,
          username:glob_username,
          ques1:req.body.ques1,
          option1:req.body.option1,
          option2:req.body.option2,
          option3:req.body.option3,
          option4:req.body.option4,

          vote1:0,
          vote2:0,
          vote3:0,
          vote4:0,

        });

        user.save().then(function(result){

              console.log("file inserted to poll_user_database");
              res.json(result);
        });


  });

///////////////////////////////////////////////////////////////////////////////////////////
  app.post('/check_user',urlencodedParser,function(req,res){

        console.log("check_for_username_login");

        console.log(req.body.username);
        var username=req.body.username;
        //glob_username=query;
        var password=req.body.password;
        //console.log(query+qu);
        RegisterUser.find({username:username, password:password},function(err,RegisterUser){
          if(err)
          {
            console.log(err);

          }
      else
      {
        if(!RegisterUser) {
            console.log("invalid user");

            res.json(RegisterUser);
          }
          else {
            console.log("valid user");
            glob_username=req.body.username;

          //  console.log(JSON.stringify(RegisterUser));
            res.json(RegisterUser);

          }
        }
        });
        });
//////////////////////////////////////////////////////////////////////////////////////////////
app.post('/view_ur_poll',function(req,res){
console.log("inside view_ur_poll");
  PollUser.find({username:glob_username},function(err,PollUser){
    if(err)
    {
      console.log(err);

    }
else
{
  if(!PollUser) {
      console.log("No Polls");

      res.json(PollUser);
    }
    else {

      res.json(PollUser);

    }
  }
  });
});
  app.post('/viewAll',function(req,res){
  console.log("poll");
    PollUser.find({},function(err,PollUser){
      if(err)
      {
        console.log(err);

      }
  else
  {
    if(!PollUser) {
        console.log("No Polls");

        res.json(PollUser);
      }
      else {

        res.json(PollUser);

      }
    }
    });


  });
  app.post('/votePoll',urlencodedParser,function(req,res){
  console.log("inside viewpoll for vote");
  console.log(req.body.pollname);
  var pollname=req.body.pollname;
  var username=req.body.username;
    PollUser.find({pollname:pollname,username:username},function(err,PollUser){
      if(err)
      {
        console.log(err);

      }
  else
  {
    if(!PollUser) {
        console.log("No Polls");

        res.json(PollUser);
      }
      else {

          pollData=PollUser;
          console.log(pollData);
          res.json(PollUser);

      }
    }
    });



});
///////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/pollData',urlencodedParser,function(req,res){
console.log("poll to vote");
res.json(pollData);

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/saveVote',urlencodedParser,function(req,res){
console.log("inside save vote");
console.log(req.body.pollname);
var pollname=req.body.pollname;
var username=req.body.username;
var option=req.body.option;
var opt="vote"+option;
console.log(pollname+" "+username+" "+option);

console.log("opt="+opt);
if(option==1)
{
  PollUser.findOneAndUpdate({pollname:pollname,username:username},{$inc:{vote1:1}},{new:true},function(err,PollUser){
    if(err)
    {
      console.log("error...");

    }
else
{
  if(!PollUser) {
      console.log("No Polls");

      res.json(PollUser);
    }
    else {
      console.log("yolo");
          console.log(JSON.stringify(PollUser));
          res.json(PollUser);

    }
  }
  });
}

if(option==2)
{
  PollUser.findOneAndUpdate({pollname:pollname,username:username},{$inc:{vote2:1}},{new:true},function(err,PollUser){
    if(err)
    {
      console.log("error...");

    }
else
{
  if(!PollUser) {
      console.log("No Polls");

      res.json(PollUser);
    }
    else {
      console.log("yolo");
          console.log(JSON.stringify(PollUser));
          res.json(PollUser);

    }
  }
  });
}
if(option==3)
{
  PollUser.findOneAndUpdate({pollname:pollname,username:username},{$inc:{vote3:1}},{new:true},function(err,PollUser){
    if(err)
    {
      console.log("error...");

    }
else
{
  if(!PollUser) {
      console.log("No Polls");

      res.json(PollUser);
    }
    else {
      console.log("yolo");
          console.log(JSON.stringify(PollUser));
          res.json(PollUser);

    }
  }
  });
}
if(option==4)
{
  PollUser.findOneAndUpdate({pollname:pollname,username:username},{$inc:{vote4:1}},{new:true},function(err,PollUser){
    if(err)
    {
      console.log("error...");

    }
else
{
  if(!PollUser) {
      console.log("No Polls");

      res.json(PollUser);
    }
    else {
      console.log("yolo");
          console.log(JSON.stringify(PollUser));
          res.json(PollUser);

    }
  }
  });
}





});
////////////////////////////////////////////////////////////////////////////////////////////
app.post('/removePoll',urlencodedParser,function(req,res){
console.log("inside save vote");
console.log(req.body.pollname);
var pollname=req.body.pollname;
var username=req.body.username;
//var option=req.body.option;
//var opt="vote"+option;
console.log(pollname+" "+username);

//console.log("opt="+opt);

  PollUser.findOneAndRemove({pollname:pollname,username:username},function(err,PollUser){
    if(err)
    {
      console.log("error...");

    }
    else
    {
      console.log("deleted");
      res.render('home');
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/editPoll',urlencodedParser,function(req,res){
console.log("inside save vote");
console.log(req.body.pollname);
var pollname=req.body.pollname;
var username=req.body.username;
//var option=req.body.option;
//var opt="vote"+option;
console.log(pollname+" "+username);

//console.log("opt="+opt);

  PollUser.findOneAndRemove({pollname:pollname,username:username},function(err,PollUser){
    if(err)
    {
      console.log("error...");

    }
    else
    {
      console.log("deleted");
      //res.render('home');
    }
  });
  const poll = new PollUser({
    pollname:req.body.pollname,
    username:req.body.username,
    ques1:req.body.ques1,
    option1:req.body.option1,
    option2:req.body.option2,
    option3:req.body.option3,
    option4:req.body.option4,
    vote1:req.body.vote1,
    vote2:req.body.vote2,
    vote3:req.body.vote3,
    vote4:req.body.vote4

  });

  poll.save().then(function(result){

        console.log("file inserted to pollUsers");
        res.json(result);
  });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////

};
