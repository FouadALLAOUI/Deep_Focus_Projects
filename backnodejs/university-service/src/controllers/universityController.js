const universityService = require('../services/universityService');

const getUniversities = async (req, res, next) => {
  try {
    const { name, country } = req.query;
    const universities = await universityService.searchUniversities({ name, country });
    res.json({ success: true, count: universities.length, data: universities });
  } catch (err) {
    next(err);
  }
};

const getByCountry = async (req, res, next) => {
  try {
    const { country } = req.params;
    const universities = await universityService.searchUniversities({ country });
    res.json({ success: true, count: universities.length, data: universities });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUniversities, getByCountry };
