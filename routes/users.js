var express = require('express');
const Jwt = require('jsonwebtoken');
var router = express.Router();

/* TODO Author : 정근화 */

/*

    본 모듈은 /users 로 들어온다.
    유저에 관한 데이터를 반환한다.

*/

/* JWT 발급을 위한 secret 키 */
const SECRET = config.secret;

/*

    /users/info
    
    post 로 들어온 유저의 JWT 값을 인증하고
    userId 값으로 DB를 조회한 후에
    유저의 정보를 json 형태로 반환한다.

    header : jwt : 'jdklsjfies'

*/
router.post('/info', function(req, res){

    /* 헤더로 부터 JWT 를 수신한다. */
    //var reqJwt = req.headers.jwt;

    /* 받아온 JWT 를 검사한다. */
    /*
    
        token does not exist
        - 토큰이 존재하지 않음(로그인 안된 상태) 403 반환

    */
    // if(!reqJwt) {
    //     return res.status(403).json({
    //         success: false,
    //         message: 'not logged in'
    //     })
    // }

    /*
    
        token exixt
        - 토큰 존재, 토큰의 유효성을 검증하고
        유효하면 디코딩된 값을 추출한다.

    */
    //var decoded = Jwt.verify(reqJwt, SECRET);
    
    //console.log(decoded.userId);

});

module.exports = router;