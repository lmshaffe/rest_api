const { Logger } = require('microservice_core');
const https = require('https');
const axios = require('axios');
const async = require('async');

// retry options - https://caolan.github.io/async/docs.html#retry
const defaultOptions = {
  retryTimes: 5,
  retryInterval: 500,
  retryErrorFilter: (err) => {
    Logger.warn('AxiosRestClient:request: Failure attempt to make a request');
    Logger.warn((err && err.message) ? err.message : Logger.inspect(err));
    return true;
  },
  responseLogging: true,
  rejectUnauthorized: true
};

const requiredAxiosConfig = [
  'url',
  'method'
];

// payload - https://github.com/axios/axios#request-config
class AxiosRestClient {

  async get(url = '', options = {}) {
    let payload = {
      method: 'get',
      url
    };
    return await this.request(payload, options);
  }

  async post(url = '', data = {}, options = {}) {
    let payload = {
      method: 'post',
      data,
      url
    };
    return await this.request(payload, options);
  }

  async request(payload = {}, options = {}) {
    return new Promise((resolve, reject) => {
      Logger.trace('AxiosRestClient:request');

      let opts = Object.assign({}, defaultOptions, options);
      let retryOpts = this.buildRetryOptions(opts);
      let isAxiosConfigValidated = this.validateAxiosConfig(payload);

      if (!isAxiosConfigValidated) {
        reject(new Error('Invalid Axios config'));
        return;
      }

      Logger.api(`Calling URL: \n ${Logger.inspect(payload)}`);
      payload.httpsAgent = new https.Agent({ rejectUnauthorized: options.rejectUnauthorized });
      async.retry(retryOpts, async () => await axios.request(payload) , (err, result) => {
        Logger.trace('AxiosRestClient : request : async retry callback');
        if (err) {
          if (opts.responseLogging) this.logRequestError(err);
          // An error could still respond with a legitimate response.
          if (err.response && err.response.data) resolve(err.response.data);
          // We can't find something to return, so reject.
          else reject(err);
          return;
        }
        if (result) resolve(result.data);
        else resolve(null);
      });
    });
  }

  validateAxiosConfig(payload) {
    let isValidated = true;
    Logger.trace('AxiosRestClient : validateAxiosConfig');
    requiredAxiosConfig.forEach((prop) => {
      if (!payload[prop]) {
        Logger.error(`AxiosRestClient : validateAxiosConfig : ${prop} property missing from axios config`);
        isValidated = false;
      }
    });

    return isValidated;
  }

  buildRetryOptions(options) {
    return {
      times: options.retryTimes,
      interval: options.retryInterval,
      errorFilter: options.retryErrorFilter
    };
  }

  logRequestError(err) {
    Logger.trace('AxiosRestClient : logRequestError');
    if (err.response) {
      Logger.error('AxiosRestClient : Error Response Data:');
      Logger.error(err.response.data);
      Logger.error('AxiosRestClient : Error Response Status:');
      Logger.error(err.response.status);
      Logger.error('AxiosRestClient : Error Response Headers:');
      Logger.error(err.response.headers);
    } else {
      Logger.error('AxiosRestClient : Error dump:');
      Logger.error(Logger.inspect(err));
      Logger.error('AxiosRestClient : Error Message:');
      Logger.error(err.message);
    }
  }

}


class AxiosRestClientSingleton {
  static getInstance() {
    if (!AxiosRestClientSingleton.instance) AxiosRestClientSingleton.instance = new AxiosRestClient();
    return AxiosRestClientSingleton.instance;
  }
}

module.exports = AxiosRestClientSingleton;
