var express = require('express');
var router = express.Router();
var headline = require('headline-news-naver');

/* TODO Author : 정근화 */

/*

    본 모듈은 /news 로 들어온다.

    headline-news-naver 모듈을 활용하여
    네이버 뉴스의 헤드라인뉴스 5개를 추출 및 반환한다.

    MODULE INFO : https://github.com/dfjung4254/headline-news-naver

*/

router.get('/', function(req, res){

    getNews(res);

});

async function getNews(response){

    var newsObj = await headline.getNaverNews();
    console.log("getNewsInfo : " + JSON.stringify(newsObj));
    response.json(newsObj);

}

module.exports = router;