var express = require('express');
const Jwt = require('jsonwebtoken');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const config = require('../config');
var User = require('../model/user');
var router = express.Router();

/* TODO Author : 정근화 */

/*

    본 모듈은 /calendar 로 들어온다.
    google calendar api 호출을 사용하여
    개인의 달략에 관한 요청값을 반환한다.

    참고 : https://developers.google.com/calendar/quickstart/nodejs

    * 호출 과정
    1. 먼저 요청의 헤더로 부터 jwt를 수신한다.
    2. jwt 를 verify 하고 jwt 로 부터 user_id 검출한다.
    3. user_id 로 DB 를 조회하여 access_token 을 조회한다.
``
*/

/* JWT 인증을 위한 secret 키 */
const SECRET = config.JWT_SECRET;

/* google calendar 를 위한 credential 인증 정보 */
const CLIENT_ID = config.WEB_CLIENT_ID;
const CLIENT_SECRET = config.WEB_CLIENT_SECRET;
const CLIENT_REDIRECT_URIS = config.WEB_REDIRECT_URIS;

/* 달력 호출을 위한 Scope 설정 */
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

/*

    /calendar/next
    
    post 로 들어온 유저의 JWT 값을 인증하고
    userId 값으로 DB를 조회하여 googleToken을 조회한 후
    
    구글 Calendar api 를 호출한다.
    다음 primary calendar의 다음 10일 일정을 받아서
    반환한다.

*/
router.post('/next', function (req, res) {

    /* 헤더로 부터 JWT 를 수신한다. */
    var reqJwt = req.headers.jwt;

    /* 받아온 JWT 를 검사한다. */
    /*
    
        token does not exist
        - 토큰이 존재하지 않음(로그인 안된 상태) 403 반환

    */
    if (!reqJwt) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    /*
    
        token exixt
        - 토큰 존재, 토큰의 유효성을 검증하고
        유효하면 디코딩된 값에서 userId 값을 추출한다.

    */
    var decoded = Jwt.verify(reqJwt, SECRET);
    console.log("decoded userId : " + decoded.userId);

    /*

        userId 값을 통해 db의
        AuthCode 값을 조회한다.

    */
    getAuthCode(decoded.userId, res);

});

/*

    User DB 에서 user_id 를 사용하여 해당 유저의
    access_Token 을 반환한다.

*/
async function getAuthCode(user_id, res) {

    var resultUser;

    try {

        resultUser = await User.findOne({ userId: user_id }).catch(console.error);

    } catch (err) {

        console.error(err);

    }

    if (resultUser) {

        /* 구글 토큰 존재 */
        /*

            credential 정보로 OAuth 클라이언트 객체를 생성하고
            DB에 존재하던 authCode 로 getToken 을 얻어낸다.
            객체에 토큰 값을 담는다.

            Create an OAuth2 client with the given credentials, and then execute the
            given callback function.
            @param {Object} credentials The authorization client credentials.
            @param {function} callback The callback to call with the authorized client.
        
        */
        console.log("OAuth start");
        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID, CLIENT_SECRET, CLIENT_REDIRECT_URIS);
        console.log("OAuth2Client is created!");

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);

        console.log("Enter oAuth2Client.getToken : resultUser.google_authCode : " + resultUser.google_authCode);
        const { tokens } = await oAuth2Client.getToken(resultUser.google_authCode);
        console.log("oAuth2Client.getToken success! : " + tokens.toString());
        oAuth2Client.setCredentials(tokens);
        console.log("OAuth finish");

        /*

            accessToken 의 만료시점이 다가올 경우 감지하여 refreshToken 을 발급받는다.
            refreshToken 을 발급받아 DB 에 토큰으로 저장한다.

        */
        oAuth2Client.on(tokens, (tokens) => {
            if (tokens.refresh_token) {

                // store the refresh_token in my database!
                console.log("REFRESH_TOKEN*** : " + tokens.refresh_token);

                refreshToken(tokens.refreshToken);

            }

            console.log("ACCESS_TOKEN*** : " + tokens.access_token);
            console.log("ID_TOKEN*** : " + tokens.id_token);

        });

        listEvents(oAuth2Client);

        res.set(200);
        res.end();

    } else {

        /* 구글 토큰 미존재 */
        res.set(500);
        res.end();
    }



}

/*

    다음 10개의 이벤트를 유저의 primary 달력에서 가져온다.

    Lists the next 10 events on the user's primary calendar.
    @param {google.auth.OAuth2} auth An authorized OAuth2 client.

*/
function listEvents(auth) {

    console.log("entered listEvent, Auth : " + auth);

    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}

/*

    accessToken 은 기한이 만료된다.
    oAuthClient.on 으로 기한이 만료되면 다음 refreshToken 을
    보급한다. 이때 토큰을 DB 에 갱신하여 저장해준다.

*/
async function refreshToken(refreshToken) {

    try {

        /* userId 가 일치하는 유저가 DB에 존재하는지 조회한다. */
        var resultUser = await User.findOne({ userId: payload.sub });

        /* 조회한 유저의 구글 토큰값을 갱신한다. */
        resultUser.google_authCode = refreshToken;
        resultUser = await resultUser.save();

    } catch (err) {

        console.error(err);

    }

}

module.exports = router;