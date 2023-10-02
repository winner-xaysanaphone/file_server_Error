const resolution = require("../controllers/resolution");
const fs = require('fs')
const dir = require('../utils/dir')
const path = require('path')

// * check valid file type
const isFileValid = (file) => {
    const type = file.mimetype.split("/").pop();
    const validTypes = ["jpg", "jpeg", "png", "pdf", 'mp4'];
    if (validTypes.indexOf(type) === -1) {
        return false
    }
    return true;
};

//* change file name generated from formidable 
const file_management = (file, imply, destination) => {
    const isValid = isFileValid(file)
    if (!isValid) throw new Error('Only  [jpg, jpeg, png, pdf, mp4] are allowed')

    let fileName = file.newFilename.replace(/\s/g, "-") //* replace white space with -
    let _fileName = encodeURIComponent(`${imply}_${fileName}.${file.mimetype.split("/").pop()}`); //* encode url the filename
    let dir = path.join(destination, _fileName) //* relative path to save into database
    fs.renameSync(file.filepath, path.join(process.cwd(), "public", dir)); //* move file from public/temp to the destination
    return dir
}



module.exports = async (req, res, next) => {
    try {
        // * imply to infuse in front of filename 
        let { files, imply, destination } = req.body //files = array
        imply = imply ? imply : 'default'
        destination = destination ? destination : 'default'
        if (!files) return next() //* if no file was uploaded
        if (files?.length > 0) {
            let save_dir = path.join(process.cwd(), "public", destination) //* absolute path
            if (!fs.existsSync(save_dir)) fs.mkdirSync(save_dir, { recursive: true });
            //? /\\/g = matches all occurrences of backslash `\` 
            //? g flag = replace all occurrences
            req.body.file_path = file_management(files[0], imply, destination).replace(/\\/g, '/')
            // console.log(files[0])
            req.body.file_ext = files[0].mimetype.split("/").pop()
        }
        next()
    } catch (error) {
        const { files } = req.body
        if (!files) return next(error)
        let new_file_path = path.join(dir.public_temp, files[0].newFilename) //* remove file based on formidable newFilename
        if (fs.existsSync(new_file_path)) {
            fs.unlink(new_file_path,
                (err) => {
                    if (err) {
                        let err_file = path.join(files[0].filepath, files[0].newFilename)
                        fs.renameSync(err_file, err_file + "_failed");
                        console.error(err);
                        return next(err)
                    }
                });
        }

        next(error)
    }
}