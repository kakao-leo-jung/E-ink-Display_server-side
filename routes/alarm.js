var express = require('express');
var router = express.Router();
var authentication = require('../auth/authentication');
var Alarm = require('../model/alarm');
var errorSet = require('../utill/errorSet');

/* TODO: Author : 정근화 */

/* get /alarm */
router.get('/', async (req, res, next) => {

    try {

        var decoded = authentication.verifyJwt(req);

        var document = await Alarm.find({
            userId: decoded.userId
        }).catch(err => {
            throw (errorSet.createError(errorSet.es.ERR_CRUDDB));
        });

        console.log(document);

        next(document);

    } catch (err) {
        next(err);
    }

});

/* post /alarm */
router.post('/', async (req, res, next) => {

    try {
        var decoded = authentication.verifyJwt(req);

        var newAlarm = new Alarm({
            userId: decoded.userId,
            title: req.body.title,
            time: req.body.time,
            days: req.body.days,
            day_selected: req.body.day_selected
        });

        var savedAlarm = await newAlarm.save()
            .catch(err => {
                throw (errorSet.createError(errorSet.es.ERR_CRUDDB));
            });

        var resObj = {
            _id : savedAlarm._id,
            title : savedAlarm.title,
            time : savedAlarm.time,
            days : savedAlarm.days,
            day_selected : savedAlarm.day_selected
        };

        next(resObj);

    } catch (err) {
        next(err);
    }

});

module.exports = router;