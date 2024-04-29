const imagekit = require("../../libs/imagekit");
const path = require("path");

module.exports = {
  imageKitUpload: async (req, res, next) => {
    try {
      let strFile = req.file.buffer.toString("base64");

      let { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      res.json({
        status: true,
        message: "OK",
        data: url,
      });

      req.send(response);
    } catch (error) {
      next(error);
    }
  },
};