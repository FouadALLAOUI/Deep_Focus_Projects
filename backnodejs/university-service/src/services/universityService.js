const axios = require('axios');

const BASE_URL = 'http://universities.hipolabs.com';

const searchUniversities = async ({ name = '', country = '' } = {}) => {
  const params = {};
  if (name) params.name = name;
  if (country) params.country = country;

  const { data } = await axios.get(`${BASE_URL}/search`, { params, timeout: 10000 });
  return data;
};

module.exports = { searchUniversities };
