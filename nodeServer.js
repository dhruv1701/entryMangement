// requiring all the modules required
const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require('body-parser');
const hbs=require("hbs");
const cors=require('cors');
const http = require("http");
const path=require('path');
const nodemailer=require('nodemailer');
const Nexmo=require('nexmo');

var app=express();

const API_PORT = process.env.PORT || 3001;

var server=http.createServer(app);

//setting up all the middlewares 
app.set('views',path.join(__dirname,'views'));
app.use('/js', express.static(__dirname + './public/javascript/'));
app.use('/css', express.static(__dirname + './public/css/'));
app.set("view engine","hbs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//allowing cross-origin-resource-sharing
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//requiring mongodb models

//entrydocument model stores the data of the currently checked in guest's who havent checked out yet
const {entrydocument}=require('./model/entrydocument.js');

//dataEntry model stores the data of the guest's who have checked out
const {dataEntry}=require('./model/database.js');

//connecting to mongodb server
mongoose.connect('mongodb://localhost:27017/entrydocument');

//setting up the nodemailer to automatically sends email to guest and host
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure : true,
  auth: {
    user: 'sharmadhruv17011999@gmail.com',
    pass: 'appcxhcxeveyplzf'
  },
  tls: {
      rejectUnauthorized : false
  }
});

//setting up the nexmo to automatically sends sms to guest and host
const nexmo = new Nexmo({
    apiKey: 'd5af66db',
    apiSecret: 'QPpi9KawCNXFJvqj',
});

const from = 'Nexmo';

//render the index.html page
app.get("/",(req,res)=>{
    res.render("./public/index.html");
})

//renders the checkout.hbs 
app.get("/checkout",(req,res)=>{
    res.render("checkout");
})

//accepts the incoming data from the index.html where guest provides the data about guest and host
app.post("/checkin",(req,res)=>{
    console.log("checking in");
    var body=req.body;
    
    //cretaing a date object to save the checkin time of guest
    var datetime = new Date();
    
    //creating a new entrydocument type object to save in database
    var newdocument=new entrydocument({
        vname : body.vname,
        vemail : body.vemail,
        vphno : body.vphno,
        checkin : datetime,
        hname : body.hname,
        hemail : body.hemail,
        hphno : body.hphno,
        office : body.office
    });
    
    //setting up an object to tell nodemailer from, to, subject and text of the email to be sent to the host 
    var mailOptions = {
        from: 'sharmadhruv17011999@gmail.com',
        to: body.hemail,
        subject: 'Visiting Information',
        text: "visitor name : "+body.vname+"\n"+"visitor email : "+body.vemail+"\n"+"visitor phno : "+body.vphno+""
      };
    
    //saves the document in database
    newdocument.save((err)=>{
        if(err)
            res.send("error");
        else
        {
            //sending email to host
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: '+ info.response);
                }
            });
            
            //sending sms to host
            nexmo.message.sendSms(from,"+91"+body.hphno,mailOptions.text,(err,result)=>{
                if(err)
                    console.log(err);
                else
                    console.log(result);
            });
            
            //sending response to the front end
            res.send("succ-checkin");
        }
    });
})

//accpets data and checks out the guest
app.post("/checkout",(req,res)=>{
    var body=req.body;
    
    //checkout time of guest
    var DateTime = new Date();
    
    var vobj={
        vname : body.cname,
        vemail : body.cemail,
        vphno : body.cphno,
    }
    
    //if any of the all 3 proprties found empty sends an error response to front end
    if(vobj.vname=="" || vobj.vemail=="" || vobj.vphno=="")
        res.send("Please Enter the data");
    else
    {
        //finds the guest's document in the database and removes that document from entrydocument model telling that this guest has checked out 
        var newdocument=entrydocument.findOneAndRemove(vobj,(err,result)=>{
            if(err!=null)
                res.send("error");
            else if(result!=null)
            {
                //mail options to send mail to guest about his visit
                var mailOptions = {
                    from: 'sharmadhruv17011999@gmail.com',
                    to: body.cemail,
                    subject: 'Visit Info',
                    text:"name : "+result.vname+"\n"+"email : "+result.vemail+"\n"+"phno : "+result.vphno+"\n"+"Check-In-Time :"+result.checkin.getHours()+" "+result.checkin.getMinutes()+"\n"+"Check-Out-Time :"+DateTime.getHours()+" "+DateTime.getMinutes()+"\n"+"host name : "+result.hname+"\n"+"host email : "+result.hemail+""
                };
                
                //saving the guest's full information name,email,phno,checkin,checkout,host,host email,host phno,address in database for future reference
                var entry= new dataEntry({
                    vname : result.vname,
                    vemail : result.vemail,
                    vphno : result.vphno,
                    checkin : result.checkin,
                    checkout : DateTime,
                    hname : result.hname,
                    hemail : result.hemail,
                    hphno : result.hphno,
                    office : result.office
                });
                entry.save((err)=>{
                    if(err)
                        console.log("Internal Server error");
                })
                
                //sends mail to guest about his visit
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: '+ info.response);
                    }
                });
                
                //sends sms to guest about his visit
                nexmo.message.sendSms(from ,"+91"+ result.vphno, mailOptions.text, (err,final)=>{
                    if(err)
                        console.log(err);
                    else
                        console.log(final);
                }); 
                
                //sends response to front end
                res.send("succ-checkout");
            }
            else if(result==null)
                res.send("no matching document found");
        });
    }
})

//starting server to listen on the specified port or port provided by the cloud
server.listen(API_PORT,'0.0.0.0',() => console.log(`LISTENING ON PORT ${API_PORT}`));
