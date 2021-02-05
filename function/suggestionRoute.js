//Suggestion:
const Suggestion = require("../models/suggestion");

//MAIL
const nodemailer = require("nodemailer");

const suggestionRoute = function (app) {

//Filtre insulte:
var leoProfanity = require('leo-profanity');
var frenchBadwordsList = require('french-badwords-list');
 
leoProfanity.clearList();
leoProfanity.add(frenchBadwordsList.array);
//==============================================================

//Test package filtre insulte
// console.log(leoProfanity.clean(`<badword>`));

//==============================================================

    app.post('/suggestion',(req,res)=>{
        console.log(req.body);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        });    
        
        transporter.sendMail({
            from: process.env.MAIL,
            to: "fernelmove@gmail.com",
            subject: leoProfanity.clean(`${req.body.title}`),
            text: leoProfanity.clean(`${req.body.suggestion}`),
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    
        let suggestion = new Suggestion({
            suggestion : leoProfanity.clean(`${req.body.suggestion}`)
        })

        suggestion.save()

        res.redirect('back');
    })
}

module.exports = suggestionRoute
