var express = require('express');
var Todo = require('../model/TodoList');
var router = express.Router();

/** JSON Structure
 * {
 *   todoId : String,
 *   userId : string,
 *   email : string
 *   userName : String,
 *   title : String,
 *   selected : Boolean
 * }
 */

/** Get List of Todo */
router.get('/', function(req, res) {
  // MongoDB 조회
  Todo.find(function(err, data) {
    console.log(data);
    res.send(data);
  });
});

/** Get Todo
 * id : todoId
 */
router.get('/:id', function(req, res) {
  // MongoDB ID로 조회
  Todo.find(req.params.id, function(err, data) {
    console.log(data);
    res.json({result:data});
  });
});


/*
 todo 생성
 userId : string,
 *   email : string
 *   userName : String,
 *   title : String,
 *   selected : Boolean
*/
router.post('/', function(req, res) {
  const newTodo = new Todo(req.body);
  newTodo.save(function(err){
    if(err){
      console.error(err);
      res.json({result: 0});
      return;
    }

    res.json({result:1});

  });

});
/*
  데이터 저장에 성공하면 result:1을, 실패하면 result:0을 반환한다.

*/

/*
  todo title로 검색
  userName과 title만 출력.

*/
router.get('/:title', function(req,res){
  Todo.find({title: req.params.title},{_id:0,userId:0,userName:1,title:1,selected:0}, function(err,data){
    if(err) return res.status(500).json({error: err});
    if(data.length==0) return res.status(404).json({error:'todo not found'})
    res.json(data);
  })
})


/*
  todo 수정
*/
router.put('/:id', function(req,res){
  Todo.findById(req.params.id, function(err, todo){
    if(err) return res.status(500).json({ error: 'database failure '});
    if(!data) return res.status(404).json({ error : 'todo not found'});

    if(req.body.title) todo.title = req.body.title;
    todo.save(function(err){
      if(err) res.status(500).json({error: 'failed to update'});
      res.json({message : 'todo updated'});
    })

  })

});

router.delete('/:id', function(req, res) {,
  Todo.remove({_id:req.params.id}, function(err,output){
    if(err) return res.status(500).json({error: 'database failure'});

    res.status(204).end();
  })
});

module.exports = router;
