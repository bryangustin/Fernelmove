const passport = require('passport');
const User = require("../models/user");
const bcrypt = require('bcrypt');

const postRoute = function (app) {

    //sign in
    app.post('/login',(req,res,next)=>{
        passport.authenticate('local',{
            successRedirect : '/my-account',
            failureRedirect : '/users/login',
            failureFlash : true,
        })(req,res,next);
    });

    //Register
    app.post('/register',(req,res)=>{
        const {name,lastName,email, password, password2} = req.body;
        let errors = [];

        if(!name || !lastName || !email || !password || !password2) {
            errors.push({msg : "Please, fill in all fields"})
        }

        //check if match
        if(password !== password2) {
            errors.push({msg : "passwords don't match"});
        }

        //check if password is more than 6 characters
        if(password.length < 6 ) {
            errors.push({msg : 'password must be at least 6 characters'})
        }

        if(errors.length > 0 ) {
            res.render('register', {
                errors : errors,
                name : name,
                lastName : lastName,
                email : email,
                password : password,
                password2 : password2
            })
        } else { //validation passed
            User.findOne({email : email}).exec((err,user)=>{
  
                if(user) {
                    errors.push({msg: 'email already registered'});
                    res.render('register', {
                        errors : errors
                    })
                } else {
                    const newUser = new User({
                        name : name,
                        lastName : lastName,
                        email : email,
                        password : password
                    });
        
                    //hash password
                    bcrypt.genSalt(10,(err,salt) => bcrypt.hash(newUser.password,salt,(err,hash)=> {
                        if(err) throw err;
                        
                        newUser.password = hash; //save pass to hash
                        newUser.save() //save user

                        .then(() => {
                            req.logout();
                            req.flash('success_msg','Register Successful');
                            res.redirect('/users/login');
                        })
                        .catch(value => console.log(value));                      
                    }));
                }
            })
        }
    });

};

module.exports = postRoute