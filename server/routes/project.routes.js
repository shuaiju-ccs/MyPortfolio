import express from "express";
import projectCtrl from "../controllers/project.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Assignment 3: anyone can view; only the admin can add, edit or delete.
const adminOnly = [authCtrl.requireSignin, authCtrl.isAdmin];

router.route("/api/projects")
  .get(projectCtrl.list)
  .post(...adminOnly, projectCtrl.create)
  .delete(...adminOnly, projectCtrl.removeAll);

router.param("projectId", projectCtrl.projectByID);

router.route("/api/projects/:projectId")
  .get(projectCtrl.read)
  .put(...adminOnly, projectCtrl.update)
  .delete(...adminOnly, projectCtrl.remove);

export default router;