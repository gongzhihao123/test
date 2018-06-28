
var { MongoClient } = require('mongodb');
var async = require('async')
var url = require('url');

var mongoUrl = 'mongodb://localhost:27017/two';

module.exports = {
    defaultRoute: (req,res,next)=>{
       async.waterfall( [
           ( cb ) => {
               MongoClient.connect(mongoUrl, ( err, db ) =>{
                   if ( err ) throw err;
                   cb( null, db)
               })
           },
           ( db, cb )=>{
                db.collection('dianying').distinct('year',(err, yearArr)=>{
                        if( err ) throw err
                        yearArr.sort( ( a, b )=>{
                          return  a-b
                        })
                        cb( null, yearArr, db)
                })
           },
           (yearArr, db, cb ) => {
               db.collection('dianying').find( {}, {_id:0}).toArray( ( err, res )=>{
                   if ( err ) throw err;
                   cb( null, {
                       res,
                       yearArr
                   });
                   db.close()
               })
           } 
       ], ( err, result)=>{
            if( err ) throw err;
            // res.render({
            //     result : result.res,
            //     yearArr : result.yearArr
            // })
            res.send( result.res )
       })
    },
    sortMoviesRoute : (req, res, next)=>{
        var { type, num } = url.parse( req.url, true).query;
        var sortObj = {};
          num = num * 1
        try {
            sortObj[type] = num
        } catch (error) {
            
        }

        async.waterfall( [
            ( cb ) => {
                MongoClient.connect(mongoUrl, ( err, db ) =>{
                    if ( err ) throw err;
                    cb( null, db)
                })
            },
            ( db, cb )=>{
                db.collection('dianying').distinct('year',(err, yearArr)=>{
                        if( err ) throw err
                        yearArr.sort( ( a, b )=>{
                          return  a-b
                        })
                        cb( null, yearArr, db)
                })
           },
           (yearArr, db, cb ) => {
                db.collection('dianying').find( {}, {_id:0}).sort( sortObj ).toArray( ( err, res )=>{
                    if ( err ) throw err;
                    cb( null, {
                        res,
                        result
                    });
                    db.close();
                })
            } 
        ], ( err, result)=>{
             if( err ) throw err;
             res.render( 'movies',{
                 result: result.res,
                 yearArr : result.yearArr
             })
        })
    },
    areaQueryMoviesRoute : ( req, res, next )=>{
        var { type, min, max } = url.parse( req.url, true ).query
        var whereObj = {};
         min = min * 1
         max = max * 1
            try {
                whereObj[type] = {
                    $gte :min,
                    $lte : max
                }
            } catch (error) {
                
            }

        async.waterfall( [
            ( cb ) => {
                MongoClient.connect(mongoUrl, ( err, db ) =>{
                    if ( err ) throw err;
                    cb( null, db)
                })
            },
             ( db, cb )=>{
                 db.collection('dianying').distinct('year',(err, yearArr)=>{
                         if( err ) throw err
                         yearArr.sort( ( a, b )=>{
                           return  a-b
                         })
                         cb( null, yearArr, db)
                 })
            },
            (yearArr, db, cb ) => {
                db.collection('dianying').find( whereObj, {_id:0}).toArray( ( err, res )=>{
                    if ( err ) throw err;
                    cb( null, {
                        res,
                        yearArr
                    });
                    db.close();
                })
            } 
        ], ( err, result)=>{
             if( err ) throw err;
             res.render( 'movies',{
                 result: result.res,
                 yearArr : result.yearArr
             })
        })
    },
    searchMoviesRoute : ( req, res, next ) =>{
        var { type , val } = url.parse ( req.url , true ).query
        var whereObj = {};

        try {
            whereObj[type] = eval("/"+val+"/")
        } catch (error) {
            
        }

        async.waterfall( [
            ( cb ) => {
                MongoClient.connect(mongoUrl, ( err, db ) =>{
                    if ( err ) throw err;
                    cb( null, db)
                })
            },
            ( db, cb )=>{
                db.collection('dianying').distinct('year',(err, yearArr)=>{
                        if( err ) throw err
                        yearArr.sort( ( a, b )=>{
                          return  a-b
                        })
                        cb( null, yearArr, db)
                })
           },
           (yearArr, db, cb ) => {
                db.collection('dianying').find( whereObj, {_id:0}).toArray( ( err, res )=>{
                    if ( err ) throw err;
                    cb( null, {
                        res,
                        yearArr
                    });
                    db.close()
                })
            } 
        ], ( err, result)=>{
             if( err ) throw err;
             res.render( 'movies',{
                 result: result.res,
                 yearArr : result.yearArr
             })
        })
    },
    getYearMovies : ( req, res, next)=>{
        console.log(req.url )
      var {year} = url.parse(req.url, true).query
        console.log( year )
           year = year * 1
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect(mongoUrl, ( err, db ) =>{
                    if ( err ) throw err;
                    cb( null, db) 
                })
            },
            ( db, cb )=>{
                 db.collection('dianying').distinct('year',(err, yearArr)=>{
                         if( err ) throw err
                         yearArr.sort( ( a, b )=>{
                           return  a-b
                         })
                         cb( null, yearArr, db)
                 })
            },
            (yearArr, db, cb ) => {
                db.collection('dianying').find( {year:year}, {_id:0}).toArray( ( err, res )=>{
                    if ( err ) throw err;
                    cb( null, {
                        res,
                        yearArr
                    });
                    db.close()
                })
            } 
        ], ( err, result)=>{
             if( err ) throw err;
             res.render( 'movies',{
                 result: result.res,
                 yearArr : result.yearArr
             })
        })
    }
}