const Jwt = require('jsonwebtoken');
const config = require('../config');

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
