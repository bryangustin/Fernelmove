const {ensureAuthenticated} = require("../config/403.js");
const User = require("../models/user");

// Function to set all the default get Routes
const mainRoute = function (app, route, file, log) {
    
    if (log === 'logged') {
        app.get(route, ensureAuthenticated, (req, res) => {
            res.render(file)
        })
    } else if (log === 'reset'){
        app.get(route, (req, res) => {
            User.findOne({ 
                resetPasswordToken: req.params.token, // looking for the reset token 
                resetPasswordExpires: { $gt: Date.now()} // expire greater than now
            }, (err, user) =>{
                if (!user){
                    req.flash('error_msg', "Le lien est invalid ou a expiré.")
                    return res.redirect('/password');
                }
                res.render('resetPassword', {
                    token: req.params.token,
                })
            });
        })
    } else {
        app.get(route, (req, res) => {
            res.render(file)
        })
    }
}

module.exports = mainRoute