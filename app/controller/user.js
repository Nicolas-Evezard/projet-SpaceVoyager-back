const { userDatamapper } = require("../model");
const bcrypt = require("bcrypt");
const debug = require("debug")("controller");
const jwt = require("jsonwebtoken");
const APIError = require("../service/APIError");
const saltRounds = 10;

const userController = {
  /**
   * Method to create a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async register(req, res, next) {
    try {
      const { password, ...userData } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const { error, result } = await userDatamapper.addOne({
        ...userData,
        password: hashedPassword,
      });
      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Method to get a user by his id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOne(req, res, next) {
    if (req.user.id == req.params.id) {
      const { error, result } = await userDatamapper.getOne(req.params.id);
      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Acces denied", 404);
      next(err);
    }
  },

  /**
   * Method to modify a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async modifyOne(req, res, next) {
    const user = req.body;
    if (req.user.id == req.params.id) {
      const { error, result } = await userDatamapper.modifyOne(user);

      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Acces denied", 404);
      next(err);
    }
  },

  /**
   * Method to delete a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOne(req, res, next) {
    if (req.user.id == req.params.id) {
      const { error, result } = await userDatamapper.deleteOne(req.params.id);
      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Acces denied", 404);
      next(err);
    }
  },

  /**
   * Method to login
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async login(req, res, next) {
    const { error, result } = await userDatamapper.checkUser(req.body);

    if (error) {
      next(error);
    } else {
      if (result) {
        const match = await bcrypt.compare(req.body.password, result.password);
        if (match) {
          delete result.password;
          delete result.role;
          delete result.mail;
          const token = jwt.sign(
            {
              user: result,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "2 hours",
            }
          );
          res.json({
            logged: true,
            id: result.id,
            token: token,
          });
        } else {
          const err = new APIError("Mot de passe ou mail incorrect", 400);
          next(err);
        }
      } else {
        const err = new APIError("Mot de passe ou mail incorrect", 400);
        next(err);
      }
    }
  },
};

module.exports = userController;
