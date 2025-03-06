const multer = require("multer");

// Define storage configuration for file uploads
const storage = multer.diskStorage({
  // Specify the destination folder for uploaded files
  destination: function (req, file, cb) {
    // Files will be saved in the 'Public/uploads' directory
    cb(null, './Public/uploads');
  },

  // Specify how the file will be named when saved
  filename: function (req, file, cb) {
    // File will be named as the current timestamp followed by the original filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


module.exports = multer({ storage }); //Export the functions


