module.exports={
    ensureAuthenticated:(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        else{
            req.flash('error_msg','u are not logged in');
            res.redirect('/users/login');
        }
    }
}