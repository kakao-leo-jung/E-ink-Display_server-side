/* TODO: Author : 정근화 */

/*

    에러를 발생 시 LogHandler를 거쳐 ErrorHandler 에서
    처리한다.
    에러를 분기하고 처리.

*/
module.exports = (err, req, res, next) => {

    res.status(err.status || 500);
    res.send(err.message || 'Error Occured');

}