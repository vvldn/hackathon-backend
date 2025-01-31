var mongoose = require("mongoose");
var properties = require("./properties");

var connectDB = function (callback, fallback) {
    mongoose.connect(properties.db_properties.prod.url);
    var db = mongoose.connection;
    db.on('error',function (error) {
        fallback(error);
    });
    db.once('open',function (obj) {
        console.log("mongoose client: connect success");
        callback(obj);
    });
}

exports.connectDB = connectDB;