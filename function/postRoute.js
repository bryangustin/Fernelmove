const passport = require('passport');

const postRoute = function (app) {

    //sign in
    app.post('/login',(req,res,next)=>{
        passport.authenticate('local',{
            successRedirect : '/my-account',
            failureRedirect : '/users/login',
            failureFlash : true,
        })(req,res,next);
    });

}

module.exports = postRoute