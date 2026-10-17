import Education from "../models/education.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {            // POST /api/educations
  try {
    const education = await new Education(req.body).save();
    return res.status(201).json(education);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (req, res) => {              // GET /api/educations
  try {
    return res.json(await Education.find());
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const educationByID = async (req, res, next, id) => {   // runs when a URL has :educationId
  try {
    const education = await Education.findById(id);
    if (!education) return res.status(404).json({ error: "Education not found" });
    req.profile = education;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve education" });
  }
};

const read = (req, res) => res.json(req.profile);      // GET /api/educations/:educationId

const update = async (req, res) => {                   // PUT /api/educations/:educationId
  try {
    const education = extend(req.profile, req.body);
    await education.save();
    return res.json(education);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {                   // DELETE /api/educations/:educationId
  try {
    const deleted = req.profile;
    await deleted.deleteOne();
    return res.json(deleted);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => {                // DELETE /api/educations
  try {
    const result = await Education.deleteMany({});
    return res.json({ message: `Removed ${result.deletedCount} educations` });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, educationByID, read, update, remove, removeAll };