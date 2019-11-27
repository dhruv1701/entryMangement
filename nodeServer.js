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

app.set('views',path.join(__dirname,'views'));
app.use('/js', express.static(__dirname + './public/javascript/'));
app.use('/css', express.static(__dirname + './public/css/'));
app.set("view engine","hbs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// const {entrydocument}=require('./model/entrydocument.js');
// const {dataEntry}=require('./model/database.js');

// mongoose.connect('mongodb://localhost:27017/entrydocument');

/*app.use(function(req, res, next) {
    var allowedOrigins = "*";
    var origin = req.headers.origin;
    console.log(allowedOrigins.indexOf(origin));
    if(allowedOrigins.indexOf(origin) > -1){
        console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});*/

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   secure : true,
//   auth: {
//     user: 'sharmadhruv17011999@gmail.com',
//     pass: 'appcxhcxeveyplzf'
//   },
//   tls: {
//       rejectUnauthorized : false
//   }
// });

// const nexmo = new Nexmo({
//     apiKey: 'd5af66db',
//     apiSecret: 'QPpi9KawCNXFJvqj',
// });

// const from = 'Nexmo';

app.get("/",(req,res)=>{
    res.render("./public/index.html");
})

app.get("/checkout",(req,res)=>{
    res.render("checkout");
})

// app.post("/checkin",(req,res)=>{
//     console.log("checking in");
//     var body=req.body;
//     var datetime = new Date();
//     var newdocument=new entrydocument({
//         vname : body.vname,
//         vemail : body.vemail,
//         vphno : body.vphno,
//         checkin : datetime,
//         hname : body.hname,
//         hemail : body.hemail,
//         hphno : body.hphno,
//         office : body.office
//     });
//     var mailOptions = {
//         from: 'sharmadhruv17011999@gmail.com',
//         to: body.hemail,
//         subject: 'Visiting Information',
//         text: "visitor name : "+body.vname+"\n"+"visitor email : "+body.vemail+"\n"+"visitor phno : "+body.vphno+""
//       };
//     newdocument.save((err)=>{
//         if(err)
//             res.send("error");
//         else
//         {
//             transporter.sendMail(mailOptions, function(error, info){
//                 if (error) {
//                   console.log(error);
//                 } else {
//                   console.log('Email sent: '+ info.response);
//                 }
//             });
//             nexmo.message.sendSms(from,"+91"+body.hphno,mailOptions.text,(err,result)=>{
//                 if(err)
//                     console.log(err);
//                 else
//                     console.log(result);
//             });
//             //nexmo.message.sendSms(from, body.hphno, mailOptions.text);
//             res.send("succ-checkin");
//         }
//     });
//     //function to send email
// })

// app.post("/checkout",(req,res)=>{
//     var body=req.body;
//     var DateTime = new Date();
//     var vobj={
//         vname : body.cname,
//         vemail : body.cemail,
//         vphno : body.cphno,
//     }
//     if(vobj.vname=="" || vobj.vemail=="" || vobj.vphno=="")
//         res.send("Please Enter the data");
//     else
//     {
//         var newdocument=entrydocument.findOneAndRemove(vobj,(err,result)=>{
//             if(err!=null)
//                 res.send("error");
//             else if(result!=null)
//             {
//                 var mailOptions = {
//                     from: 'sharmadhruv17011999@gmail.com',
//                     to: body.cemail,
//                     subject: 'Visit Info',
//                     text:"name : "+result.vname+"\n"+"email : "+result.vemail+"\n"+"phno : "+result.vphno+"\n"+"Check-In-Time :"+result.checkin.getHours()+" "+result.checkin.getMinutes()+"\n"+"Check-Out-Time :"+DateTime.getHours()+" "+DateTime.getMinutes()+"\n"+"host name : "+result.hname+"\n"+"host email : "+result.hemail+""
//                 };
//                 var entry= new dataEntry({
//                     vname : result.vname,
//                     vemail : result.vemail,
//                     vphno : result.vphno,
//                     checkin : result.checkin,
//                     checkout : DateTime,
//                     hname : result.hname,
//                     hemail : result.hemail,
//                     hphno : result.hphno,
//                     office : result.office
//                 });
//                 entry.save((err)=>{
//                     if(err)
//                         console.log("Internal Server error");
//                 })
//                 transporter.sendMail(mailOptions, function(error, info){
//                     if (error) {
//                       console.log(error);
//                     } else {
//                       console.log('Email sent: '+ info.response);
//                     }
//                 });
//                 nexmo.message.sendSms(from ,"+91"+ result.vphno, mailOptions.text, (err,final)=>{
//                     if(err)
//                         console.log(err);
//                     else
//                         console.log(final);
//                 }); 
//                 res.send("succ-checkout");
//             }
//             else if(result==null)
//                 res.send("no matching document found");
//         });
//     }
// })

server.listen(API_PORT,'0.0.0.0',() => console.log(`LISTENING ON PORT ${API_PORT}`));
