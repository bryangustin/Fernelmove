module.exports = {
    ensureAuthenticated : function(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
        req.flash('error_msg' , 'tu dois être connecté pour accéder à cette page.');
        res.redirect('/users/login');
    }
}