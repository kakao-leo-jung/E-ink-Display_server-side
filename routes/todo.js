var express = require('express');
var Todo = require('../model/todolist');
var authentication = require('../auth/authentication');
var router = express.Router();

/** JSON Structure
 * {
 *   todoId : String, => 굳이 필요없이 save() 하게 되면 자동을 _id 변수에 어떠한 고유값이 저장됩니다.
 *   userId : string, => 안드로이드에서 보내준 커스텀 JWT 를 파싱하면 얻을 수 있는 id값입니다. 이걸로 해당 todo의 주인을 판별합니다.
 *   email : string  => 필요없는 것 같아 삭제했습니다..
 *   userName : String, => 필요없는 것 같아 삭제했습니다..
 *   title : String,  => 타이틀, Todo 의 내용이 들어가야 하는 곳.
 *   selected : Boolean => Todo 가 완료되었는지 여부.
 * }
 */

/*

  FIXME: Todo 구현에 관해.
  todolist.js 스키마에 의해 user_auth db의 todos Collection에 Todo 들이 저장이 되면 됩니다.
  
  userId 변수는 구글에서 받아와 users Collection 에 저장한 유저정보의 id 숫자값이 들어가야 합니다.
  그리고 userId 를 알 수 있는 것은 JWT를 파싱하여 얻은 decoded 값에 userId 값이 들어가있습니다.
  [자세한 것은 authentication.js 의 veryfyJWT 함수를 참고.]

  오직 안드로이드가 누구의 요청인지 인증하는 방식은 헤더에 실린 JWT로 하므로 다른 id 나 title값은 없어도 무방할겁니다.
  안드로이드쪽 요청사항이 정확하지 않은데 영보님과 하영님이 만들고 계신 어플 구조를 보고, Issue 에 업로드한 안드로이드_요구사항.txt
  를 참고하면 좋습니다.
 [단, userid 말씀하시는 거는 하영님이 잘못이해하셨는데 url에 싫는게 아니라 header 값에 싣는 jwt 를 말합니다.
  안드로이드_요구사항.txt 의 userid는 무시하고진행 ]

*/
/* FIXME: post 예시 구현 */
router.post('/', function (req, res) {

  /* 보낸 주체가 누구인지 구분하기 위해서는 무조건 JWT 디코딩부터 해야합니다. */
  var decoded = authentication.verifyJwt(req, res);

  /*

      body 는 userId 빼고
      title : String
      selected : Boolean
      값만 받음.

      userId 값은 decoded 에서 userId 값 채워야함.

  */
  var newTodo = new Todo({
    userId: decoded.userId,
    title: req.body.title,
    selected: req.body.selected
  });

  newTodo.save((err) => {
    if (err) {
      console.log("Todo DB Save Err : " + err);
      res.set(400);
      res.end();
    }
    res.set(201);
    res.end("todo save success");
  });

});

/* FIXME: get 예시 구현 */
router.get('/', function (req, res) {

  var decoded = authentication.verifyJwt(req, res);
  Todo.find({
    userId: decoded.userId
  }, function (err, todoLists) {
    if (err) {
      console.log("Todo DB Save Err : " + err);
      res.set(400);
      res.end();
    }
    var retObj = new Object();
    retObj.todoLists = new Array();
    for(var todo of todoLists){
      var todoObj = {
        "_id" : todo._id,
        "title" : todo.title,
        "selected" : todo.selected
      };
      retObj.todoLists.push(todoObj);
    }
    res.json(retObj);
  });

});

/* FIXME: put 예시 구현 */
/* _id 값은 해당 todo 모델의 고유 값 */
router.put('/:_id', function (req, res) {

  var decoded = authentication.verifyJwt(req, res);

  /* userId, _id, __v 값은 수정 불가능 req.body 에 있으면 안됨 */
  if (req.body.hasOwnProperty('userId') || req.body.hasOwnProperty('_id')) {
    res.set(400);
    res.end("invalid body property is included! : userId or _id");
    return;
  }

  /* 

      _id 특정 글의 objectId 값과 해당 글의 userId 값이 요청한 측의 userId 값과 일치해야함.
      그렇지 않을 경우 다른 계정의 _id 값을 알기만 하면 남의 글도 지울 수가 있음.
      내가 올린 글만 수정할 수 있어야 함

  */
  Todo.findOneAndUpdate({
    _id: req.params._id,
    userId: decoded.userId
  }, req.body, function (err, document) {
    if (err) {
      console.log("Todo DB Save Err : " + err);
      res.set(500);
      res.end();
    }
    res.set(200);
    res.end("todo update success!");
  });

});

/* FIXME: delete 예시 구현 */
router.delete('/:_id', function (req, res) {

  var decoded = authentication.verifyJwt(req, res);

  /* PUT 과 마찬가지, userId 값이 동일한 사람인지 확인 */
  Todo.findOneAndDelete({ _id : req.params._id, userId : decoded.userId},function(err, document){
    if(err){
      console.log("Todo DB Save Err : " + err);
      res.set(500);
      res.end();
    }
    res.set(200);
    res.end("todo delete success!");
  });

});


/** Get List of Todo */
// router.get('/', function (req, res) {
//   // MongoDB 조회
//   Todo.find(function (err, data) {
//     console.log(data);
//     res.send(data);
//   });
// });

// /** Get Todo
//  * id : todoId
//  */
// router.get('/:id', function (req, res) {
//   // MongoDB ID로 조회
//   Todo.find(req.params.id, function (err, data) {
//     console.log(data);
//     res.json({
//       result: data
//     });
//   });
// });


// /*
//  todo 생성
//  userId : string,
//  *   email : string
//  *   userName : String,
//  *   title : String,
//  *   selected : Boolean
// */
// router.post('/', function (req, res) {
//   const newTodo = new Todo(req.body);
//   newTodo.save(function (err) {
//     if (err) {
//       console.error(err);
//       res.json({
//         result: 0
//       });
//       return;
//     }

//     res.json({
//       result: 1
//     });

//   });

// });
// /*
//   데이터 저장에 성공하면 result:1을, 실패하면 result:0을 반환한다.

// */

// /*
//   todo title로 검색
//   userName과 title만 출력.

// */
// router.get('/:title', function (req, res) {
//   Todo.find({
//     title: req.params.title
//   }, {
//     _id: 0,
//     userId: 0,
//     userName: 1,
//     title: 1,
//     selected: 0
//   }, function (err, data) {
//     if (err) return res.status(500).json({
//       error: err
//     });
//     if (data.length == 0) return res.status(404).json({
//       error: 'todo not found'
//     })
//     res.json(data);
//   })
// })


// /*
//   todo 수정
// */
// router.put('/:id', function (req, res) {
//   Todo.findById(req.params.id, function (err, todo) {
//     if (err) return res.status(500).json({
//       error: 'database failure '
//     });
//     if (!data) return res.status(404).json({
//       error: 'todo not found'
//     });

//     if (req.body.title) todo.title = req.body.title;
//     todo.save(function (err) {
//       if (err) res.status(500).json({
//         error: 'failed to update'
//       });
//       res.json({
//         message: 'todo updated'
//       });
//     })

//   })

// });

// router.delete('/:id', function (req, res) {

//   Todo.remove({
//     _id: req.params.id
//   }, function (err, output) {
//     if (err) return res.status(500).json({
//       error: 'database failure'
//     });

//     res.status(204).end();
//   })
// });

module.exports = router;