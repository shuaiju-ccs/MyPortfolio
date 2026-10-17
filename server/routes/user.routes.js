import express from "express";
import userCtrl from "../controllers/user.controller.js";

const router = express.Router();

router.route("/api/users")
  .get(userCtrl.list)
  .post(userCtrl.create)
  .delete(userCtrl.removeAll);

router.param("userId", userCtrl.userByID);

router.route("/api/users/:userId")
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove);

export default router;