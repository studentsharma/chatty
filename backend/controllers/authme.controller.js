import jwt from "jsonwebtoken"

const authme = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ user: null });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.username);
    res.json({ username: decoded.username });
  } catch (err) {
    res.status(401).json({ username: null });
  }
};

export default authme
