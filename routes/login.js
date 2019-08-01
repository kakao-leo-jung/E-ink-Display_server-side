var express = require('express');
const { OAuth2Client } = require('google-auth-library');

/* 구글 프로젝트에 등록한 안드로이드 어플리케이션의 웹 클라이언트ID 값 */
const CLIENT_ID = "167626550583-ouo1ti55snfqphcgj63gm73a9n54rde8.apps.googleusercontent.com";

var router = express.Router();
const client = new OAuth2Client(CLIENT_ID);

/* TODO Author : 정근화 */

/* GET login page. */
router.post('/', function (req, res) {

    /*

        LoginToken 구글 로그인 받은 토큰을 분석해서 처리한다.
        구현할 로직은 다음과 같다.

        1. 받은 구글 토큰의 정보를 분석한다.
        ...

    */

    /* 구글 토큰을 담는다. */
    var googleToken = req.body.id_token;

    /* 구글 토큰 유효성 검사 */
    verify(googleToken).catch(console.error);

    /*

        이 사이에 res를 보내기 전에 절차를 행한다.

    */

    /* 응답 설정 */
    res.writeHead(200);
    res.write(googleToken);
    res.end();

});

/*

    구글 토큰의 유효성을 검사하는 함수
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

    /* client.verifyIdToken 함수를 이용해 비동기적으로 ID토큰의 유효성을 검사한다. */
    // The verifyIdToken function verifies the JWT signature,
    // the aud claim, the exp claim, and the iss claim.
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
        성공/실패 유무를 어떻게 구분하는지 알아봐야 함.
    
    */

    /* 아래 코드는 verify 가 성공하였을 때 해야 할 역할 */
    const payload = ticket.getPayload();
    const userid = payload.sub;
    const exp = payload.exp;
    const email = payload.email;
    const name = payload.name;
    console.log("payload : " + JSON.stringify(payload));
    console.log("userid : " + userid);
    console.log("exp : " + exp);
    console.log("email : " + email);
    console.log("name : " + name);
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}

module.exports = router;
