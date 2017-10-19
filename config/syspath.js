const root = require('app-root-path').path;

// export application root and related
module.exports = {
  root,
  build: `${root}/build`,
  config: `${root}/config`,
  public: `${root}/public`,
  src: `${root}/src`,
  logs: `${root}/logs`
};
