import jwt from 'jsonwebtoken';
const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Sign Up or Login to Proceed' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    } else {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

export default authUser;