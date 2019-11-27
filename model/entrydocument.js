const mongoose=require('mongoose');
const validator=require('validator');

//entry schema to store guest and host information
var schema=mongoose.Schema({
        //guest name
        vname :{
        type :String,
        required : true,
        trim : true
        },
        //guest email
        vemail :{
        type:String,
        required :true,
        trim:true,
        unique:true,
        validate: [validator.isEmail,'Invalid email']
        },
        //guest phone number
        vphno :{
        type : String,
        required : true,
        unique: true,
        trim : true,
        minlength: 10,
        maxlength : 10
        },
        //guest checkin time
        checkin :{
            type : Object,
            required : true,
        },
        //guest checkout time
        checkout :{
            type : Object
        },
        //office address
        office :{
            type : String,
            required: true,
            trim: true
        },
        //host name
        hname :{
        type :String,
        required : true,
        trim : true
        },
        //host email
        hemail :{
            type:String,
            required :true,
            trim:true,
            unique:true,
            validate: [validator.isEmail,'Invalid email']
        },
        //host phone number
        hphno :{
            type :String,
            required : true,
            trim : true,
            unique: true,
            minlength: 10,
            maxlength : 10
        },   
});

//indexed on guest's phone number and then on guest's email id
schema.index({vphno: 1,vemail : 1},{unique: true});

var entrydocument=mongoose.model('entrydocument', schema);
module.exports={
    entrydocument
};