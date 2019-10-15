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

        var alarmList = await Alarm.find({
            userId: decoded.userId
        }).catch(err => {
            throw (errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
        });

        var resObj = new Array();
        for (alarm of alarmList) {
            var obj = {
                _id: alarm._id,
                title: alarm.title,
                time: alarm.time,
                days: alarm.days,
                day_selected: alarm.day_selected
            }
            resObj.push(obj);
        }

        next(resObj);

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
                throw (errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
            });

        var resObj = {
            _id: savedAlarm._id,
            title: savedAlarm.title,
            time: savedAlarm.time,
            days: savedAlarm.days,
            day_selected: savedAlarm.day_selected
        };

        next(resObj);

    } catch (err) {
        next(err);
    }

});

/* put /alarm/:_id */
router.put('/:_id', async (req, res, next) => {

    try {
        var decoded = authentication.verifyJwt(req);

        var _title = req.body.title;
        var _time = req.body.time;
        var _days = req.body.days;
        var _day_selected = req.body.day_selected;

        var changedAlarm = {
            title: _title,
            time: _time,
            days: _days,
            day_selected: _day_selected
        }

        /* 현재 로그인된 jwt 의 유저와 alarm 등록한 userId 가 일치해야 함. */
        var document = await Alarm.findOneAndUpdate({
            _id: req.params._id,
            userId: decoded.userId
        }, changedAlarm).catch(err => {
            throw (errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
        });

        var resObj = {
            _id: document._id,
            title: changedAlarm.title,
            time: changedAlarm.time,
            days: changedAlarm.days,
            day_selected: changedAlarm.day_selected
        };

        next(resObj);

    } catch (err) {
        next(err);
    }

});

/* delete /alarm/:_id */
router.delete('/:_id', async (req, res, next) => {

    try{
        var decoded = authentication.verifyJwt(req);

        var document = await Alarm.findOneAndDelete({
            _id: req.params._id,
            userId: decoded.userId
        }).catch(err => {
            throw(errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
        });

        var resObj = {
            message: "Alarm delete success!",
            status: 200
        }

        next(resObj);

    }catch(err){
        next(err);
    }

});

module.exports = router;