/* TODO: Author : 정근화 */

/*

    각 에러에 대한 상태 처리를 여기서 정의한다.

*/
exports.es = {
    /* Authentication */
    NO_JWT: ['NO_JWT','Please put JWT in your request header!', 401],
    INVALID_JWT: ['INVALID_JWT','Your JWT is invalid!', 401],
    NOUSER_DB: ['NOUSER_DB','Cannot find userId in database!', 500],

    /* /weather */
    NO_LONANDLAT: ['NO_LONANDLAT','Please put latitude and longitude in your request parameter!', 400],
    FAILED_OWM : ['FAILED_OWM','Failed to GET openweathermap!', 500],

    /* /todo */
    INAVLID_TODOBODY: ['INVALID_TODOBODY','Invalid request body, please put [title] and [selected] in your request body!', 400],
    ERR_CRUDDB : ['ERR_CRUDDB','Cannot CRUD your Todo in database!', 500],
    INVALID_TODOBODYKEY: ['INVALID_TODOBODYKEY','Invalid body property is included! : userId', 400],


}

/* es 포맷에 맞게 에러를 생성함 */
exports.createError = (errorSet) => {
    var error = new Error();
    error.name = errorSet[0];
    error.message = errorSet[1];
    error.status = errorSet[2];
    return error;
}
