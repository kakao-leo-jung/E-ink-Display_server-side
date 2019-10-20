var express = require('express');
var Medicine = require('../model/medicine');
var authentication = require('../auth/authentication');
var errorSet = require('../utill/errorSet');
var router = express.Router();

/**

    @api {get} /medicine GetMedicine
    @apiName GetMedicine
    @apiGroup medicine
    @apiDescription
    유저의 투약 정보를 배열로 받아옵니다.

    @apiHeader {String} jwt 헤더에 JWT 토큰을 넣습니다.
    @apiHeaderExample {form} 헤더 예제
    {
        // retrofit2 : HashMap 에 key값은 "jwt", value값은 "eyJ..." 로 설정
        "jwt" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxODRjMWU5ZDMxZjRmYmYzNDQ3NDQiLCJ1c2VySWQiOiIxMDA4MjgzNDcwMzc2MDQ2NjA3MDAiLCJpYXQiOjE1NzEwNDAxNTcsImV4cCI6MTU3MTEyNjU1NywiaXNzIjoiY29tLmpjcC5tYWdpY2FwcGxpY2F0aW9uIiwic3ViIjoidXNlckF1dGgifQ.RcjjVWBSd5LOXPqqPIV-ZXVsBKOxob7vWm7tBJi4rjM"
    }

    @apiParam {null} No Parameter 요청 파라미터 없음.
    @apiParamExample {null} 파라미터(x) 예제
    No Parameter/

    @apiSuccess {String}    _id               해당 알람의 고유 id값, put, delete 호출 때 사용.
    @apiSuccess {String}    yakname           투약 정보
    @apiSuccess {Number}    hour              알람 시, 범위는 0~23.
    @apiSuccess {Number}    minute            알람 분, 범위는 0~59.
    @apiSuccess {String}    ampm              오전/오후 여부를 "AM", "PM" 으로 나타냅니다.</br>
                                              ampm 은 hour, minute 에 의해 자동으로 세팅됩니다.</br>
    @apiSuccess {boolean[]} selected         알람이 on 상태인지 여부를 나타냅니다.




*/

route.get('/', async (req,res,next)=>{

  try{

    var decoded = authentication.verifyJwt(req);

    var medicineList = await Medicine.find({
      userId: decoded.userId
    }).catch(err => {
        throw (errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
    })

    var resObj = new Array();
    for (medicine of medicineList){
      var obj = {
        _id : medicine._id,
        yakname: medicine.yakname,
        hour : medicine.hour,
        minute : medicine.minute,
        ampm : medicine.ampm,
        selected : medicine,selected
      }
      resObj.push(obj);
    }

  } catch(err){
    next(err);
  }

});



router.post('/', async (req, res, next) => {

    try {


        var decoded = authentication.verifyJwt(req);



        var newMedicine = new Todo({
            userId: decoded.userId,
            yakname : req.body.yakname,
            hour : req.body.hour,
            minute : req.body.minute,
            ampm : (req.body.hour > 12)? "PM" : "AM",
            selected : req.body.selected
        });

        if(newMedicine.hour > 23 || newMedicine.hour < 0 || newMedicine.minute > 59 || newMedicine.minute < 0){
            throw(errorSet.createError(errorSet.es.INVALID_TIME, new Error().stack));
        }

        var savedMedicine = await newMedicine.save()
            .catch(err => {
                throw (errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
            });

        var resObj = {
            _id: savedMedicine._id,
            yakname: savedMedicine.yakname,
            hour : savedMedicine.hour,
            minute : savedMedicine.minute,
            ampm : savedMedicine.ampm,
            selected : savedMedicine.selected
        }

        next(resObj);

    } catch (err) {

        next(err);
    }

});

router.put('/:_id', async (req, res, next) => {

  try{
      var decoded = authentication.verifyJwt(req);

      var changedMedicine = {
        yakname : req.body.yakname,
        hour : req.body.hour,
        minute : req.body.minute,
        ampm : (req.body.hour>12)?"PM":"AM",
        selected : req.body.selected
      }

      if(changedMedicine.hour > 23 || changedMedicine.hour < 0 || changedMedicine.minute > 59 || changedMedicine.minute < 0){
          throw(errorSet.createError(errorSet.es.INVALID_TIME, new Error().stack));
      }

      var document = await Medicine.findOneAndUpdate({
        _id : req.params._id,
        userId : decoded.userId
      }, changedMedicine).catch(err =>{
        throw (errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
      });

      var resObj = {
        _id : document._id,
        yakname : changedMedicine.yakname,
        hour : changedMedicine.hour,
        minute : changedMedine.minute,
        ampm : changedMedine.ampm,
        selected : changedMedine.selected
      };

      next(resObj);

  } catch (err){
      next(err);
  }

});

router.delete('/:_id', async (req, res, next) => {

  try{
    var decoded = authentication.verifyJwt(req);

    var document = await Alarm.findOneAndDelete({
      _id : req.params._id,
      userId : decoded.userId
    }).catch(err => {
        throw(errorSet.createError(errorSet.es.ERR_CRUDDB, err.stack));
    });

    var resObj = {
      message: "medicine info delete success!",
      status: 200
    }

    next(resObj);

  }catch(err){
      next(err);
  }
})



module.exports = router;
