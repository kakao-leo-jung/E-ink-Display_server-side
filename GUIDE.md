### 개발 가이드
ip          | 169.56.98.117
http port   | 80
인증 DB      | user_auth | collection = "users"

#### 서버에서 실행 , 재실행
forever 모듈 사용해서 항상 실행 중 상태 유지.
server-side 디렉토리 접근

###### 일시적인 실행 - 로그 확인
$ node ./bin/www

###### 계속 실행
$ forever start ./bin/www

###### 재 실행
$ forever restart ./bin/www

###### forever 실행 중 종료
$ forever stopall

###### 현재 서버가 돌아가고 있는지 확인하는 방법
인터넷 브라우저에 들어가서 169.56.98.117 친다.
MagicCalendar API 페이지가 뜨면 서버가 돌아가고 있는 것.

#### 서버 DB 접속
/* db 접속 */
$ mongo
/* 현재 db 확인 */
$ > db
/* 전체 db 확인 */
$ > show dbs
/* 현재 db 전환 */
$ > use user_auth
/* 현재 db 의 콜렉션 확인 */
$ > show collections
/* 현재 db 의 콜렉션의 하위 Document 확인 */
$ > db.users.find().pretty()

#### user_auth > user 콜렉션 구조