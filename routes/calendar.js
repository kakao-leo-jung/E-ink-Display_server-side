var express = require('express');
const {
    google
} = require('googleapis');
var authentication = require('../auth/authentication');
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

    /calendar/next

    post 로 들어온 유저의 JWT 값을 인증하고
    userId 값으로 DB를 조회하여 googleToken을 조회한 후

    구글 Calendar api 를 호출한다.
    다음 primary calendar의 다음 10일 일정을 받아서
    반환한다.

    ** 10일 이 아닐 경우 body 에 nextCount : 12 이런식으로
    불러올 리스트의 개수를 parameter로 넣어서 호출한다.

*/
router.get('/next/:nextCount', function (req, res) {

    /* 요청에서 jwt 를 추출한 다음 veryfy 및 decoding 한다. */
    var decoded = authentication.verifyJwt(req, res);

    /* 달력의 일정리스트 호출 개수의 디폴트값은 10이다. */
    var maxCount = req.params.nextCount;
    if (!maxCount) {
        maxCount = 10;
    }

    /*

        userId 값을 통해 db의 AuthCode 값을 조회한다.
        authCode 조회 성공 후 인증된 auth클라이언트를 이용해
        원하는 함수를 호출한다. (listEvents 실행)

    */
    authentication.getAuthCode(decoded.userId).then(authClient => {
        console.log("authClient get : " + authClient);
        if (authClient) {
            listEvents(authClient, maxCount, res);
        } else {
            res.set(500);
            res.end();
        }
    });

});

/*

    /calendar/certainday

    post 로 들어온 유저의 JWT 값을 인증하고
    userId 값으로 DB를 조회하여 googleToken을 조회한다.

     - yyyy (4자리 int)
     - m or mm (1 또는 2자리 int)
     - d or dd (1 또는 2자리 int)

    또한 요청 body 의 값을 통해 특정 년, 월, 일을 추출한다.

    구글 Calendar api 를 호출한다.
    해당 년, 월, 일의 제목과 내용을 호출하여 반환한다.

*/
router.get('/certainday/:year/:month/:day', function (req, res) {

    var decoded = authentication.verifyJwt(req, res);

    console.log("decoded : " + decoded);

    var _year = req.params.year;
    var _month = req.params.month;
    var _day = req.params.day;

    console.log("requested Certainday : " + _year + " / " + _month + " / " + _day);

    /* 날짜 유효성 검사 */
    if (_month > 12 || _month < 1 || _day > 31 || _day < 1) {
        console.log("requested Day is invalid : response 400");
        res.set(400);
        res.end();
    }
    
    /* KST 시간 기준 9 시간 빼서 GMT 기준 설정 */
    var _minDate = new Date(_year, _month - 1, _day - 1, 15, 0, 0);
    var _maxDate = new Date(_year, _month - 1, _day, 15, 0, 0);

    authentication.getAuthCode(decoded.userId).then(authClient => {
        if (authClient) {
            listCertainDay(authClient, _minDate, _maxDate, res);
        } else {
            res.set(500);
            res.end();
        }
    });

});


/*

  사용자의 캘린더 목록을 array로 가진 객체를 반환한다.

*/
router.get('/calendar-list', function (req, res) {
    var decoded = authentication.verifyJwt(req, res);

    authentication.getAuthCode(decoded.userId).then(authClient => {
        if (authClient) {
            listCalendars(authClient, res);
        } else {
            res.set(500);
            res.end();
        }
    });

});


/*

    현재 시간으로부터 다음 count개의 이벤트를 유저의 primary 달력에서 가져온다.

    Lists the next 10 events on the user's primary calendar.
    @param {google.auth.OAuth2} auth An authorized OAuth2 client.

*/
function listEvents(auth, count, response) {

    console.log("entered listEvent, Auth : " + auth);

    const calendar = google.calendar({
        version: 'v3',
        auth
    });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: count,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) {
            response.set(400);
            response.end();
            return console.log('The API returned an error: ' + err);
        }

        /* 달력 이벤트 객체를 리턴 */
        const events = res.data.items;
        var retObj = new Object();
        retObj.days = events;
        console.log("Calendar 10days return : " + JSON.stringify(retObj));
        response.json(retObj);

    });
}

/*

    특정 범위의 날짜 구간의 이벤트를
    유저의 primary 달력에서 가져온다.

    해당 minDate, maxDate 는 시간까지 정의가 되어 있어야 한다.

*/
function listCertainDay(auth, minDate, maxDate, response) {

    console.log("entered listCertainDay, Auth : " + auth);

    const calendar = google.calendar({
        version: 'v3',
        auth
    });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: minDate.toISOString(),
        timeMax: maxDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) {
            response.set(400);
            response.end();
            return console.log('The API returned an error: ' + err);
        }

        /* 달력 이벤트 객체를 리턴 */
        const events = res.data.items;
        var retObj = new Object();
        retObj.days = events;
        console.log("Calendar Certain days(" + minDate.toISOString() + " - " + maxDate.toISOString() + ") return : " + JSON.stringify(retObj));
        response.json(retObj);

    });

}

/*

    사용자의 캘린더 리스트들을 가져온다.
    key값은 retObj.calendarName

*/
function listCalendars(auth, response) {
    const calendar = google.calendar('v3');

    calendar.calendarList.list({
            auth: auth,
            maxResults: 10
        },
        function (err, calendarList) {
            if(err){
                response.set(400);
                response.end();
                return console.log('The API returned an error: ' + err);
            }
            var retObj = new Object();
            retObj.calendarName = new Array();
            for(const curItem of calendarList.data.items){
                retObj.calendarName.push(curItem.summary);
            }
            console.log("Calendar List : " + JSON.stringify(retObj));
            response.json(retObj);
        }
    )
}

module.exports = router;