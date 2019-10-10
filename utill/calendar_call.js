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
exports.listEvents = (auth, count, response) => {

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
exports.listCertainDay = (auth, minDate, maxDate, response) => {

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
        /* TODO: 현재 end date 가 걸치는 전날의 일정도 같이 잡힌다. start date가 일치하는 것만 결러내야야함 */
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
exports.listCalendars = (auth, response) => {
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

/*

    특정 월의 한달 이벤트를 조회한 후
    달력 형태의 jsonObject로 응답한다.    

*/
exports.listCertainMonth = (auth, minDate, maxDate, response) => {

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
        /* TODO: start date 기준으로 해당 월의 이내에 있는 -> 이전달 31일꺼 걸러내야함 */
        /* TODO: json[] -> {day}/{title}/{starttime}/{endtime} +{memo}{people}{location}도 post */
        /* TODO: 요구사항 객체에 맞게 커스터마이징 해서 response 할것 */
        const events = res.data.items;
        console.log(events);

    });

}