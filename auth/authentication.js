const Jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../model/user');
const {
    google
} = require('googleapis');
const util = require('util');

/* TODO: Author : 정근화 */

/*

    본 모듈은 커스텀 JWT 에 관한 처리를 담당한다.
    JWT 생성과 인증에 관한 작업을 처리한다.

*/

/* JWT 인증을 위한 secret 키 */
const SECRET = config.JWT_SECRET;

/* google API 호출을 위한 credential 인증 정보 */
const CLIENT_ID = config.WEB_CLIENT_ID;
const CLIENT_SECRET = config.WEB_CLIENT_SECRET;
const CLIENT_REDIRECT_URIS = config.WEB_REDIRECT_URIS;

/*

    Request 받은 헤더에서
    해당 JWT 토큰을 입증하고 디코딩 된 값에서
    userId 를 추출할 수 있다.

*/
exports.verifyJwt = (req, res) => {

    /* 헤더로 부터 JWT 를 수신한다. */
    var reqJwt = req.headers.jwt;

    if (!reqJwt) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

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

        var resultUser = await User.findOne({
            userId: user_id
        }).catch(console.error);

        if (resultUser) {

            console.log("OAuth start");
            
            const oAuth2Client = new google.auth.OAuth2(
                CLIENT_ID, CLIENT_SECRET, CLIENT_REDIRECT_URIS);
            oAuth2Client.setCredentials(resultUser.tokens);

            console.log("Before Update toknes : ");
            console.log(resultUser.tokens);

            await this.refreshToken(oAuth2Client, resultUser);
            
            console.log("OAuth finish");

            return {
                oAuth2Client : oAuth2Client,
                resultUser : resultUser
            };

            // return oAuth2Client;

        } else {
            /* 구글 토큰 미존재 */
            return null;
        }

    } catch (err) {
        console.error(err);
    }
}

/*

    accessToken 은 기한이 만료된다.
    oAuthClient.on 으로 기한이 만료되면 다음 refreshToken 을
    보급한다. 이때 토큰을 DB 에 갱신하여 저장해준다.

    FIXME: Refresh 가 항시 작동하지 않아서 추후에 제대로 DB 에 갱신되는지 테스트 해봐야함.
    -> 테스트 확인함, 정상작동

*/
exports.refreshToken = async (authClient, resultUser) => {

    console.log("Trying refreshToken : ");

    authClient.on('tokens', async (tokens) => {

        console.log("Token Refreshed : " + util.inspect(tokens, false, null, true /* enable colors */ ));

        var objToken = {
            access_token : tokens.access_token,
            refresh_token : resultUser.tokens.refresh_token,
            scope : tokens.scope,
            token_type : tokens.token_type,
            id_token : tokens.id_token,
            expiry_date : tokens.expiry_date
        };

        if (tokens.refresh_token) {
            console.log("REFRESH_TOKEN** : " + tokens.refresh_token);
            objToken.refresh_token = tokens.refresh_token;
        }

        resultUser.tokens = objToken;
        resultUser = await resultUser.save();
        console.log("Updated User.tokens DB : " + resultUser.tokens);

    });

}