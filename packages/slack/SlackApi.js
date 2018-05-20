'use strict';
const { Logger, Config } = require('microservice_core');
const { URL } = require('url');
const AxiosRequestHandler = require('../axios/AxiosRestClient');

class SlackApi {

  constructor(config = {}) {
    this.config = config;
  }

  notify(message, options = {}) {
    this.validateEnvVars();
    let enabled = this.config.SLACK_ENABLED || Config.env.SLACK_ENABLED || process.env.SLACK_ENABLED || false;
    enabled = (enabled === 'true') ? true : false;
    if (!enabled) return;
    let payload = this.generatePayload(message, options);
    return AxiosRequestHandler.getInstance().request(payload);
  }

  generatePayload(message, options) {
    let time = new Date().toUTCString();
    let env      = this.config.SLACK_ENV    || Config.env.SLACK_ENV    || process.env.SLACK_ENV    || 'undefined__SLACK_ENV';
    let hostname = this.config.HOSTNAME     || Config.env.HOSTNAME     || process.env.HOSTNAME     || 'undefined__HOSTNAME';
    let domain   = this.config.SLACK_DOMAIN || Config.env.SLACK_DOMAIN || process.env.SLACK_DOMAIN || null;
    if (!domain) throw new Error('Slack Notifier domain undefined. Please specify SLACK_DOMAIN in the env configs.');
    let url = new URL(domain);
    let text = `${time}: ${env}: ${hostname}: ${message}`;
    let timeout = options.timeout || 10000;
    return {
      url: url.href,
      method: 'post',
      timeout,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        text
      }
    };
  }

  validateEnvVars() {
    if (!Config.isLoaded)           Logger.warn('Config.load has not been called. Please load Config.');
    if (!process.env.SLACK_ENABLED) Logger.warn('Could not find env var: SLACK_ENABLED');
    if (!process.env.SLACK_ENV)     Logger.warn('Could not find env var: SLACK_ENV');
    if (!process.env.HOSTNAME)      Logger.warn('Could not find env var: HOSTNAME');
    if (!process.env.SLACK_DOMAIN)  Logger.warn('Could not find env var: SLACK_DOMAIN');
  }

  static create(config) {
    return new SlackApi(config);
  }
}

module.exports = SlackApi;
