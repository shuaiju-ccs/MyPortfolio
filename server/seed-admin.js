// Assignment 3: creates the hardcoded admin account when the server starts.
import User from "./models/user.model.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@portfolio.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

export default async function seedAdmin() {
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    console.log(`Admin account ready: ${ADMIN_EMAIL}`);
    return;
  }

  await new User({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin"
  }).save();
  console.log(`Admin account created: ${ADMIN_EMAIL}`);
}