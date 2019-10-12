const {
    google
} = require('googleapis');

/* TODO: Author : 정근화 */
/*

    Google Calendar API 를 호출하여 대신 response 해주는 유틸 클래스.
    calendar.js 에서 호출받으면 현재 클래스의 함수를 활용하여 처리한다.

*/

/*

    현재 시간으로부터 다음 count개의 이벤트를 유저의 primary 달력에서 가져온다.

    Lists the next 10 events on the user's primary calendar.
    @param {google.auth.OAuth2} auth An authorized OAuth2 client.

*/
exports.listEvents = (auth, calendarId, minDate, maxDate, maxCount, response) => {

    const calendar = google.calendar({
        version: 'v3',
        auth
    });

    var params = new Object();
    params.calendarId = calendarId;
    minDate ? params.timeMin = minDate.toISOString() : null;
    maxDate ? params.timeMax = maxDate.toISOString() : null;
    maxCount ? params.maxResults = maxCount : null;
    params.singleEvents = true;
    params.orderBy = 'startTime';
    params.timeZone = 'Asia/Seoul';

    calendar.events.list(params, (err, res) => {
        if (err) {
            response.set(400);
            response.end();
            return console.log('The API returned an error: ' + err);
        }
        const events = res.data.items;
        console.log(events);
        response.json(eventsToCustomObj(events));
    });
}

/*

    요청받은 calendarBody 정보를 바탕으로
    google Calendar 에 insert 한다.

*/
exports.postEvents = (authInfo, calendarId, calendarBody, response) => {

    var auth = authInfo.oAuth2Client;
    const calendar = google.calendar({
        version: 'v3',
        auth
    });

    var params = new Object();
    params.calendarId = calendarId;

    /* attendee self자신 추가 */
    calendarBody.people.push({
        "email":authInfo.resultUser.email,
        "responseStatus":"accepted"
    });

    params.requestBody = {
        start : {
            dateTime:calendarBody.startTime
        },
        end : {
            dateTime:calendarBody.endTime
        },
        summary : calendarBody.title,
        description : calendarBody.memo,
        location : calendarBody.location,
        attendees : calendarBody.people
    };

    calendar.events.insert(params, (err, res) => {
        if(err){
            response.set(400);
            response.end();
            return console.log('The API returned an error: ' + err);
        }

        response.json(eventToCustomObj(res.data));

    });

};

/*

    요청받은 이벤트id 와 캘린더 정보를 바탕으로
    google calendar 에 내용을 수정한다.

*/
exports.putEvents = (authInfo, calendarId, eventId, calendarBody, response) => {

    var auth = authInfo.oAuth2Client;
    const calendar = google.calendar({
        version: 'v3',
        auth
    });

    var params = new Object();
    params.calendarId = calendarId;
    params.eventId = eventId;
    params.requestBody = {
        start : {
            dateTime:calendarBody.startTime
        },
        end : {
            dateTime:calendarBody.endTime
        },
        summary : calendarBody.title,
        description : calendarBody.memo,
        location : calendarBody.location,
        attendees : calendarBody.people
    };

    calendar.events.update(params, (err, res) => {
        if(err){
            response.set(400);
            response.end();
            return console.log('The API returned an error: ' + err);
        }

        response.json(eventToCustomObj(res.data));
    });

};

/*

    요청받은 이벤트 id 값을 가진 google calendar
    이벤트를 삭제한다.

*/
exports.deleteEvents = (authInfo, calendarId, eventId, response) => {

    var auth = authInfo.oAuth2Client;
    const calendar = google.calendar({
        version: 'v3',
        auth
    });
    
    var params = new Object();
    params.calendarId = calendarId;
    params.eventId = eventId;

    calendar.events.delete(params, (err, res) => {
        if(err){
            response.set(400);
            response.end();
            return console.log('The API returned an error: ' + err);
        }
        response.end("Calendar Event [" + eventId + "] delete Success!");
    });

};

/*

    사용자의 캘린더 리스트들을 가져온다.
    key값은 retObj.calendarName

*/
exports.listCalendars = (auth, response) => {
    const calendar = google.calendar('v3');

    calendar.calendarList.list({
            auth: auth,
            maxResults: 10
        },
        function (err, calendarList) {
            if (err) {
                response.set(400);
                response.end();
                return console.log('The API returned an error: ' + err);
            }
            var retObj = new Object();
            retObj.calendarName = new Array();
            for (const curItem of calendarList.data.items) {
                retObj.calendarName.push(curItem.summary);
            }
            console.log("Calendar List : " + JSON.stringify(retObj));
            response.json(retObj);
        }
    )
}


/*

    events reference : https://developers.google.com/calendar/v3/reference/events#resource

    GoogleAPI 호출을 통해 받은 events 객체를
    안드로이드에서 알맞게 사용할 수 있도록 커스터마이징 객체로 바꾸어 리턴한다.
    @params _id       : String
    @params day       : Date
    @params title     : String
    @params memo      : String
    @params startTime : Date
    @params endTime   : Date
    @params location  : String
    @params people    : Attendees[]

*/
eventToCustomObj = (event) => {
    
    var obj = {
        _id : event.id,
        day : "",
        title: event.summary ? event.summary : "",
        memo: event.description ? event.description : "",
        startTime: event.start.date ? event.start.date : event.start.dateTime,
        endTime: event.end.date ? event.end.date : event.end.dateTime,
        location: event.location ? event.location : "",
        people: event.attendees ? event.attendees : [],
    }
    obj.day = new Date(obj.startTime).getDate();

    return obj;
}

eventsToCustomObj = (events) => {

    var retObjArr = new Array();
    for (var event of events) {
        retObjArr.push(eventToCustomObj(event));
    }
    return retObjArr;
};
