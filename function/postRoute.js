const passport = require('passport');
const User = require("../models/user");
const bcrypt = require('bcrypt');

const postRoute = function (app) {

    //sign in
    app.post('/login',(req,res,next)=>{
        passport.authenticate('local',{
            successRedirect : '/users/my-account',
            failureRedirect : '/users/login',
            failureFlash : true,
        })(req,res,next);
    });

    //Register
    app.post('/register',(req,res)=>{
        const {name,lastName,email, password, password2} = req.body;
        let errors = [];

        if(!name || !lastName || !email || !password || !password2) {
            errors.push({msg : "Il faut remplir tous les champs."})
        }

        //check if match
        if(password !== password2) {
            errors.push({msg : "les mots de passe ne correspondent pas."});
        }

        //check if password is more than 6 characters
        if(password.length < 6 ) {
            errors.push({msg : 'le mot de passe doit faire minimum 6 caractères.'})
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
                    errors.push({msg: 'Un compte existe déjà avec cet email.'});
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
                            req.flash('success_msg','compte enregistré!');
                            res.redirect('/users/login');
                        })
                        .catch(value => console.log(value));                      
                    }));
                }
            })
        }
    });

    // logout
    app.get('/logout',(req,res)=>{
        req.logout();
        req.flash('success_msg','Tu es déconnecté.');
        res.redirect('/users/login');
    })

    //Delete Account
    app.post('/delete',(req,res)=>{
        const {password} = req.body;
        let errors = [];
        
        bcrypt.compare(password, req.user.password, function(err, result) {
            if(result === false){
                errors.push({msg : "Mot de passe incorrect."})
            
            } else { // delete Account
                const id = req.user._id;
                User.findByIdAndDelete(id, err => { // update the user's email
                    if (err) return res.send(500, err);
                    req.logout();
                    req.flash('success_msg','Ton compte a été suprimé.');
                    res.redirect('/users/login');
                });
            }

            if(errors.length > 0 ) {
                res.render('my-account', {
                    user : req.user,
                    errors : errors,
                    page : ''
                })
            }
        });
    });

};

module.exports = postRoute