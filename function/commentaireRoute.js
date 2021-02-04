//Commentaire:
const Commentaire = require("../models/commentaires");

//MAIL
const nodemailer = require("nodemailer");

const commentaireRoute = function (app) {

    app.post('/commentaire',(req,res)=>{
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
            to: "makrai.yassin@gmail.com",
            subject: `Message de ${"req.body.pseudo"}`,
            text: req.body.commentaire,
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    
        let commentaire = new Commentaire({
            commentaire : req.body.commentaire
        })

        commentaire.save()

        res.redirect('back');
    })
}

module.exports = commentaireRoute
