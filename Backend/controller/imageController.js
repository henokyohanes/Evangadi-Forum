const dbconnection = require("../db/config");
const upload = require("../ProfileImages/imageUploader");
const path = require("path");
const fs = require("fs");

// Function to handle profile image upload
const profileImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Maximum allowed size is 2MB" });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newProfileImage = `/images/${req.file.filename}`;
    const { userid } = req.user;

    try {
      // Get the old profile image path from DB
      const [rows] = await dbconnection.query(
        "SELECT profileimg FROM users WHERE userid = ?",
        [userid]
      );

      const oldProfileImage = rows[0]?.profileimg;

      // Delete old image if it exists and is not a default image
      if (
        oldProfileImage &&
        oldProfileImage !== "/images/default.png" &&
        fs.existsSync(path.join(__dirname, "..", oldProfileImage))
      ) {
        fs.unlinkSync(path.join(__dirname, "..", oldProfileImage));
      }

      // Update new image in DB
      await dbconnection.query(
        "UPDATE users SET profileimg = ? WHERE userid = ?",
        [newProfileImage, userid]
      );

      return res.status(200).json({
        message: "Image uploaded successfully",
        profileImage: newProfileImage,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Database or file system error", error });
    }
  });
};

module.exports = { profileImage };