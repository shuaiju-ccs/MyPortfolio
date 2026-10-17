import Contact from "../models/contact.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {            // POST /api/contacts
  try {
    const contact = await new Contact(req.body).save();
    return res.status(201).json(contact);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (req, res) => {              // GET /api/contacts
  try {
    return res.json(await Contact.find());
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const contactByID = async (req, res, next, id) => {   // runs when a URL has :contactId
  try {
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    req.profile = contact;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve contact" });
  }
};

const read = (req, res) => res.json(req.profile);      // GET /api/contacts/:contactId

const update = async (req, res) => {                   // PUT /api/contacts/:contactId
  try {
    const contact = extend(req.profile, req.body);
    await contact.save();
    return res.json(contact);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const remove = async (req, res) => {                   // DELETE /api/contacts/:contactId
  try {
    const deleted = req.profile;
    await deleted.deleteOne();
    return res.json(deleted);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeAll = async (req, res) => {                // DELETE /api/contacts
  try {
    const result = await Contact.deleteMany({});
    return res.json({ message: `Removed ${result.deletedCount} contacts` });
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default { create, list, contactByID, read, update, remove, removeAll };