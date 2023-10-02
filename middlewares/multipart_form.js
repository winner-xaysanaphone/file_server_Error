const formidable = require('formidable')
const dir = require('../utils/dir')
const path = require('path')

const fs = require('fs')
let options = {
    encoding: 'utf-8',
    maxFileSize: 50 * 1024 * 1024,
}

module.exports = async (req, res, next) => {
    try {
        if (!req.headers['content-type'].startsWith('multipart/form-data'))
            return res.status(400).send('Invalid Content-Type');
        if (!fs.existsSync(dir.public_temp)) fs.mkdirSync(dir.public_temp, { recursive: true })
        options.uploadDir = dir.public_temp;

        let form = new formidable.IncomingForm(options);
        var [fields, files] = await form.parse(req)
        // console.log(fields)
        // const keyValuePairs = Object.keys(fields).map(key => `"${key}": "${fields[key][0]}"`);
        // const jsonString = `{ ${keyValuePairs.join(',')} }`;
        // console.log(keyValuePairs)
        // console.log(jsonString)
        // let result = JSON.parse(jsonString)
        // field format: {field: [data], field: [data]}
        let result = {}
        // console.log(Object.keys(fields))
        Object.keys(fields).map(key => result[key] = fields[key][0])
        // ?files.[file] the file based on field name from form data request
        console.log('result', result)
        result.files = files.file //* array
        req.body = result

        next()
    } catch (error) {
        // * if error occurred remove file
        // console.log(files)
        if (!files) return next(error)
        let ext = files.file[0].mimetype.split('/').pop()
        let file_name = `${files.file[0].newFilename}.${ext}`
        let new_file_path = path.join(dir.public_temp, file_name)
        if (fs.existsSync(new_file_path)) {
            fs.unlink(new_file_path,
                (err) => {
                    if (err) {
                        let err_file = path.join(files.file[0].path, files.file[0].newFilename)
                        fs.renameSync(err_file, err_file + "_failed");
                        console.error(err);
                        return next(err)
                    }
                });
        }
        console.log(error)
        next(error)
    }
}