import express from "express";
import contactCtrl from "../controllers/contact.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

const adminOnly = [authCtrl.requireSignin, authCtrl.isAdmin];

router.route("/api/contacts")
  .get(authCtrl.requireSignin, contactCtrl.list)
  .post(contactCtrl.create)
  .delete(...adminOnly, contactCtrl.removeAll);

router.param("contactId", contactCtrl.contactByID);

router.route("/api/contacts/:contactId")
  .get(authCtrl.requireSignin, contactCtrl.read)
  .put(...adminOnly, contactCtrl.update)
  .delete(...adminOnly, contactCtrl.remove);

export default router;