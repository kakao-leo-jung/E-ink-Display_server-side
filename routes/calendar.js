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

*/

/* JWT 인증을 위한 secret 키 */
const SECRET = config.secret;

/* 달력 호출을 위한 Scope 설정 */
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

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
        googleToken 값을 조회한다.

    */
    var gToken = getToken(decoded.userId);
    if (!gToken) {

        /* 구글 토큰 */
        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });


    } else {
        res.set(500);
        res.end();
    }

});

/*

    User DB 에서 user_id 를 사용하여 해당 유저의
    googleToken 을 반환한다.

*/
async function getToken(user_id) {

    var resultUser = await User.findOne({ userId: user_id }).catch(console.error);

    if (!resultUser) {
        return resultUser.googleToken;
    } else {
        return null;
    }

}

module.exports = router;