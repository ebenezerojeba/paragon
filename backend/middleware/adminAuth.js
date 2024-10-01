import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const { token } = req.headers;
  try {
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}

export default adminAuth
