var express = require('express');
var router = express.Router();
var headline = require('headline-news-naver');

/* TODO: Author : 정근화 */

/*

    본 모듈은 /news 로 들어온다.

    headline-news-naver 모듈을 활용하여
    네이버 뉴스의 헤드라인뉴스 5개를 추출 및 반환한다.

    MODULE INFO : https://github.com/dfjung4254/headline-news-naver

*/

/*

    TODO: 
    요청이 들어왔을 때 크롤링 하고 리턴하는 방식은
    지연율이 높음. 서버에서 주기적(예, 1분마다)으로
    headline-news-naver 를 실행시켜 파일을 가지고 있다가
    요청 시 바로 해당 파일을 리턴하는 방식으로 구현해 볼 것.

*/

router.get('/', (req, res) => {

    getNews(res);

});

async function getNews(response){

    var newsObj = await headline.getNaverNews();

    /* LOG */
    newsObj.news_array.forEach(thisNews => {
        console.log("server returned news : " + thisNews.title);
    });

    response.json(newsObj);

}

module.exports = router;