let nodemailer = require("nodemailer") ; 

function sendMail(message, recipients){
    let transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com' , 
        service : 'gmail' , 
        auth : {
            user : "acd830980@gmail.com", 
            pass : "abcd2020"
        }
    }) ;
    
    let mailOptions = {
        from : "acd830980@gmail.com" ,
        to : recipients.join(",").toString() , 
        subject  : "Zoom meet Link",
        text : message 
    } ; 
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error)
            console.log(error) ; 
        else    
            console.log("Invite sent successfully !!") ; 
    }) ; 
}

module.exports = sendMail ; 