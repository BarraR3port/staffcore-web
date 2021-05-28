const {config} = require('../keys')
module.exports = {
    isLoggedIn(req,res,next) {
        if ( req.isAuthenticated()){
            return next();
        }
        req.flash('error', `You must be logged in`);
        return res.redirect('/login');
    },
    isConfigured(req,res,next) {
        if (config.configured){
            return next();
        }
        return res.redirect('/config');
    }

}