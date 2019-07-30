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
    var googleToken = "";

    /* data 를 googleToken에 넣음 */
    req.on('data',function(data){
        googleToken += data;
    });
 
    //더 이상 데이터가 들어오지 않는다면 end 이벤트 실행
    req.on('end',function(){
        console.log("token : "+googleToken);
        res.writeHead(200);
    });

    /*

        이 사이에 res를 보내기 전에 절차를 행한다.

    */
 
    res.write(googleToken.toString()); //OK라는 내용이 안드로이드의 ReadBuffer를 통해 result String으로 바뀜
    res.end();

});

module.exports = router;
