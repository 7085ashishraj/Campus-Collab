const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx|txt|zip|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Mimetype check can be tricky for some doc types, relying mostly on extension for now or add more mimetypes
    // const mimetype = filetypes.test(file.mimetype);

    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Supported files are PDF, DOC, DOCX, TXT, ZIP, JPG, JPEG, PNG!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
