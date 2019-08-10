var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* TODO Author : 정근화 */
/*

    구글 인증 시 유저정보를 조회하고 등록 할 스키마
    구글로 로그인 한 유저의 정보를 우리가 가지고 있는 가를
    userId 를 비교함으로써 확인한다.

    또한 api 요청 시 mcToken 값을 통해 해당 유저를 찾으며,
    구글 API 사용 시 찾은 유저의 googleToken 값을 사용해 구글API 를 요청한다.

*/
/*

    스키마 구조
    userId(string)          : 유저 토큰 아이디 숫자 값(token 의 sub 값)
    email(string)           : 유저 이메일
    name(string)            : 유저 풀 네임
    picture(string)         : 유저 사진 url
    given_name(string)      : 유저 이름
    family_name(string)     : 유저 이름(성)
    locale(string)          : 지역(한국은 ko)
    access_token(string)    : 구글에서 발급받은 id_token
    refresh_token(string)   : 우리쪽에서 새로 생성해서 발급한 JWT token

*/
var userSchema = new Schema({

    userId : String,
    email : String,
    name : String,
    picture : String,
    given_name : String,
    family_name : String,
    locale : String,
    access_token : String,
    refresh_token : String

});

module.exports = mongoose.model('user', userSchema);