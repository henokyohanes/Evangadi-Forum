const dbconnection = require("../db/config");
const upload = require("../profileImages/imageUploader");

const profileImage = (req, res) => {

  // Multer config for file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileImage = `/images/${req.file.filename}`;
    const { userid } = req.user;

    // query to update profile image
    const query = `UPDATE users SET profileimg = ? WHERE userid = ?`;

    try {
      // update profile image
      await dbconnection.query(query, [profileImage, userid]);
      return res
        .status(200)
        .json({ message: "Image uploaded successfully", profileImage });
    } catch (error) {
      return res.status(500).json({ message: "Database error", error });
    }
  });
};

module.exports = { profileImage };