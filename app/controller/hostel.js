const { hostelDatamapper } = require("../model");
const debug = require("debug")("controller");

const hostelController = {
  
  /**
   * Method to get all hostels
   * @param {*} res
   * @param {*} next
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
