# MagicCalendar - Serverside

ip : 169.56.98.117 / port : 80



### API Specification
-----
||REQEST||RESPONSE|||
|NAME|HEADER|BODY|HEADER|BODY|DESCRIPTION|
|---|---|---|---|---|---|
|'/loginToken'||GoogleToken(string)||JWT(string)|googleToken을 받아 로그인 처리하고 커스텀 토큰을 반환한다.|
|'/users/info'|Jwt(string)|||userInfo(json)|요청을 받으면 토큰인증을 통해 해당 사용자의 유저 정보를 반환한다.|