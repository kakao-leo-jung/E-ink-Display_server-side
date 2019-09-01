# MagicCalendar - Serverside

ip : 169.56.98.117 / port : 80



### API Specification
-----
|METHOD|NAME|HEADER|BODY|HEADER|BODY|DESCRIPTION|
|---|---|---|---|---|---|---|
|POST|'/loginToken'|-|GoogleToken(string)|-|JWT(string)|googleToken을 받아 로그인 처리하고 커스텀 토큰을 반환한다.|
|GET|'/users'|Jwt(string)|-|-|userInfo(json)|요청을 받으면 토큰인증을 통해 해당 사용자의 유저 정보를 반환한다.|
|GET|'/calendar/next/:nextCount(int)'|Jwt(string)|-|-|events(json)|10일간의 다음 일정 달력정보를 반환한다., days 키 안에 최대, nextCount 는 최대 2500 설정 가능) json 배열 포함|
|POST|'/calendar/certainDay/:year(int)/:month(int)/:day(int)'|Jwt(string)|-|-|events(json)|특정 날짜(year, month, day)의 일정 달력정보를 반환한다., days 키 배열로 이루어져 있음|