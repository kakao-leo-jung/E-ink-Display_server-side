/* TODO: Author : 정근화 */

/*

    각 에러에 대한 상태 처리를 여기서 정의한다.

*/
module.exports = {
    NO_JWT: ['Please put JWT in your request header!', 401],
    INVALID_JWT: ['Your JWT is invalid!', 401],
}

exports.createError = (errorSet) => {
    var error = new Error();
    error.message = errorSet[0];
    error.status = errorSet[1];
    return error;
}