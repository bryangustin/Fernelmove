const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/user");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'usernameEmail'},(usernameEmail,password,done)=> {
            //match user
            User.findOne({email : usernameEmail})
            .then((user)=>{
                if(!user) {
                    User.findOne({name : usernameEmail})
                    .then((user)=>{
                        if(!user) {
                            return done(null,false,{message : 'Aucun compte ne correspond à cet email ou ce pseudo'});
                        }
                        //match pass
                        bcrypt.compare(password,user.password,(err,isMatch)=>{
                            if(err) throw err;
        
                            if(isMatch) {
                                return done(null,user);
                            } else {
                                return done(null,false,{message : 'Mot de passe incorrect'});
                            }
                        })
                    })
                    .catch((err)=> {console.log(err)})
                }
                //match pass
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;

                    if(isMatch) {
                        return done(null,user);
                    } else {
                        return done(null,false,{message : 'Mot de passe incorrect'});
                    }
                })
            })
            .catch((err)=> {console.log(err)})
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    }); 
}; 