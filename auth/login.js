var express = require('express');
const {
    OAuth2Client
} = require('google-auth-library');
const {
    google
} = require('googleapis');
var User = require('../model/user');
const Jwt = require('jsonwebtoken');
const config = require('../config');
var router = express.Router();

/* TODO: Author : 정근화 */

/*

    본 모듈은 /loginToken 으로 들어온 요청을 처리한다.
    loginToken/ 은 googleToken 을 받아 인증절차를 거치고
    새로 생성한 커스텀 JWT를 안드로이드와의 통신 인증 수단으로 발급한다.

*/

/* 구글 프로젝트에 등록한 안드로이드 어플리케이션의 웹 클라이언트ID 값 */
const CLIENT_ID = config.WEB_CLIENT_ID;
const CLIENT_SECRET = config.WEB_CLIENT_SECRET;
const CLIENT_REDIRECT_URIS = config.WEB_REDIRECT_URIS;
const client = new OAuth2Client(CLIENT_ID);

/* authCode 를 분석하기 위한 credentials.json 을 사용하여 authclient를 생성. */
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_REDIRECT_URIS
);

const oAuth2ClientWebDebugging = new google.auth.OAuth2(

);

/* JWT 발급을 위한 secret 키 */
const SECRET = config.JWT_SECRET;



/*

    /loginToken/

    LoginToken 구글 로그인 받은 토큰을 분석해서 처리한다.
    구현할 로직은 다음과 같다.

    0. authCode 를 받아 accessToken, refreshToken, idToken 으로 분리한다.
    1. 받은 아이디 토큰의 유효성을 검사하고 Payload를 불러온다.
    2. userID 값을 이용해 DB를 조회한다.
        - DB에 존재안함 : 새 user를 등록 한다.

*/
router.get('/', (req, res) => {
    /* 인증 코드를 담는다. */
    const authCode = req.query.code;
    console.log("Receive AuthCode from client : " + authCode);
    returnJWT(authCode, res);
});

/*

    모든 구글 토큰의 인증과정과 DB 생성 및 조회,
    리턴의 과정을 순차적으로 처리한다.

    * 각 단계의 오류 및 예외 처리를 해주어야 함.

*/
async function returnJWT(authCode, res) {

    /* authCode 로 부터 토큰을 추출해 낸다. */
    console.log("Enter oAuth2Client.getToken : resultUser.google_authCode : " + authCode);
    const {
        tokens
    } = await oAuth2Client.getToken(authCode);
    console.log("getToken Method Result [access_tokens] : " + tokens.access_token);
    console.log("getToken Method Result [refresh_tokens] : " + tokens.refresh_token);
    console.log("getToken Method Result [id_tokens] : " + tokens.id_token);

    /* 구글 ID 토큰 유효성 검사 및 payload 추출 */
    const payload = await verify(tokens).catch(console.error);

    /* 추출한 payload 에서 userid(sub 값)을 이용하여 DB 를 조회한다. */
    const searchedUser = await searchDB(tokens, payload).catch(console.error);

    /* JWT 를 생성한다. */
    const newJwt = Jwt.sign({
            _id: searchedUser._id,
            userId: searchedUser.userId
        },
        SECRET, {
            expiresIn: '24h',
            issuer: 'com.jcp.magicapplication',
            subject: 'userAuth'
        }
    );

    console.log("newJWT -----------------------------");
    console.log(newJwt);

    /* JWT를 리턴한다. */
    res.writeHead(200);
    res.write(newJwt);
    res.end();

}

/*

    인증한 토큰의 Payload 를 가지고 DB를 조회 하는 함수
    유저를 조회해보고 유저가 없으면 새 유저를 생성한다.
    결과적으로 userId와 일치하는 유저를 반환한다.

*/
async function searchDB(tokens, payload) {

    try {

        /* userId 가 일치하는 유저가 DB에 존재하는지 조회한다. */
        var resultUser = await User.findOne({
            userId: payload.sub
        });

        /* DB 에 기존 유저 없음 */
        if (!resultUser) {

            /* DB 에 새 유저 등록 */
            try {

                const newUser = new User({
                    userId: payload.sub,
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    given_name: payload.given_name,
                    family_name: payload.family_name,
                    locale: payload.locale,
                    tokens: ""
                });

                resultUser = await newUser.save();

            } catch (err) {
                console.error(err);
            }
        }

        /* 조회한 유저의 구글 토큰값을 갱신한다. */
        resultUser.tokens = tokens;
        resultUser = await resultUser.save();

        console.log("resultUser(googleToken set) --------------------");
        console.log(resultUser);

        /* 조회한 유저 객체를 반환한다. */
        return resultUser;

    } catch (err) {

        console.error(err);

    }

}

/*

    구글 토큰의 유효성을 검사하는 함수, 유효하면 JSON 오브젝트 형태의 PAYLOAD 부분을 리턴한다.

    홈페이지 : https://developers.google.com/identity/sign-in/web/backend-auth

*/
/*

        PAYLOAD -- (안드로이드에서 구글에 권한 요청할 때 일단 email, profile 옵션만 요청 함.)
        aud(string)             : 토큰 대상자 - 웹 클라이언트ID(내가 구글에서 발급 받은) 일치해야함.
        iss(string)             : 토큰 발급자 - 구글토큰사용(https://accounts.google.com)
        sub(string)             : 유저 토큰 아이디 숫자 값
        email(string)           : 유저 이메일
        email_verified(bool)    : 이메일 유효성 검사 값
        name(string)            : 유저 풀 네임
        picture(string)         : 유저 사진 url
        given_name(string)      : 유저 이름
        family_name(string)     : 유저 이름(성)
        locale(string)          : 지역(한국은 ko)
        exp(string)             : 토큰만료시간
        iat(string)             : 토큰발급시간 -> iat를 통해 토큰의 나이를 확인 가능

*/
async function verify(tokens) {

    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: CLIENT_ID,
    });

    /* 아래 코드는 verify 가 성공하였을 때 해야 할 역할 */
    const payload = ticket.getPayload();
    console.log("Token Payload -----------------------");
    console.log(payload);
    return payload;

}

module.exports = router;