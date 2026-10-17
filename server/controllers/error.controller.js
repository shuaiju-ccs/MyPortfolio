function getErrorMessage(err) {
  if (!err) return "Unknown error";
  if (err.code === 11000 || err.code === 11001) {
    const field = Object.keys(err.keyValue || err.keyPattern || {})[0] || "email";
    return `${field} already exists`;
  }
  if (err.errors) {
    return Object.values(err.errors).map((e) => e.message).join(", ");
  }
  return err.message || "Something went wrong";
}
export default { getErrorMessage };