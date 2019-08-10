### 개발 가이드

ip          | 169.56.98.117
http port   | 80
인증 DB      | user_auth | collection = "users"

#### 서버 DB 접속
$ mongo
$ db
$ use user_auth
$ show collections
$ db.users.find().pretty()


#### user_auth > user 콜렉션 구조
