var fs = require('fs');

var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');

var mongoUrl = 'mongodb://localhost:27017/two';

var checklogin = require('./checklogin.js')


module.exports = {
    defaultRoute: (req,res,next)=>{
        checklogin.check(req,res)
        var { bannerid, bannerurl } = req.body;
        
        
        async.waterfall( [
            (cb) => {
                MongoClient.connect(mongoUrl,(err,db)=>{
                    if( err ) throw err;
                    cb( null, db)
                })
            },
            (db,cb)=>{
                db.collection('banner').find( {},{}).toArray( (err,result )=>{
                        if( err ) throw err;
                        cb( null, result ); 
                        db.close()
                } );
            }
      ],( err, result )=>{
            if ( err ) throw err;
            res.render('banner',{
                result
            })
      })  
        // res.render('banner')
    },
    addBannerRouter:( req, res, next )=>{
        checklogin.check(req,res)//检测是否登录
         res.render('banner_add')
    },
    addBannerAction ( req, res, next ){
        checklogin.check(req,res)//检测是否登录
      
        var { bannerid, bannerurl } = req.body;
        
        var oldName = './uploads/' + req.file.filename;
        var finishFlagArr = req.file.originalname.split('.')
        var finishFlag = finishFlagArr[finishFlagArr.length - 1 ];
        var newName = './uploads/'+req.file.filename + "." +finishFlag;
        var imgurl = req.file.filename + "." + finishFlag; 
        
        
        async.waterfall([
            ( cb )=>{
                fs.rename( oldName, newName, ( err, data ) =>{
                    if( err ) throw err
                 var imgurl = req.file.filename + "." + finishFlag; 
                    cb( null, imgurl);
                })
            },
            (imgurl, cb )=>{
                MongoClient.connect( mongoUrl, ( err, db )=>{
                    if( err ) throw err
                    cb( null, imgurl, db )
                })
            },
            ( imgurl, db, cb )=>{
                    db.collection('banner').insert({bannerid,bannerurl,imgurl},( err, res )=>{
                        if( err ) throw err
                        cb(null, 'ok')
                        db.close()
                    })
            }
        ],(err, result)=>{
            if( err ) throw err
            if( result == 'ok'){
                if ( err ) throw err
                res.redirect('/banner')
            }
        })
      
      
    }
}