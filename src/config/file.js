const multer = require("multer");

// Configure multer to use memory storage (keeps files in memory as buffers)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
