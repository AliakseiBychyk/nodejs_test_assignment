const env = process.env;

export let nodeEnv = env.NODE_ENV || 'development';

export default {
  mongoDB_uri: env.DB_URI || 'mongodb://localhost:27017/RTLdb',
  port: env.PORT || 8800,
  host: env.HOST || 'localhost',
  get serverUrl() {
    return `http://${this.HOST}:${this.PORT}`;
  },
};
