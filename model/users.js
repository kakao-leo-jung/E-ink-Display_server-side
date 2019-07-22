var mongoose = require("mongoose");

//schema 1
var userSchema = mongoose.Schema({
  userid:{
    type:String,
    required:[true, "Userid is required"], //에러메시지
    unique:true
  },
  password:{
    type:String,
    required:[true,"Password is required!"],
    select:false //DB에서 값을 읽어올 때 해당 값을 읽어오라고 하는 경우에만 값을 읽어옴

  },
  username:{
    type:String,
    required:[true,"Name is required"],
  },
  email:{
    type:String
  }
});

//DB에 저장되지 않아도 되는 정보들은 virtual로 만들어줌.
