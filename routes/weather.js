var express = require('express');
var router = express.Router();
var config = require('../config');
var request_promise = require('request-promise');
var authentication = require('../auth/authentication');

/* TODO: Author : 정근화 */

/*

    본 모듈은 /weather 로 들어온다.

    OpenWeatherMap API 를 호출하여 날씨 정보를 대신 호출하고 반환한다.

    안드로이드 어플리케이션에서 위도와 경도 값, 그리고 jwt를 통해 인증 절차를 거쳐야 한다.
    jwt 인증을 거치는 이유는 OpenWeatherMap free티어(분당 60회))를 사용하고 있는데
    오픈소스로 공개할 경우 jwt 인증 없이 외부에서 무분별하게 호출이 가능하기 때문.

*/

const API_URI = config.OPENWEATHERMAP_API_URI;
const API_KEY = config.OPENWEATHERMAP_API_KEY;

router.get('/:latitude/:longitude', (req, res) => {

    /* jwt 인증 - decoding 실패 시 res 403 반환 */
    authentication.verifyJwt(req, res);

    /* 위도, 경도 parameter 추출 */
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;

    console.log("latitude / longitude : " + latitude + " / " + longitude);

    /* weathermap 호출 */
    var reqOption = {
        uri: API_URI,
        qs: {
            appid : API_KEY,
            lat : latitude,
            lon : longitude
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    request_promise.get(reqOption).then(responseData => {
        /* weather 수신 성공 */
        console.log(responseData);

        var resObj = {
            "city" : responseData.name,
            "weather" : responseData.weather[0].main,
            "weather_description" : responseData.weather[0].description,
            "temperature" : responseData.main.temp,
            "temperature_max" : responseData.main.temp_max,
            "temperature_min" : responseData.main.temp_min,
            "pressure" : responseData.main.pressure,
            "humidity" : responseData.main.humidity,
            "wind_speed" : responseData.wind.speed,
            "clouds" : responseData.clouds.all
        };

        res.json(resObj);

    }).catch(err => {
        /* weather 수신 실패 */
        console.log("OpenWeatherMap GET Failed : " + err);
        res.set(500);
        res.end("openweathermap GET failed");
    });


});

module.exports = router;