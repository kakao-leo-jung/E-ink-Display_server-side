var express = require('express');
const config = require('../config');
var User = require('../model/user');
var authentication = require('../auth/authentication');
var router = express.Router();

/* TODO: Author : 정근화 */

/**
 * @api {get} /user/ 유저의 정보를 요청합니다.
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiSuccess {String} userId      유저 고유 번호 값(구글)
 * @apiSuccess {String} email       유저 이메일 값
 * @apiSuccess {String} name        유저 풀네임
 * @apiSuccess {String} picture     유저 구글 사진 URL
 * @apiSuccess {String} given_name  유저 이름
 * @apiSuccess {String} family_name 유저 이름(성)
 * @apiSuccess {String} locale      유저 지역 정보
 * 
 *
 * @apiSuccessExample 성공 시 응답 :
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.get('/', (req, res) => {

    var decoded = authentication.verifyJwt(req, res);
    
    User.findOne({ userId: decoded.userId }, (err, resultUser) => {
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
            res.json(ret);

        }else{
            console.error(err);
            res.status(500);
            res.end();
        }
    });

});

module.exports = router;