import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const clean = (user) => {
  user.hashed_password = undefined;
  user.salt = undefined;
  return user;
};

const create = async (req, res) => { 
  try {
    const user = await new User(req.body).save();
    return res.status(201).json(clean(user));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    return res.json(await User.find().select("name email updated created"));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

const read = (req, res) => res.json(clean(req.profile)); 

const update = async (req, res) => {
  try {
    const user = extend(req.profile, req.body);
    user.updated = Date.now();
    await user.save();
    return res.json(clean(user));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = req.profile;
    await deleted.deleteOne();
    return res.json(clean(deleted));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => { 
  try {
    const result = await User.deleteMany({});
    return res.json({ message: `Removed ${result.deletedCount} users` });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, userByID, read, update, remove, removeAll };