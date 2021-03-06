const passport = require('passport');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const postRoute = function (app) {

    //log in
    app.post('/login',(req,res,next)=>{
        passport.authenticate('local',{
            successRedirect : '/users/my-account',
            failureRedirect : '/users/login',
            failureFlash : true,
        })(req,res,next);
    });

    //Register
    app.post('/register',(req,res)=>{
        const {name,email, password, password2, sexe, postalCode, birthday} = req.body;
        const {musique, jeux, cinema, lecture, scout, art, sport, techno} = req.body;
        let errors = [];
        let intérêt = [];
        
        (typeof musique != 'undefined') ? intérêt.push(musique):'';
        (typeof jeux != 'undefined') ? intérêt.push(jeux):'';
        (typeof cinema != 'undefined') ? intérêt.push(cinema):'';
        (typeof lecture != 'undefined') ? intérêt.push(lecture):'';
        (typeof scout != 'undefined') ? intérêt.push(scout):'';
        (typeof art != 'undefined') ? intérêt.push(art):'';
        (typeof sport != 'undefined') ? intérêt.push(sport):'';
        (typeof techno != 'undefined') ? intérêt.push(techno):'';

        if(!name || !email || !password || !password2 || !sexe || sexe === '' || !postalCode || !birthday) {
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
                user : req.user,
                errors : errors,
                name : name,
                email : email,
                password : password,
                password2 : password2,
                sexe : sexe,
                birthday : birthday,
                postalCode : postalCode,
                intérêt : intérêt
            })
        } else { //validation passed
            User.findOne({email : email}).exec((err,user)=>{
  
                if(user) {
                    errors.push({msg: 'Un compte existe déjà avec cet email.'});
                    res.render('register', {
                        user : req.user,
                        errors : errors,
                        name : name,
                        email : email,
                        password : password,
                        password2 : password2,
                        sexe : sexe,
                        birthday : birthday,
                        postalCode : postalCode,
                        intérêt : intérêt
                    })
                } else {
                    User.findOne({name : name}).exec((err,user)=>{
  
                        if(user) {
                            errors.push({msg: 'Ce pseudo est déjâ pris.'});
                            res.render('register', {
                                user : req.user,
                                errors : errors,
                                name : name,
                                email : email,
                                password : password,
                                password2 : password2,
                                sexe : sexe,
                                birthday : birthday,
                                postalCode : postalCode,
                                intérêt : intérêt
                            })
                        } else {
                            const newUser = new User({
                                name : name,
                                email : email,
                                password : password,
                                sexe : sexe,
                                birthday : birthday,
                                postalCode : postalCode,
                                intérêt : intérêt
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
                    errors : errors
                })
            }
        });
    });


    //////////////////// RESET PASSWORD ////////////////////

    // request password reset
    app.post('/password',(req,res)=>{
        const {usernameEmail} = req.body;
        let errors = [];
        let success_msg = [];

        if(!usernameEmail) {
            errors.push({msg : "Entre ton pseudo ou ton email."})
        }    

        if(errors.length > 0 ) {
            res.render('password', {
                user : req.user,
                errors : errors,
                usernameEmail : usernameEmail
            })
        } else { //validation passed
            User.findOne({email : usernameEmail}).exec((err,result)=>{
                if(!result) {
                    User.findOne({name : usernameEmail}).exec((err,result)=>{
                        if(!result) {
                            errors.push({msg: 'Aucun compte ne correspond à cet email ou ce pseudo'});
                            res.render('password', {
                                user : req.user,
                                errors : errors,
                                usernameEmail : usernameEmail
                            })
                        } else { // send mail
                            let user = result;
        
                            crypto.randomBytes(20, (err, buf) =>{
                                let token = buf.toString('hex');
        
                                let expire = Date.now() + 1800000; // 30 minutes
        
                                ////// NODEMAILER //////
                                const transporter = nodemailer.createTransport({ // from mail, not working in localhost
                                    service: 'gmail',
                                    auth:{
                                        user: process.env.MAIL,
                                        pass: process.env.PASS
                                    }
                                });
        
                                let mailOptions = {
                                    from: process.env.MAIL,
                                    to: user.email,
                                    subject: 'Réinitialisation de ton mot de passe',
                                    text: 'Salut '+user.name+','+'\n\n'+
                                    'Tu reçois ce message car une demande de réinitialisation de ton mot de passe a été envoyé. Clique sur le lien ci-dessous pour changer ton mot de passe:'+'\n'+
                                    'http://'+req.headers.host+'/resetPassword/'+token+'\n\n'+
                                    "Si tu n'es pas à l'origine de cette demande, ignore cet email. Ce lien ne sera actif que pour les 30 prochaines minutes."+'\n\n'+
                                    'À bientôt sur Fernelmove!'
                                }
        
                                transporter.sendMail(mailOptions, (err, info)=>{
                                    if (err){
                                        return console.log(err);
                                    }
                                });
                                ////////////
        
                                const id = user._id;
                                User.findByIdAndUpdate(id, { resetPasswordToken: token, resetPasswordExpires: expire}, err => { // add token to the user
                                    if (err) return res.send(500, err);
        
                                    success_msg.push('Un e-mail a été envoyé sur ton email avec un lien de confirmation.')
                                    res.render('login', {
                                        user : req.user,
                                        success_msg: success_msg,
                                        usernameEmail : usernameEmail,
                                        sent : true
                                    });
                                });
                            });
                        }
                    })
                }else{
                    let user = result;
                    let email = user.email
        
                    crypto.randomBytes(20, (err, buf) =>{
                        let token = buf.toString('hex');

                        let expire = Date.now() + 1800000; // 30 minutes

                        ////// NODEMAILER //////
                        const transporter = nodemailer.createTransport({ // from mail, not working in localhost
                            service: 'gmail',
                            auth:{
                                user: process.env.MAIL,
                                pass: process.env.PASS
                            }
                        });

                        let mailOptions = {
                            from: process.env.MAIL,
                            to: email,
                            subject: 'Réinitialisation de ton mot de passe',
                            text: 'Salut '+user.name+','+'\n\n'+
                            'Tu reçois ce message car une demande de réinitialisation de ton mot de passe a été envoyé. Clique sur le lien ci-dessous pour changer ton mot de passe:'+'\n'+
                            'http://'+req.headers.host+'/resetPassword/'+token+'\n\n'+
                            "Si tu n'es pas à l'origine de cette demande, ignore cet email. Ce lien ne sera actif que pour les 30 prochaines minutes."+'\n\n'+
                            'À bientôt sur Fernelmove!'
                        }

                        transporter.sendMail(mailOptions, (err, info)=>{
                            if (err){
                                return console.log(err);
                            }
                        });
                        ////////////

                        const id = user._id;
                        User.findByIdAndUpdate(id, { resetPasswordToken: token, resetPasswordExpires: expire}, err => { // add token to the user
                            if (err) return res.send(500, err);

                            success_msg.push('Un e-mail a été envoyé sur ton email avec un lien de confirmation.')
                            res.render('login', {
                                user : req.user,
                                success_msg: success_msg,
                                usernameEmail : usernameEmail,
                                sent : true
                            });
                        });
                    });
                }
            })
        } 
    });

    // Change Password
    app.post('/resetPassword/:token',(req,res)=>{
        const {password, password2} = req.body;
        let errors = [];
        const token = req.params.token;

        if(!password || !password2) {
            req.flash('error','Il faut remplir tous les champs.')
            return res.redirect(`/resetPassword/${token}`)
        }

        //check if match
        if(password !== password2) {
            req.flash('error',"les mots de passe ne correspondent pas.")
            return res.redirect(`/resetPassword/${token}`)
        }

        //check if password is more than 6 characters
        if(password.length < 6 ) {
            req.flash('error','le mot de passe doit faire minimum 6 caractères.')
            return res.redirect(`/resetPassword/${token}`)
        }

        //validation passed
        bcrypt.genSalt(10,(err,salt) => bcrypt.hash(password,salt,(err,hash)=> {
            if(err) throw err;
            
            let hashedPassword = hash; //save pass to hash

            User.findOne({resetPasswordToken : token}).exec((err,result)=>{
                const id = result._id;

                User.findByIdAndUpdate(id, { resetPasswordToken: '', password: hashedPassword }, err => { // change the user's password
                    if (err) return res.send(500, err);
                    req.flash('success_msg','Ton mot de passe a été réinisialisé.')
                    res.redirect('/users/login');
                });
            });
        }));
    });

    //Delete Account
    app.post('/delete-account',(req,res)=>{
        const {password} = req.body;
        let errors = [];
        
        bcrypt.compare(password, req.user.password, function(err, result) {
            // console.log(result);
            if(result === false){
                errors.push({msg : "Your account has NOT been deleted because you entered a wrong password."})
            
            } else { // delete Account
                const id = req.user._id;
                User.findByIdAndDelete(id, err => { // update the user's email
                    if (err) return res.send(500, err);
                    req.logout();
                    req.flash('success_msg','Your Account has been deleted');
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