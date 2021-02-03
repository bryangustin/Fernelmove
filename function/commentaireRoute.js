//test commentaire:
const Commentaire = require("../models/commentaires");

const commentaireRoute = function (app) {

    app.post('/commentaire',(req,res)=>{
        console.log(req.body);
        let commentaire = new Commentaire({
            commentaire : req.body.commentaire
        })
        commentaire.save()
        res.redirect('back');
    })
}

module.exports = commentaireRoute
