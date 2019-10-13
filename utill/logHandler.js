/* TODO: Author : 정근화 */

/*

    에러를 발생 시 LogHandler를 거쳐 ErrorHandler 에서
    처리한다.
    에러를 분기하고 처리.

    여기서는 로그처리하고 ErrorHandler 로 보냄

*/
module.exports = (err, req, res, next) => {

    console.error('[' + new Date() + ']' + err.stack);
    next(err);

}