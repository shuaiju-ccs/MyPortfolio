import Project from "../models/project.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {            // POST /api/projects
  try {
    const project = await new Project(req.body).save();
    return res.status(201).json(project);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (req, res) => {              // GET /api/projects
  try {
    return res.json(await Project.find());
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const projectByID = async (req, res, next, id) => {   // runs when a URL has :projectId
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    req.profile = project;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve project" });
  }
};

const read = (req, res) => res.json(req.profile);      // GET /api/projects/:projectId

const update = async (req, res) => {                   // PUT /api/projects/:projectId
  try {
    const project = extend(req.profile, req.body);
    await project.save();
    return res.json(project);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {                   // DELETE /api/projects/:projectId
  try {
    const deleted = req.profile;
    await deleted.deleteOne();
    return res.json(deleted);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => {                // DELETE /api/projects
  try {
    const result = await Project.deleteMany({});
    return res.json({ message: `Removed ${result.deletedCount} projects` });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, projectByID, read, update, remove, removeAll };