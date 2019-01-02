var { MongoClient } = require('mongodb');
var async = require('async')
var url = require('url');

var mongoUrl = 'mongodb://localhost:27017/Drugs';

module.exports = {
    defaultRoute: (req,res,next)=>{
    if( req.cookies.loginState != 1 ){
        res.render ('login')
        return;
    }
   async.waterfall( [
       ( cb ) => {
           MongoClient.connect(mongoUrl, ( err, db ) =>{
               if ( err ) throw err;
               cb( null, db)
           })
       },
       ( db, cb ) => {
           db.collection('test').find( {}, {_id:0}).toArray( ( err, res )=>{
               if ( err ) throw err;
               cb( null, res);
               db.close()
           })
       } 
   ], ( err, result)=>{
        if( err ) throw err;
        res.render( 'drugs',{
            result: result
        })
   })
},
 drugsadd: (req, res, next) => {
    if( req.cookies.loginState != 1){
        res.render('login');
        return;
    }
     res.render('drugs_add')
 },
 addDrugsAction: (req, res, next) => {
    if( req.cookies.loginState != 1){
        res.render('login');
        return;
    }
    var {id, name, spec, num, date} = req.body
    var inserObj = {
        id, name, spec, num, date
    }
    async.waterfall([
        (cb) => {
            MongoClient.connect( mongoUrl, ( err, db)=> {
                if ( err ) throw err
                cb(null, db)
            })
        },
        (db, cb) => {
            db.collection('test').insert(inserObj, (err, res) => {
                if (err) throw err
                cb (null, 'ok')
                db.close
            })
        }
    ],(err, result) => {
        if ( err ) throw err
           if( result == 'ok' ){
               res.redirect('/drugs')
           }
    })
 },
detailDrugsAction: (req, res, next) => {
    if( req.cookies.loginState != 1){
        res.render('login');
        return;
    }
    var {id} = url.parse(req.url, true).query
    async.waterfall([
        (cb) => {
            MongoClient.connect( mongoUrl, ( err, db)=> {
                if ( err ) throw err
                cb(null, db)
            })
        },
        (db, cb) => {
            db.collection('test').deleteOne({id: id}, (err, res) => {
                if (err) throw err
                cb (null, 'ok')
                db.close
            })
        }
    ],(err, result) => {
        if ( err ) throw err
           if( result == 'ok' ){
               res.redirect('/drugs')
           }
    })
 },
updataDrugsAction:(req, res, next)=>{
    if( req.cookies.loginState != 1){
        res.render('login');
        return;
    }
    var { id} = url.parse( req.url, true ).query;
    async.waterfall( [
        ( cb )=>{
            MongoClient.connect( mongoUrl, ( err, db )=>{
                if ( err ) throw err;
                cb( null, db )
            })
        },
        ( db, cb ) => {
            db.collection('test').find( {id:id}, {}).toArray( ( err, res )=>{
                if( err ) throw err;
                cb( null, res );
                db.close();
            })
        }
    ], ( err, result)=>{
        if( err ) throw err;
        console.log('33', result)
        res.render('drugs_updata',{
            result: result
        })
    })
   },
updataDrugsActions: (req, res, next) => {
    if( req.cookies.loginState != 1){
        res.render('login');
        return;
    }
    var { id, name, spec, num, date} = req.body
    var whereObj = {id: id}
    var updataObj = { $set : { id, name, spec, num, date} } 
    async.waterfall([
        (cb)=>{
            MongoClient.connect(mongoUrl, (err, db)=>{
                if (err) throw err
                cb(null, db)
            })
        },
        (db, cb) => {
            db.collection('test').updateOne(whereObj, updataObj, (err, res)=>{
                if (err) throw err
                cb(null, 'ok')
                db.close
            })
        }
    ],(err, result)=>{
        if ( err ) throw err
        if(result == 'ok'){
            res.redirect('/drugs')
        }
    })
}

}