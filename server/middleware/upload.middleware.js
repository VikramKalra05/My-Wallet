const { upload } = require("../config/cloudinary");

const uploadMiddleware = (req, res, next) => {
//   console.log("before", req.body.user);
  // Multer handles file first
  const userId = req.body.user.userId;
  console.log("before", req.body.user);
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "File upload failed", details: err });
    }

    // Ensure JSON body is parsed (Multer ignores JSON fields)
    if (req.body.user) {
      try {
        req.body.user = JSON.parse(req.body.user); // Convert JSON string to object
    } catch (parseError) {
        return res.status(400).json({ error: "Invalid JSON format in 'user'" });
    }
}

req.body.userId = userId;
console.log("after",req.body.userId)

    next(); // Proceed to `updateUserDetails`
  });
};

module.exports = { uploadMiddleware };
