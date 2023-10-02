const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
let options = {
    encoding: 'utf-8',
    maxFileSize: 50 * 1024 * 1024,
}

const isFileValid = (file) => {
    const type = file.mimetype.split("/").pop();
    console.log(type)
    const validTypes = ["jpg", "jpeg", "png", "pdf", 'mp4'];
    if (validTypes.indexOf(type) === -1) {
        return false
    }
    return true;
};

const file_management = (file, imply) => {
    const isValid = isFileValid(file)
    if (!isValid) throw new Error('Only  [jpg, jpeg, png, pdf, mp4] are allowed')
    let fileName = file.newFilename.replace(/\s/g, "-") //* replace white space with -
    let _fileName = encodeURIComponent(`${imply}_${fileName}.${file.mimetype.split("/").pop()}`); //* encode url the filename
    fs.renameSync(file.filepath, path.join(options.uploadDir, _fileName));
    console.log(path.join(options.uploadDir, _fileName))
    return _fileName
}



module.exports = async (req, imply, folder, next) => {
    try {
        const absolute_path = process.cwd()
        const relative_path = path.join("public", folder)
        options.uploadDir = path.join(absolute_path, relative_path);

        let form = new formidable.IncomingForm(options)
        var [fields, files] = await form.parse(req)
        //* example fields:{ key: [ 'value' ], key2: [ 'value' ] }
        //* convert fields value into JSON
        const keyValuePairs = Object.keys(fields).map(key => `"${key}": "${fields[key][0]}"`);
        const jsonString = `{ ${keyValuePairs.join(',')} }`;
        let result = JSON.parse(jsonString)
        if (files.file.length > 0) {
            if (!fs.existsSync(options.uploadDir)) fs.mkdirSync(options.uploadDir, { recursive: true });
            result.file_path = path.join(relative_path, file_management(files.file[0], imply))
        }
        return result
    } catch (error) {
        //* if error occurred remove file
        fs.unlink(path.join(options.uploadDir, files.file[0].newFilename),
            (err) => {
                if (err) {
                    console.error(err);
                    next(err)
                }
            });
        next(error)
    }

}
