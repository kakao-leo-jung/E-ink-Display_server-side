var express = require('express');
const { OAuth2Client } = require('google-auth-library');
var User = require('../model/user');
const Jwt = require('jsonwebtoken');
const config = require('../config');


/* 구글 프로젝트에 등록한 안드로이드 어플리케이션의 웹 클라이언트ID 값 */
const CLIENT_ID = config.WEB_CLIENT_ID;

/* JWT 발급을 위한 secret 키 */
const SECRET = config.secret;

var router = express.Router();
const client = new OAuth2Client(CLIENT_ID);

/* TODO Author : 정근화 */

/* GET login page. */
/*

    LoginToken 구글 로그인 받은 토큰을 분석해서 처리한다.
    구현할 로직은 다음과 같다.

    1. 받은 구글 토큰의 유효성을 검사하고 Payload를 불러온다.
    2. userID 값을 이용해 DB를 조회한다.
        - DB에 존재안함 : 새 user를 등록 한다.

*/
router.post('/', function (req, res) {

    /* 구글 토큰을 담는다. */
    const googleToken = req.body.id_token;

    /* 토큰을 인증 및 DB 조회를 한다. */
    const jwt = verifyAndGetUserDB(googleToken);

    /*

        

    */

    /*

        이 사이에 res를 보내기 전에 절차를 행한다.

    */

    /* 응답 설정 */
    console.jwt("jwt : "+jwt);
    res.writeHead(200);
    res.write(jwt.toString());
    res.end();

});

/*

    모든 구글 토큰의 인증과정과 DB 생성 및 조회를
    순차적으로 처리한다.

*/
async function verifyAndGetUserDB(token) {

    /* 구글 토큰 유효성 검사 및 payload 추출 */
    const payload = await verify(token).catch(console.error);

    /* 추출한 payload 에서 userid(sub 값)을 이용하여 DB 를 조회한다. */
    const searchedUser = await searchDB(token, payload).catch(console.error);

    console.log("searchedUser --------------------");
    console.log(searchedUser);

    /* JWT 를 생성한다. */
    const newJwt = Jwt.sign(
        {
            _id: searchedUser._id,
            userId: searchedUser.userId
        },
        SECRET,
        {
            expiresIn: '24h',
            issuer: 'com.jcp.magicapplication',
            subject: 'userAuth'
        }
    );

    console.log("newJWT -----------------------------");
    console.log(newJwt);

    return newJwt;

}

/*

    인증한 토큰의 Payload 를 가지고 DB를 조회 하는 함수
    유저를 조회해보고 유저가 없으면 새 유저를 생성한다.
    결과적으로 userId와 일치하는 유저를 반환한다.

*/
async function searchDB(token, payload) {

    try {

        /* userId 가 일치하는 유저가 DB에 존재하는지 조회한다. */
        var resultUser = await User.findOne({ userId: payload.sub });

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
                    googleToken: "",
                    mcToken: ""
                });

                resultUser = await newUser.save();

                console.log("DB- newUser(resultUser) ----------------------");
                console.log(resultUser);

            } catch (err) {

                console.error(err);

            }

        }

        /* 조회한 유저의 구글 토큰값을 갱신한다. */
        resultUser.googleToken = token;
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

    After you receive the ID token by HTTPS POST, you must verify the integrity of the token.
    To verify that the token is valid, ensure that the following criteria are satisfied:

    The ID token is properly signed by Google.
    Use Google's public keys (available in JWK or PEM format) to verify the token's signature.
    These keys are regularly rotated;
    examine the Cache-Control header in the response to determine when you should retrieve them again.
    
    The value of aud in the ID token is equal to one of your app's client IDs.
    This check is necessary to prevent ID tokens issued to a malicious app
    being used to access data about the same user on your app's backend server.
    
    The value of iss in the ID token is equal to accounts.google.com or https://accounts.google.com.
    
    The expiry time (exp) of the ID token has not passed.
    
    If you want to restrict access to only members of your G Suite domain,
    verify that the ID token has an hd claim that matches your G Suite domain name.
    Rather than writing your own code to perform these verification steps,
    we strongly recommend using a Google API client library for your platform, or a general-purpose JWT library.
    For development and debugging, you can call our tokeninfo validation endpoint.



*/
async function verify(token) {

    /* 
    
        client.verifyIdToken 함수를 이용해 비동기적으로 ID토큰의 유효성을 검사한다.
        The verifyIdToken function verifies the JWT signature,
        the aud claim, the exp claim, and the iss claim.

        JWT Signature 확인, CLIENT_ID 일치 여부 확인, 만료여부 확인, 구글발급 확인

    */
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    /*
    
        TODO
        위의 verifyIdToken 에서 JWT signature 와
        aud, exp, iss 를 검사하였는데, 이 입증의 결과의
        성공/실패 유무를 어떻게 구분하는지 알아봐고 코드를 작성해야 함.
    
    */







    /* 아래 코드는 verify 가 성공하였을 때 해야 할 역할 */
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
    const payload = ticket.getPayload();
    console.log("payload : " + JSON.stringify(payload));
    return payload;

    /*

        아래와 같이 추출해서 사용 가능
        const userid = payload.sub;
        const exp = payload.exp;
        const email = payload.email;
        const name = payload.name;

    */
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}

module.exports = router;
