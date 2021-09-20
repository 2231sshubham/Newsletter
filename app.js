const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');


// app usage definition
app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));



//callback function for get request
function callback(err){
  if(err) throw err
  console.log('Server started.');
}



// get request
app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html")
})



// post request
app.post('/',function(req,res){

  const fname = req.body.fName;
  const lname = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:
        {
          FNAME: fname,
          LNAME: lname
        }
      } ] }

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/ca8d9b474f";

  const options = {
    method: 'POST',
    auth:'myKey:7caca78dfb584155a4db7eb6e7310d17-us5'
  };

  const request = https.request(url,options, function(response) {

    response.on("data",function(data){
        const edata = JSON.parse(data);
        const error = edata.errors;
        if(error.length != 0){
          res.sendFile(__dirname + "/failure.html");
        }
        else{
          res.sendFile(__dirname + "/success.html");
        }
    })
  })


  request.on('error', error => {
    console.error(error)
  })

  request.write(jsonData)
  request.end()
})

app.post("/failure",function(req,res){
  res.redirect("/")
})

app.listen(process.env.PORT || 3000,callback);


//Audience ID ca8d9b474f
// API key 7caca78dfb584155a4db7eb6e7310d17-us5
