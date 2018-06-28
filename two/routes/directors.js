


module.exports = {
    defaultRoute: (req,res,next)=>{
        if( req.cookies.loginState != 1){
            res.render('login');
            return;
        }
        res.render('directors')
    }
}