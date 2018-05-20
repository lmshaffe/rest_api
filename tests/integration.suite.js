process.env.NODE_LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'fatal';

const tests = [
  '',
];

tests.map((test) => {
  describe(`Running test suite ${test}`, () => { require(test); });
});
