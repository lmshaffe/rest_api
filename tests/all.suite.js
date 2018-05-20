process.env.NODE_LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'fatal';

const tests = [
  './unit.suite.js',
  './integration.suite.js'
];

tests.map((test) => {
  describe(`Running test suite ${test}`, () => { require(test); });
});
