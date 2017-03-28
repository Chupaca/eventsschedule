var connectionStringWriter = require("../config.js").DB.ConnectionStringWriter;
var connectionStringReader = require("../config.js").DB.ConnectionStringReader;

exports.baseRead = require("mongoskin").db(connectionStringReader, {
    w : 0
});

exports.baseWrite = require("mongoskin").db(connectionStringWriter, {
    w : 1
});