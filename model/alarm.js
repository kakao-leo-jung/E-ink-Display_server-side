var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* TODO: Author : 정근화 */
/*
    스키마 구조
    userId(string)          : 유저 토큰 아이디 숫자 값(token 의 sub 값)
    title(string)           : 알람 제목
    time(Date)              : 알람 시간
    days(number)            : 요일
    day_selected(boolean[]) : 요일 선택여부

*/
var alarmScheme = new Schema({

    userId: String,
    title: String,
    time: Date,
    days: Number,
    day_selected: [Boolean],

});

module.exports = mongoose.model('alarm', alarmScheme);