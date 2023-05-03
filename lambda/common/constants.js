const API_VERSIONS = {
  // api version declarations
  API_VERSION_BASE_NO_ACCEPT_HEADER: '*/*', // value when no accept header is passed
  API_VERSION_BASE: 'application/json', // base api version used before versioning impl
  API_VERSION_0_1: 'application/x.spirit.v0.1+json',
  API_VERSION_0_2: 'application/x.spirit.v0.2+json',
  API_VERSION_0_3: 'application/x.spirit.v0.3+json',
  API_VERSION_LATEST: 'application/x.spirit+json'
};

module.exports = {
  API_VERSIONS
};
