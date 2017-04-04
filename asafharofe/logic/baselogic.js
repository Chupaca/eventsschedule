
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
    return new promise(function (resolve, reject) {
            eventswriter.insert(newevent, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.ops[0]._id)
                }
            })
        })
};

function editEvent(newevent,eventid, user){
    var Notes = {};
    Notes.Date = moment().format();
    Notes.EditorName = user.UserName;
    Notes.EditorId = user._id;
    eventid = mongoHelper.toObjectID(eventid);
    return new promise(function (resolve, reject) {
            eventswriter.updateById(eventid, {$set:newevent, $push:{"Notes":Notes}}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.nModified)
                }
            })
        })
};

function getNotesById(eventid){
    eventid = mongoHelper.toObjectID(eventid);
    return new promise(function (resolve, reject) {
            eventsreader.find({_id:eventid}, {_id:0, Notes:1}).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result)
                }
            })
        })
};

function removeEvent(eventid) {
    eventid = mongoHelper.toObjectID(eventid);
    return new promise(function (resolve, reject) {
            eventswriter.remove({_id:eventid}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.result.ok)
                }
            })
        })
};

function buildbeforeSearchEvents(search) {
    var conditions = {};
    if (search.fromDate && search.toDate) {
        let SearchFrom = moment(search.fromDate, "DD/MM/YYYY").format();
        let SearchTo = moment(search.toDate, "DD/MM/YYYY").format();
        conditions["Date"] = { $gte: SearchFrom, $lte: SearchTo };
    }
    else if (SearchFrom) {
        let SearchFrom = moment(search.fromDate, "DD/MM/YYYY").format();
         conditions["Date"] = { $gte: SearchFrom };
    }
    else if (SearchTo) {
        let SearchTo = moment(search.toDate, "DD/MM/YYYY").format();
         conditions["Date"] = { $lte: SearchTo };
    }

    if (search.freeText && search.freeText.length > 0) {
        conditions["Title"] = { $regex: ".*" + search.freeText + ".*" };
    }
    if(search.Category != "0"){
        conditions["CategoryId"] = search.Category;
    }
     return promise.join(getAllCategory(), searchEvents(conditions),
        (category, listevents) => {
            return [category, listevents];
        })    
};

function searchEvents(conditions){
    return new promise(function (resolve, reject) {
            eventsreader.find(conditions).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result)
                }
            })
        })
}


exports.GetLastEventList = getLastEventList;
exports.CreateNewCategory = createNewCategory;
exports.CreateNewEvent = createNewEvent;
exports.EditEvent = editEvent;
exports.GetNotesById = getNotesById;
exports.RemoveEvent = removeEvent;
exports.BuildbeforeSearchEvents = buildbeforeSearchEvents;