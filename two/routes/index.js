var express = require('express');
var router = express.Router();

var multer = require('multer')
var upload = multer({
  dest : 'uploads/'
})


var movies = require('./movies.js')
var casts = require('./casts.js')
var directors = require('./directors.js')
var admin = require('./admin.js')
var quit = require('./quit.js')
var banner = require('./banner.js')
/* GET home page. */
router.get('/', function(req, res, next) { 
  var type = req.cookies.loginState == 1 ? 'index' : 'login';
    res.render( type )
});
//管理员路由
router.get('/admin', admin.defaultRoute);
router.post('/adminLoginAction', admin.adminLoginAction);
// router.get('/adm', admin.adminLoginAction);

router.get('/quit', quit.defaultRoute);
router.get('/adminQuit', quit.adminQuit);


//电影路由
router.get('/movies', movies.defaultRoute);
router.get('/sortMoviesRoute', movies.sortMoviesRoute);
router.get('/areaQueryMoviesRoute', movies.areaQueryMoviesRoute);
router.get('/searchMoviesRoute', movies.searchMoviesRoute);
router.get('/getYearMovies', movies.getYearMovies);

// 演员路由
router.get('/casts',casts.defaultRoute);
router.get('/castspaging',casts.castspaging)//分页路由
router.get('/deleteCastRoute',casts.deleteCastRoute)
router.get('/castsadd',casts.castsadd)
router.post('/addCastsAction',casts.addCastsAction)
router.get('/updataCastRoute',casts.updataCastRoute)
router.post('/updataCastsAction',casts.updataCastsAction)

//轮播图管理
router.get('/banner',banner.defaultRoute);
router.get('/addBannerRouter',banner.addBannerRouter);
router.post('/addBannerAction', upload.single('bannerimg'), banner.addBannerAction)

router.get('/directors',directors.defaultRoute);
module.exports = router;
