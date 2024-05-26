import multer from "multer";

// congiguration
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },

  filename: function (req, file, cb) {
    const name = new Date().toISOString() + "-" + file.originalname;
    cb(null, name);
  },
});

export const upload = multer({ storage: storageConfig });
