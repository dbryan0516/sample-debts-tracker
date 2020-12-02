const request = require("request-promise");


// helper function for simple GET requests
async function apiGet(uri) {
  let options = {method: 'GET',
    uri: uri,
    requestHeaders: {"Content-Type":"application/json"}};

  return await request(options).then((response) => {
    return JSON.parse(response);
  }).catch((error) => {
    // log error if api call fails
    console.log(error);
  });
}

module.exports = {
  apiGet
};
