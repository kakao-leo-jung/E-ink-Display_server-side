const Jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../model/user');
const { google } = require('googleapis');

/* TODO Author : 정근화 */

/*

    본 모듈은 커스텀 JWT 에 관한 처리를 담당한다.
    JWT 생성과 인증에 관한 작업을 처리한다.

*/

/* JWT 인증을 위한 secret 키 */
const SECRET = config.JWT_SECRET;

/*

    Request 받은 헤더에서
    해당 JWT 토큰을 입증하고 디코딩 된 값에서
    userId 를 추출할 수 있다.

*/
exports.verifyJwt = (req, res) => {

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
        유효하면 디코딩된 값을 반환한다.

    */
    var decoded = Jwt.verify(reqJwt, SECRET);
    console.log("decoded userId : " + decoded.userId);

    return decoded;

}

/*

    User DB 에서 user_id 를 사용하여 해당 유저의
    access_Token 을 반환한다.

*/
exports.getAuthCode = async (user_id) => {

    try {

        var resultUser = await User.findOne({ userId: user_id }).catch(console.error);

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

            // const authUrl = oAuth2Client.generateAuthUrl({
            //     access_type: 'offline',
            //     scope: SCOPES,
            // });
            // console.log('Authorize this app by visiting this url:', authUrl);

            // console.log("Enter oAuth2Client.getToken : resultUser.google_authCode : " + resultUser.tokens.access_token);
            // const { tokens } = await oAuth2Client.getToken(resultUser.access_token);
            // console.log("oAuth2Client.getToken success! : " + tokens.toString());

            console.log("access_token : " + resultUser.tokens.access_token);
            console.log("oAuth2Client.refresh_token[pre] : " + JSON.stringify(oAuth2Client.credentials));
            // oAuth2Client.setCredentials(resultUser.tokens);

            oAuth2Client.credentials = {
                refresh_token: resultUser.tokens.refresh_token,
                access_token: resultUser.tokens.access_token
            };
            // oAuth2Client.refreshAccessToken(function (err, tokens) {
            //     console.log(tokens)
            //     oAuth2Client.credentials = { access_token: tokens.access_token }
            //     callback(oauth2Client);
            // });

            console.log("oAuth2Client.access_token : " + oAuth2Client.credentials.access_token);
            console.log("oAuth2Client.refresh_token : " + oAuth2Client.credentials.refresh_token);
            console.log("OAuth finish");

            /*

                accessToken 의 만료시점이 다가올 경우 감지하여 refreshToken 을 발급받는다.
                refreshToken 을 발급받아 DB 에 토큰으로 저장한다.

            */
            oAuth2Client.on(resultUser.tokens, (tokens) => {
                if (tokens.refresh_token) {

                    // store the refresh_token in my database!
                    console.log("REFRESH_TOKEN*** : " + tokens.refresh_token);

                    refreshToken(tokens.refreshToken);

                }

                console.log("ACCESS_TOKEN*** : " + tokens.access_token);
                console.log("ID_TOKEN*** : " + tokens.id_token);

            });

            return oAuth2Client;
            // listEvents(oAuth2Client, res);

        } else {

            return null;
            /* 구글 토큰 미존재 */
            // res.set(500);
            // res.end();
        }



    } catch (err) {

        console.error(err);

    }

}

/*

    accessToken 은 기한이 만료된다.
    oAuthClient.on 으로 기한이 만료되면 다음 refreshToken 을
    보급한다. 이때 토큰을 DB 에 갱신하여 저장해준다.

*/
exports.refreshToken = async (refreshToken) => {

    try {

        /* userId 가 일치하는 유저가 DB에 존재하는지 조회한다. */
        var resultUser = await User.findOne({
            userId: payload.sub
        });

        /* 조회한 유저의 구글 토큰값을 갱신한다. */
        resultUser.tokens = refreshToken;
        resultUser = await resultUser.save();

    } catch (err) {

        console.error(err);

    }

}