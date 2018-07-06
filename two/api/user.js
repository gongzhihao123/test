
const SMSClient = require('@alicloud/sms-sdk')
const url = require('url')
var { MongoClient } = require('mongodb');
var async = require('async')

var mongoUrl = 'mongodb://localhost:27017/two';

function randomNum() {
    var num = '';
    for (var i = 0; i < 4; i++) {
        num += Math.floor(Math.random() * 10)
    }
    return num;
}
module.exports = {
    defaultRoute: (req, res, next) => {
        res.send('user')
    },
    sendCode(req, res, next) {
        const { tel } = url.parse(req.url, true).query
        const accessKeyId = 'LTAIZQoVVoPuBjU9'
        const secretAccessKey = 'GfJuI2dLsCQh7Q56TmFxPTniXjkVnB'
        let smsClient = new SMSClient({ accessKeyId, secretAccessKey })
        let code = randomNum();
        async.waterfall([
            (cb) => {
                MongoClient.connect(mongoUrl, (err, db) => {
                    if (err) throw err
                    cb(null, db)
                })
            },
            (db, cb) => {
                db.collection('user').find({ tel }, { _id: 0 }).toArray((err, data) => {
                    if (err) throw err
                    cb(null, data)
                    db.close()
                })
            }
        ], (err, result) => {
            if (err) throw err
            // console.log(result)
            if (result.length > 0) {
                res.send('1')
            } else if (result.length == 0) {
                res.send('0')
                smsClient.sendSMS({
                    PhoneNumbers: tel,
                    SignName: '吴勋勋',//按照严格意义来说，此处的签名和模板的ID都是可变的
                    TemplateCode: 'SMS_111785721',
                    TemplateParam: '{"code":' + code + '}'
                }).then(function (result) {
                    // console.log(result)
                    let { Code } = result
                    if (Code === 'OK') {
                        //处理返回参数
                        // console.log(result)
                        res.send({
                            code,
                            state: 1
                        })
                    }
                }, function (err) {
                    console.log(err)
                    res.send({
                        state: 0
                    })
                })
            }
        })
    },
    register(req, res, next) {
        const { tel, password } = req.body
        // console.log(req.body)
        async.waterfall([
            (cb) => {
                MongoClient.connect(mongoUrl, (err, db) => {
                    if (err) throw err
                    cb(null, db)
                })
            },
            (db, cb) => {
                db.collection('user').insert({ tel, password }, (err, res) => {
                    if (err) throw err
                    cb(null, 'ok')
                    db.close()
                })
            }
        ], (err, result) => {
            if (err) throw err
            if (result == 'ok') {
                res.send('1')
            } else {
                res.send('0')
            }
        })
    },
    login(req, res, next) {
        const { tel, password } = req.body
        console.log(req.body)
        async.waterfall([
            (cb) => {
                MongoClient.connect(mongoUrl, (err, db) => {
                    if (err) throw err
                    cb(null, db)
                })
            },
            (db, cb) => {
                db.collection('user').find({ tel}).toArray((err, res) => {
                    // console.log(res)
                    if (err) throw err
                    if (res.length == 0) {
                        cb(null, 2)
                        db.close()
                    } else {
                        db.collection('user').find({ tel,password}).toArray((err, res) => {
                            // console.log(res)
                            if (err) throw err
                            if (res.length == 0) {
                                cb(null, 0)
                                db.close()
                            } else {
                                cb(null, 1)
                                db.close()
                            }
                        })
                    }
                })
            }
        ], (err, result) => {
            if (err) throw err
            console.log(result);
            
            if (result == '0') {
                res.send('0')
            } else if (result == 1) {
                res.send('1')
            } else if (result == 2) {
                res.send('2')
            }
        })
    }
}
