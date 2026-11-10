import express from "express";
import educationCtrl from "../controllers/education.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

const adminOnly = [authCtrl.requireSignin, authCtrl.isAdmin];

router.route("/api/educations")
  .get(educationCtrl.list)
  .post(...adminOnly, educationCtrl.create)
  .delete(...adminOnly, educationCtrl.removeAll);

router.param("educationId", educationCtrl.educationByID);

router.route("/api/educations/:educationId")
  .get(educationCtrl.read)
  .put(...adminOnly, educationCtrl.update)
  .delete(...adminOnly, educationCtrl.remove);

export default router;