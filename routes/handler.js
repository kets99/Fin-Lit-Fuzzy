var express = require('express');

var router = express.Router();
var spawn = require("child_process").spawn; 

var path = require('path');
//var queries = require(path.join(__dirname,'../model/queries'));
// const mime = require('mime');
var request = require('request');
//var query = require('.././model/queries');

var section;

//Landing Page
router.get('/',(req,res)=>{
   res.render('landing',{layout : 'landing.handlebars'});
});

//First Quiz
router.get('/first_quiz',(req,res)=>{
    console.log(req.query.section);
    res.render('first_quiz',{layout : 'first_quiz.handlebars'});
    section = req.query.section;
});

//Dashboard
router.get('/dashboard',(req,res)=>{
    res.render('dashboard',{layout : 'dashboard.handlebars'});
});

//Second Quiz
router.get('/second_quiz',(req,res)=>{
    console.log(req.query.section);
    res.render('second_quiz',{layout : 'second_quiz.handlebars'});
    section = req.query.section;
});

//Fetch Section/Domain
router.get('/findSection',(req,res)=> {
    res.send(section);
})

//handler for facebook
router.get('/basics',(req,res)=>{
    console.log("here?");
   res.render('basics',{layout : 'basics.handlebars'});

});


// Function callName() is executed whenever  
// url is of the form localhost:3000/name 
router.get('/ip',(req,res)=>{

    // Use child_process.spawn method from child_process module and assign it to variable spawn       
    // Parameters passed in spawn: 
    // 1. type of script 
    // 2. list containing path of the script and arguments for the script  
    
    var process = spawn('python',["./user_class.py", 
                            req.query.q1, 
                            req.query.q2,
                            req.query.q3,
                            req.query.q4,
                            req.query.q5,
                            req.query.q6,
                            req.query.q7,
                            req.query.q8,
                            req.query.q9] ); 
  
    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    process.stdout.on('data', function(data) { 
        console.log(data.toString());
        res.send(data);
    } )
});

// To run the fuzzy script
router.get('/fuzzy',(req,res) => {
    console.log(req.query.score);
    console.log(req.query.cl);
    var process = spawn('python',["./finlit_fuzzy.py", 
                            req.query.score, 
                            req.query.cl] );

    process.stdout.on('data', function(data) { 
        console.log(data.toString());
        res.send(data);
    }) 
});

 
//For Facebook
var request = require('request');
var OAuth2 = require('oauth').OAuth2;
var oauth2 = new OAuth2("2684637981771820",
                       "8980e6c2c47d6b4f88f18e1e057d823d",
                      "", "https://www.facebook.com/dialog/oauth",
                  "https://graph.facebook.com/oauth/access_token",
                  null);
 router.get('/facebook/auth',function (req, res) {
     var redirect_uri = "https://fin-lit2020.herokuapp.com/facebook/callback";
     // For eg. "http://localhost:3000/facebook/callback"
     var params = {'redirect_uri': redirect_uri, 'scope':'publish_pages, manage_pages'};
     res.redirect(oauth2.getAuthorizeUrl(params));
});
 
router.get('/facebook/callback', function (req, res) {
   if (req.error_reason) {
    res.send(req.error_reason);
   }
 
   if (req.query.code) {
    var loginCode = req.query.code;
    var redirect_uri = "https://fin-lit2020.herokuapp.com/facebook/callback";
   // For eg. "/facebook/callback"
 
 
    oauth2.getOAuthAccessToken(loginCode, { grant_type: 'authorization_code', redirect_uri: redirect_uri},
       function(err, accessToken, refreshToken, params){
       if (err) {
           console.error(err);
           res.send(err);
       }
       // var access_token = accessToken;
       // var expires = params.expires;
       // console.log(req.session);
       // req.session.access_token = access_token;
       // req.session.expires = expires;
       // res.redirect('/get_email');
 
       oauth2.get('https://graph.facebook.com/me', accessToken, function(err, data ,response) {
           if (err) {
           console.error(err);
           res.send(err);
           } else {
           var profile = JSON.parse(data);
           console.log(profile);
           // var profile_img_url = "https://graph.facebook.com/"+profile.id+"/picture";
           }
       });
 
       oauth2.get('https://graph.facebook.com/{page-id}?fields=+access_token&access_token='+accessToken, function(err, data, response) {
           var page_info = JSON.parse(data);
           var page_id = page_info.id;
           var page_access_token = page_info.access_token;
 
           oauth2.post('https://graph.facebook.com/'+page_id+'/feed?message=I reached the Intermediate level on Fin-Lit.&access_token='+page_access_token), function(err, data, response) {
               console.log('Posted');
           }
       });  
 
      }
    );
   }
 
  }); 

module.exports=router;
