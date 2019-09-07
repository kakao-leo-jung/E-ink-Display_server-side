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


//virtuals - db에는 저장되지 않는 새 가상필드를 만듦 굳이 db에 저장할 필요 없는 정보들
userSchema.virtual('passwordConfirmation')
.get(function(){return this._passwordConfirmation;})
.set(function(value){this._passwordConfirmation=value;});

userSchema.virtual('originalPassword')
.get(function(){return this._originalPassword;})
.set(function(value){this._originalPassword=value;});

userSchema.virtual('newPassword')
.get(function(){return this._newPssword;})
.set(function(value){this._newPassword=value;});

//password validation

userSchema.path('password').validate(function(v){
  //virtual은 직접 validation이 안되므로 password에서 값을 확인하도록 custom validation 함수를 지정
  var user = this;

  //create user
  if(user.isNew){ //true이면 새로 생긴 model
    if(!user.passwordConfirmation){
       //password confirmation값이 없는 경우, password와 password confirmation값이 다른 경우에 유효하지 않음처리(invalidate)를 하게됨
       //model.invalidate 첫번째로는 인자로 항목이름, 두번째 인자로 에러메세지를 받음
       user.invalidate("passwordConfirmation","Password Confirmation is required!");
    }
    if(user.password !== user.passwordConfirmation){
      user.invalidate("passwordConfirmation","Password Confirmation does not matched!");
    }
  }

  //update user
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate("currentPassword","Current Password is required!");
    }
    if(user.currentPassword && user.currentPassword != user.originalPassword){
      user.invalidate("currentPassword","Current Password is invalid!");
    }
    if(user.newPassword !== user.passwordConfirmation){
      user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
    }
  }
});

//hash password
userSchema.pre('save',function(next){
  //save 하기 전에 수행해야 될 함수
  var user = this;
  if(!user.isModified('password')){
    //isModified 함수는 해당값이 db에 기록된 값과 비교해서 변경된 경우 true
    return next();
  } else{
    //user를 생성하거나 user 수정시 user.password의 변경이 있는 경우에는 hasySync 함수로 password를 hash값으로 바꿈
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
})

//model Methods
userSchema.methods.authenticate = function(password){
 //user model의 password hash와 입력받은 pasword text를 비교하는 method를 추가
  var user = this;
  return bcrypt.compareSync(password,user.password);
};


//model & export
module.exports = mongoose.model("user",userSchema);
