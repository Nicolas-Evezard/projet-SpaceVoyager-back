// REQUIRE MODULES
const debug = require("debug")("controller");

// REQUIRE DATAMAPPER
const { hostelDatamapper } = require("../model");

const hostelController = {
  /**
   * Method to get all hostels
   * @param {*} req - The request object (unused in this function).
   * @param {*} res - The response object.
   * @param {*} next - The next middleware function.
   * @returns {void}
   * @async
   */
  async getAll(_, res, next) {
    const { error, result } = await hostelDatamapper.getAll();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * Method to get one hostel
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {void}
   * @async
   */
  async getOne(req, res, next) {
    const { id } = req.params;
    const { error, result } = await hostelDatamapper.getOne(id);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = hostelController;
