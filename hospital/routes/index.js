var express = require('express');
var router = express.Router();

var drugs = require("./drugs.js")
var admin = require("./admin.js")
var quit = require("./quit.js")

/* GET home page. */
router.get('/', function(req, res, next) {
  var type = req.cookies.loginState == 1 ? 'index' : 'login';
  res.render( type )
})
//管理员路由
router.get('/admin', admin.defaultRoute);
router.post('/adminLoginAction', admin.adminLoginAction);

router.get('/quit', quit.defaultRoute);
router.get('/adminQuit', quit.adminQuit);
// 药品管理
router.get('/drugs', drugs.defaultRoute)
router.get('/drugsadd', drugs.drugsadd)
router.post('/addDrugsAction', drugs.addDrugsAction)
router.get('/updataDrugsAction', drugs.updataDrugsAction)
router.post('/updataDrugsActions', drugs.updataDrugsActions)
router.get('/detailDrugsAction', drugs.detailDrugsAction)


module.exports = router
