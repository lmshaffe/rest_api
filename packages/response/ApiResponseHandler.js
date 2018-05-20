class ApiResponseHandler {

  static sendStatus(res, httpStatus, detail, title) {
    res.status(httpStatus).send({
      httpStatus,
      status: `${httpStatus}`,
      title,
      detail
    });
  }

  // OK
  static respondWith200(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 200, detail, 'OK');
  }

  // Created
  static respondWith201(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 201, detail, 'The selected resource was created');
  }

  // BadRequest
  static respondWith400(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 400, detail, 'The request was not understood by the server.');
  }

  // Not Found
  static respondWith404(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 404, detail, 'The selected resource could not be found.');
  }

  // Unprocessable Entity - Missing Params
  static respondWith422(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 422, detail, 'One or more required parameters are missing or incorrect.');
  }

  // Internal Server Error
  static respondWith500(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 500, detail, 'An unexpected error has occurred.');
  }

  // Not Implemented
  static respondWith501(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 501, detail, 'Not Implemented');
  }

  // Service Unavailable
  static respondWith503(res, detail = '') {
    ApiResponseHandler.sendStatus(res, 503, detail, 'Service Unavailable');
  }
}

module.exports = ApiResponseHandler;
