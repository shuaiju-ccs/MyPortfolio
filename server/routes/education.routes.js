import express from "express";
import educationCtrl from "../controllers/education.controller.js";

const router = express.Router();

router.route("/api/educations")
  .get(educationCtrl.list)
  .post(educationCtrl.create)
  .delete(educationCtrl.removeAll);

router.param("educationId", educationCtrl.educationByID);

router.route("/api/educations/:educationId")
  .get(educationCtrl.read)
  .put(educationCtrl.update)
  .delete(educationCtrl.remove);

export default router;