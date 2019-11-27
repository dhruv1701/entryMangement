//index.html script
$(document).ready(function()
{
    //on click of submit button on index.html this function gets called
    $("#submit").click(function()
    {
        //taking all the values from the inputs
        var vname=$("#vname").val(); //guest's name
        var vemail=$("#vemail").val(); //guest's email
        var vphno=$("#vphno").val(); //guest's phone no
        var hname=$("#hname").val(); //host's name
        var hemail=$("#hemail").val(); //host's email
        var hphno=$("#hphno").val(); //host's phone no
        var office = $('#officeSelect').find(":selected").text(); //office address selected form the drop down menu

        //making a post request to server to send all this information about guest and host to the server where it will be saved in database and a mail and sms will be sent to the host
        $.post("/checkin",{vname: vname, vemail: vemail, vphno: vphno, hname: hname, hemail: hemail, hphno: hphno, office : office},function(data,err){
            
            //if the server sends data = "succ-checkin" then the information has been successfully saved in database 
            // else if it sends data = "error" then there has been some error on the server side
            if(data=="succ-checkin")
            {
                window.alert("Successfully Checked In");
                window.location.href="/";
            }
            else if(data=="error")
            {
                window.alert("error");
            }
        });
    });
});