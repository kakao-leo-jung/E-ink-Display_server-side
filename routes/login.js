var express = require('express');
var router = express.Router();

/* TODO Author : 정근화(수빈님 코드 참고) */

/* GET login page. */
router.post('/', function(req, res) {

    /*

        LoginToken 구글 로그인 받은 토큰을 분석해서 처리한다.
        구현할 로직은 다음과 같다.

        1. 받은 구글 토큰의 정보를 분석한다.
        ...

    */

    /* 구글 토큰을 담는다. */
    var googleToken = req.body.id_token;

    console.log("로그인 시도 토큰 : "+googleToken);

    /*

        이 사이에 res를 보내기 전에 절차를 행한다.

    */

    /* 응답 설정 */
    res.writeHead(200);
    res.write(googleToken);
    res.end();

});

module.exports = router;
