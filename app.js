require('dotenv').config()
const { json } = require("body-parser");
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");
const  response  = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const LIST_ID = process.env.LIST_ID
const API_KEY = process.env.API_KEY
app.get("/",function(req, res){
      res.sendFile(__dirname + "/signup.html")
});

app.post("/",function(req,res){

    const fname = req.body.Fname
    const lname = req.body.Lname
    const email = req.body.Email

    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fname,
                    LNAME :lname
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/" + LIST_ID;
    const options = {
        method :"POST",
        auth: "prakarti:"+API_KEY
    }
    const request = https.request(url,options,function(response){
        
        if(response.statusCode===200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000...");
});

