const express = require('express');
const app = express();
var router = express.Router();
var bodyParer = require('body-parser');
var mongoose = require('mongoose');

//Database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_LOGIN_API, {useMongoClient: true});
var db = mongoose.connection;
db.once('open', function () {
   console.log('DB connected!');
});
db.on('error', function (err) {
  console.log('DB ERROR:', err);
});


//Middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true
}));
app.use(function (req, res, next) {  //HTTP 접근제어
  res.header('Access-Control-Allow-Origin', '*'); //모든 url 요청 허용.
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); //요청이 허용되는 HTTP verb 목록
  res.header('Access-Control-Allow-Headers', 'content-type, access-token');
   //요청이 허용되는 HTTP header 목록. 여기에 포함되지 않는 HTTP header는 사용할 수 없음
  next();
});


//API
app.use('/api/users', require('./api/users')); //user db 모델링
app.use('/api/auth',require('.api/auth')); //jwt 토큰화

//안드로이드에서 구글에 로그인하며 받은 구글토큰
//access_token, token_type, expires_in, id_token  서버는 access_token을 저장해두고 있다가 구글 정보에 접근이 필요할 때 사용하면 된다
app.post('/loginToken',function(req,res){
  var googleToken = "";

  //데이터를 가져옴
  req.on('data',function(data){
    googleToken += data;
  });

  //더 이상 데이터가 들어오지 않는다면 end 이벤트 실행
  req.on('end',function(){
    console.log("token : "+googleAccessToken);
    res.writeHead(200);
  });

  res.write("OK"); //OK라는 내용이 안드로이드의 ReadBuffer를 통해 result String으로 바뀜
  res.end();
});






app.listen(80, () => {
  console.log('Example app listening on port 80!');
});
