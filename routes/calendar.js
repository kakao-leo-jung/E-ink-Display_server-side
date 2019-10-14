var express = require('express');
var calendar_call = require('../utill/calendar_call');
var authentication = require('../auth/authentication');
var errorSet = require('../utill/errorSet');
var router = express.Router();

/* TODO: Author : 정근화 */

/*

    본 모듈은 /calendar 로 들어온다.
    google calendar api 호출을 사용하여
    개인의 달략에 관한 요청값을 반환한다.

    참고 : https://developers.google.com/calendar/quickstart/nodejs

    * 호출 과정
    1. 먼저 요청의 헤더로 부터 jwt를 수신한다.
    2. jwt 를 verify 하고 jwt 로 부터 user_id 검출한다.
    3. user_id 로 DB 를 조회하여 access_token 을 조회한다.

*/

/*

    GET /calendar/next

    post 로 들어온 유저의 JWT 값을 인증하고
    userId 값으로 DB를 조회하여 googleToken을 조회한 후

    구글 Calendar api 를 호출한다.
    다음 primary calendar의 다음 10일 일정을 받아서
    반환한다.

    ** 10일 이 아닐 경우 body 에 nextCount : 12 이런식으로
    불러올 리스트의 개수를 parameter로 넣어서 호출한다.

*/
router.get('/next/:nextCount', async (req, res, next) => {

    try {

        /* 요청에서 jwt 를 추출한 다음 veryfy 및 decoding 한다. */
        var decoded = authentication.verifyJwt(req);

        /* 달력의 일정리스트 호출 개수의 디폴트값은 10이다. */
        var maxCount = req.params.nextCount;

        /*

            userId 값을 통해 db의 AuthCode 값을 조회한다.
            authCode 조회 성공 후 인증된 auth클라이언트를 이용해
            원하는 함수를 호출한다. (listEvents 실행)

        */
        var authInfo = await authentication.getAuthCode(decoded.userId);
        var authClient = authInfo.oAuth2Client;
        var resObj = await calendar_call.listEvents(authClient, 'primary', new Date(), null, maxCount);

        next(resObj);

    } catch (err) {
        next(err);
    }

});

/*

    GET /calendar/certainday

    요청 들어온 유저의 JWT 값을 인증하고
    userId 값으로 DB를 조회하여 googleToken을 조회한다.

     - yyyy (4자리 int)
     - m or mm (1 또는 2자리 int)
     - d or dd (1 또는 2자리 int)

    또한 요청 body 의 값을 통해 특정 년, 월, 일을 추출한다.

    구글 Calendar api 를 호출한다.
    해당 년, 월, 일의 제목과 내용을 호출하여 반환한다.

*/
router.get('/certainday/:year/:month/:day', async (req, res, next) => {

    try {

        var decoded = authentication.verifyJwt(req);

        var _year = req.params.year;
        var _month = req.params.month;
        var _day = req.params.day;

        /* 날짜 유효성 검사 */
        if (_month > 12 || _month < 1 || _day > 31 || _day < 1) {
            throw (errorSet.createError(errorSet.es.INVALID_DATE));
        }

        /* 시간 설정 */
        var _minDate = new Date(_year, _month - 1, _day, 0, 0, 0);
        var _maxDate = new Date(_year, _month - 1, _day, 24, 0, 0);

        var authInfo = await authentication.getAuthCode(decoded.userId);
        var authClient = authInfo.oAuth2Client;
        var resObj = await calendar_call.listEvents(authClient, 'primary', _minDate, _maxDate, null);

        next(resObj);

    } catch (err) {
        next(err);
    }

});

/*

    POST /calendar

    해당 년/월/일에 해당하는 날짜에 body 값으로 달력을 받아
    google calendar에 일정을 추가한다.

*/
router.post('/', async (req, res, next) => {

    try {
        var decoded = authentication.verifyJwt(req);
        var reqCalendar = req.body;

        /* FIXME: body 에 대한 예외 처리 더 다양하게! */
        if (!reqCalendar) {
            throw (errorSet.createError(errorSet.es.NO_CALENDARBODY));
        }

        var authInfo = await authentication.getAuthCode(decoded.userId);
        /* FIXME: 현재는 달력을 'primary' 에서만 처리하는데 안드로이드와 협의 후 다양한 달력list 사용하도록. */
        var resObj = await calendar_call.postEvents(authInfo, 'primary', reqCalendar);

        next(resObj);

    } catch (err) {
        next(err);
    }

});

/*

    PUT /calendar/:_id

    특정 _id 의 Calendar 의 정보를 수정한다.

*/
router.put('/:_id', async (req, res, next) => {

    try {
        var decoded = authentication.verifyJwt(req);
        var reqCalendar = req.body;
        var _id = req.params._id;

        /* FIXME: body 에 대한 예외 처리 더 다양하게! */
        if (!reqCalendar) {
            throw (errorSet.createError(errorSet.es.NO_CALENDARBODY));
        }

        var authInfo = await authentication.getAuthCode(decoded.userId);
        var resObj = await calendar_call.putEvents(authInfo, 'primary', _id, reqCalendar);

        next(resObj);

    } catch (err) {
        next(err);
    }

});

/*

    DELETE /calendar/:_id

    특정 _id 의 Calendar 이벤트를 삭제한다.

*/
router.delete('/:_id', async (req, res, next) => {

    try{
        var decoded = authentication.verifyJwt(req);
        var _id = req.params._id;

        var authInfo = await authentication.getAuthCode(decoded.userId);
        var resObj = await calendar_call.deleteEvents(authInfo, 'primary', _id);

        next(resObj);

    }catch(err){
        next(err);
    }

});

/*

    GET /calendar/certainmonth/

    사용자의 달력의 해당 년,월에 해당하는 한달 짜리 달력 이벤트
    객체를 반환한다.

*/
router.get('/certainmonth/:year/:month', async (req, res, next) => {

    try{
        var decoded = authentication.verifyJwt(req);
        var _year = req.params.year;
        var _month = req.params.month;

        if (_month > 12 || _month < 1) {
            throw(errorSet.createError(errorSet.es.INVALID_DATE));
        }

        var _minDate = new Date(_year, _month - 1, 1, 0, 0, 0);
        var _maxDate = new Date(_year, _month, 1, 0, 0, 0);

        var authInfo = await authentication.getAuthCode(decoded.userId);
        var authClient = authInfo.oAuth2Client;
        var resObj = await calendar_call.listEvents(authClient, 'primary', _minDate, _maxDate, null);

        next(resObj);

    }catch(err){
        next(err);
    }

});

/*

    /calendar/calendar-list    

    사용자의 캘린더 목록을 array로 가진 객체를 반환한다.

*/
router.get('/calendar-list', async (req, res, next) => {

    try{
        var decoded = authentication.verifyJwt(req);

        var authInfo = await authentication.getAuthCode(decoded.userId);
        var authClient = authInfo.oAuth2Client;        
        var resObj = await calendar_call.listCalendars(authClient);

        next(resObj);

    }catch(err){
        next(err);
    }

});

module.exports = router;