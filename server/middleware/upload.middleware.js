const { upload } = require("../config/cloudinary");

const uploadMiddleware = (req, res, next) => {
  // Captured before multer replaces req.body on multipart requests
  const authUser = req.body?.user;
  const userId = typeof authUser === "object" ? authUser?.userId : undefined;

  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "File upload failed", details: err });
    }

    // On multipart uploads multer turns the `user` JSON field into a string;
    // on plain JSON requests it stays an object (from the auth middleware)
    if (typeof req.body.user === "string") {
      try {
        req.body.user = JSON.parse(req.body.user);
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid JSON format in 'user'" });
      }
    }

    if (typeof req.body.user !== "object" || req.body.user === null) {
      req.body.user = userId ? { userId } : {};
    }

    if (userId) {
      req.body.userId = userId;
    }

    next(); // Proceed to `updateUserDetails`
  });
};

module.exports = { uploadMiddleware };
