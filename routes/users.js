var express = require('express');
const Jwt = require('jsonwebtoken');
const config = require('../config');
var User = require('../model/user');
var router = express.Router();

/* TODO Author : 정근화 */

/*

    본 모듈은 /users 로 들어온다.
    유저에 관한 데이터를 반환한다.

*/

/* JWT 인증을 위한 secret 키 */
const SECRET = config.JWT_SECRET;

/*

    /users/info
    
    post 로 들어온 유저의 JWT 값을 인증하고
    userId 값으로 DB를 조회한 후에
    유저의 정보를 json 형태로 반환한다.

    header : jwt : 'jdklsjfies'

*/
router.post('/info', function(req, res){

    /* 헤더로 부터 JWT 를 수신한다. */
    var reqJwt = req.headers.jwt;

    /* 받아온 JWT 를 검사한다. */
    /*
    
        token does not exist
        - 토큰이 존재하지 않음(로그인 안된 상태) 403 반환

    */
    if(!reqJwt) {
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
    console.log("decoded UserId : "+decoded.userId);
    
    /*

        userId 값을 통해 db를 조회하고 필요한 정보를
        가져와 Object 로 생성한다.
        userId(string)          : 유저 토큰 아이디 숫자 값(token 의 sub 값)
        email(string)           : 유저 이메일
        name(string)            : 유저 풀 네임
        picture(string)         : 유저 사진 url
        given_name(string)      : 유저 이름
        family_name(string)     : 유저 이름(성)
        locale(string)          : 지역(한국은 ko)

    */
    User.findOne({ userId: decoded.userId }, function(err, resultUser){
        if(!err){

            var ret = {

                userId : resultUser.userId,
                email : resultUser.email,
                name : resultUser.name,
                picture : resultUser.picture,
                given_name : resultUser.given_name,
                family_name : resultUser.family_name,
                locale : resultUser.locale
        
            };

            /* 객체를 리턴한다 */
            res.json(ret);

        }else{
            console.error(err);
            res.status(500);
            res.end();
        }
    });

});

module.exports = router;