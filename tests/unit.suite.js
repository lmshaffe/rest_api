process.env.NODE_LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'fatal';

const tests = [
  './unit/packages/response/ApiResponseHandler.test.js',
];

tests.map((test) => {
  describe(`Running test suite ${test}`, () => { require(test); });
});
