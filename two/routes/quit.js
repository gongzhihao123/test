var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');
var md5 = require('md5');

var mongoUrl = 'mongodb://localhost:27017/two';


module.exports = {
    defaultRoute: (req,res,next)=>{
        res.render('login')
    },
    adminQuit : (req, res, next )=>{
        // async.waterfall( [
        //     ( cb )=>{
        //         MongoClient.connect( mongoUrl, ( err, db ) => {
        //             if( err ) throw err ;
        //             cb( null, db )
        //         } )
        //     },
        //     ( db, cb )=>{
        //         db.collection('admin').find({},{}).toArray( (err, res)=>{
        //                 if( err ) throw err;
        //                 cb( null, res )
        //                 db.close()
        //         } )
        //     }
        // ], ( err, result )=>{
        //     if ( err ) throw err;
        //     result.length > 0 ? res.cookie("loginState", 0) :  res.cookie("loginState", 1)
        //     res.redirect('login')
        // })
         res.cookie("loginState", 0) 
         res.render('login')
    }  
}