var express = require('express');
var app = express();
// for form post: requires install
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//for file upload
var fs = require("fs");
// requires install
var multer  = require('multer');


//http://127.0.0.1:8081/images/logo.png will show the image in the public folder
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

// cookies
app.use(cookieParser());

//for file upload
//does not work: app.use(multer({ dest: '/tmp/'}));
app.use(multer({dest:__dirname+'/tmp/'}).any());

var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
}
// with /u, it will run the / match
app.get('/id/:id', function (req, res) {
   console.log("Got a GET request for the id");
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id]
      console.log( user );
      res.end( JSON.stringify(user));
   });
})


app.post('/addUser', function (req, res) {
   console.log("Got a GET request for the addUser");
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user4"] = user["user4"];
       console.log( data );
       res.end( JSON.stringify(data));
   });
})

//Accessing the HTML document using http://127.0.0.1:8081/index.htm will generate the following form
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.query.first_name,
      last_name:req.query.last_name
   };
   console.log(response);
   // redirects to a page with {"first_name":"Jin","last_name":"Li"} on the page
   res.end(JSON.stringify(response));
})

app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

app.post('/file_upload', function (req, res) {
  //req.files is array, so need to index it
   console.log(req.files);
   console.log(req.files[0].filename);
   console.log(req.files[0].path);
   console.log(req.files[0].mimetype);
   var file = __dirname + "/a" + req.files[0].filename;
   fs.readFile( req.files[0].path, function (err, data) {
      fs.writeFile(file, data, function (err) {
         if( err ){
            console.log( err );
            }else{
               response = {
                  message:'File uploaded successfully',
                  filename:req.files[0].filename // this is just setting the response, not the actual output file
               };
            }
         console.log( response );
         res.end( JSON.stringify( response ) );
      });
   });
})


// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   console.log("Cookies: ", req.cookies);
   res.send('Hello GET');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
/*
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})
*/
var id = 2;

app.delete('/deleteUser', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + id];

       console.log( data );
       res.end( JSON.stringify(data));
   });
})


// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
//   res.send('Page Listing');
// this would prompt to open or save file
  //res.sendFile( __dirname + "/" + "users.json" );
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
  });

})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})

// put this last: catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('index');
});


var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
