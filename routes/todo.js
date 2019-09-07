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
  Todo.findById(req.params.id, function(err, data) {
    console.log(data);
    res.send(data);
  });
});

router.post('/', function(req, res) {
  const newTodo = new Todo(req.body);
  newTodo.save();
  res.send(req.body);
});

// 차차 구현
router.put('/:id', function(req, res) {});

router.delete('/:id', function(req, res) {});

module.exports = router;
