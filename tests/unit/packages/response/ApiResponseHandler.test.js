const { Logger } = require('microservice_core');
const ApiResponseHandler = require('../../../../packages/response/ApiResponseHandler');
var httpMocks = require('node-mocks-http');

// const sinon = require('sinon');
const chai  = require('chai');
const expect = chai.expect;
chai.use(require('chai-things'));

describe(`${__filename}`, () => {
  it('should send return a properly formatted 200 response', (done) => {
    let res = httpMocks.createResponse();
    ApiResponseHandler.respondWith200(res);
    expect(res._getData()).to.be.deep.equal({ httpStatus: 200, status: '200', title: 'OK', detail: '' });
    done();
  });
  it('should send return a properly formatted 200 response with detail', (done) => {
    let res = httpMocks.createResponse();
    let detail = 'Some detail message';
    ApiResponseHandler.respondWith200(res, detail);
    expect(res._getData()).to.be.deep.equal({ httpStatus: 200, status: '200', title: 'OK', detail });
    done();
  });

  it('should send return a properly formatted 201 response', (done) => {
    let res = httpMocks.createResponse();
    ApiResponseHandler.respondWith201(res);
    expect(res._getData()).to.be.deep.equal({ httpStatus: 201, status: '201', title: 'The selected resource was created', detail: '' });
    done();
  });
  it('should send return a properly formatted 201 response with detail', (done) => {
    let res = httpMocks.createResponse();
    let detail = 'Some detail message';
    ApiResponseHandler.respondWith201(res, detail);
    expect(res._getData()).to.be.deep.equal({ httpStatus: 201, status: '201', title: 'The selected resource was created', detail });
    done();
  });

});
