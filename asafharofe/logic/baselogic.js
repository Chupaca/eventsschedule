
var connection = require("./connection.js");
var baseRead = connection.baseRead;
var baseWrite = connection.baseWrite;
var mongoHelper = require("mongoskin").helper;
var categorywriter = baseWrite.collection("category");
var categoryreader = baseRead.collection("category");
var eventswriter = baseWrite.collection("events");
var eventsreader = baseRead.collection("events");
var promise = require("bluebird");
var moment = require("moment");
var striptags = require('striptags');
//var linq = require("linq");

function getLastEventList() {
    return promise.join(getAllCategory(), getAllLastEvents(),
        (category, listevents) => {
            return [category, listevents];
        })
}

function getAllCategory() {
    return new promise(function (resolve, reject) {
        categoryreader.find({}).toArray((err, categories) => {
            if (err) {
                reject(err);
            } else {
                resolve(categories)
            }
        })
    })
}
function getAllLastEvents() {
    return new promise(function (resolve, reject) {
        eventsreader.find({}).toArray((err, events) => {
            if (err) {
                reject(err);
            } else {
                resolve(events)
            }
        })
    })
}

function createNewCategory(newcategory, user) {
    if (newcategory && newcategory.length > 0) {
        var newCategory = {};
        newCategory.Name = newcategory;
        newCategory.Date = moment().format();
        newCategory.CreaterName = user._id;
        return new promise(function (resolve, reject) {
            categorywriter.insert(newCategory, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.ops[0]._id)
                }
            })
        })
    }
}

function createNewEvent(newevent, user){
    newevent.Date = moment().format();
    newevent.CreaterName = user.UserName;
    newevent.CreaterId = user._id;
    //newevent.Text = striptags(newevent.Text, ' ', '\n');
    return new promise(function (resolve, reject) {
            eventswriter.insert(newevent, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.ops[0]._id)
                }
            })
        })
}





exports.GetLastEventList = getLastEventList;
exports.CreateNewCategory = createNewCategory;
exports.CreateNewEvent = createNewEvent;