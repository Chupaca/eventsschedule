const promise = require("bluebird");
const baselogic = require("../logic/baselogic.js");

exports.GetDisplayEventsList = (req, res) => {
    if (req.user) {
        baselogic.GetLastEventList()
            .then((eventslist) => {
                res.render('displayevents', { title: " יומן אירועים ", Category: eventslist[0], LastEvents: eventslist[1] });
            })
    } else {
        res.sendStatus(403);
    }
}
exports.CreateNewCategory = (req, res) => {
    var category = req.body.Category;
    baselogic.CreateNewCategory(category, req.user)
        .then((result) => {
            if (result) {
                res.send(true);
            } else {
                res.sendStatus(500);
            }
        })
}