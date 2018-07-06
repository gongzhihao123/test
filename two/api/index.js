var express = require('express');
var router = express.Router();


var movies = require('./movies.js')
var casts = require('./casts.js')
var directors = require('./directors.js')
var user = require('./user.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index' );
});
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
router.get('/getCastDetailRoute',casts.getCastDetailRoute)


router.get('/user',user.defaultRoute);
router.get('/sendCode',user.sendCode);
router.post('/register',user.register);
router.post('/login',user.login);


router.get('/directors',directors.defaultRoute);
module.exports = router;
