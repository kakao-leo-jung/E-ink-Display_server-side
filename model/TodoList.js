var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* TODO Author : 김수빈 */
/*
    스키마 구조
    todoId(string)
    userId(string)          : 유저 토큰 아이디 숫자 값(token 의 sub 값)
    email(string)           : 유저 이메일
    name(string)            : 유저 풀 네임
    title(string)           : ToDo Title
    selected(Boolean)          : Todo 선택
*/

var todoScheme = new Schema({
  todoId: String,
  userId: String,
  email: String,
  name: String,
  title: String,
  selected: Boolean,
});

module.exports = mongoose.model('todo', todoScheme);
