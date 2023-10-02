const Model = require('../models/resolution')
const Err_definition = require('../models/err_definitions')
const mongoose = require('mongoose')
const { paginate } = require('../utils/paginate')
const boilerplate = require('../utils/boilerplate')
const populate = [{ path: "user_id" }]
const fs = require('fs')
const path = require('path')
const rollback_handler = require('../middlewares/rollback_handler')

module.exports = {
    read: async (req, res, next) => {
        try {
            const result = await paginate({
                req,
                model: Model,
                sort: { 'created_at': -1 },
                populate: populate
            })
            return res.json({ data: result })
        } catch (error) {
            next(error)
        }
    },
    read_id: async (req, res, next) => {
        try {
            const { _id } = req.params
            if (!(_id || mongoose.Types.ObjectId.isValid(_id))) throw new Error("_id is required")
            const result = await Model.findById(_id).populate(populate)
            // const result = await Model.findByIdAndUpdate(_id, { $inc: { views: 1 } }, { new: true })
            if (!result) throw new Error('not found')
            req.result = result
            next()
            // return res.json({ data: result })
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            log(logLevels.info, 'req.body= ' + req.body)
            const { _id } = req.params //* _id = err_definition
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')
            const doc = await Err_definition.findById(_id)
            if (!doc) throw new Error('Not Found')

            if (!req.body.title) throw new Error('title is required')
            // insert resolution
            log(logLevels.info, 'req.body= ' + req.body)
            const result = await Model.create(req.body)
            if (result) {
                await Err_definition.findByIdAndUpdate(_id, {
                    $addToSet: {
                        resolutions: result._id
                    }
                }, { new: true }
                )
            }
            return res.json({ data: result })
            // console.log(result)
            // return res.render('resolution/resolution_create', { data: result })
        } catch (error) {
            log(logLevels.error, error.stack)
            console.log(error)
            if (!req.body.file_path) return next(error)
            let file_path = path.join('public', req.body.file_path)
            if (file_path) {
                fs.unlink(file_path, err => {
                    if (err) {
                        fs.renameSync(file_path, '_failed' + file_path) // at failed at the end of file if error from unlink
                        log(logLevels.error, err.stack)
                        next(err)
                    }
                })
            }
            next(error)
        }
    },
    update_text: async (req, res, next) => {
        try {
            log(logLevels.info, 'req.body= ' + req.body)
            const { _id } = req.params
            if (!(_id)) throw new Error("_id is required")
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')
            const result = await Model.findByIdAndUpdate({ _id: _id }, req.body, { new: true });
            if (!result) throw new Error('not found')
            return res.json({ data: result })
        } catch (error) {
            log(logLevels.error, error.stack)
            next(error)
        }
    },
    validate_paramId: async (req, res, next) => {
        try {
            const { _id } = req.params
            if (!(_id)) throw new Error("_id is required")
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')
            const doc = await Model.findById(_id)
            if (!doc) throw new Error('Not Found')
            next()
        } catch (error) {
            next(error)
        }
    },
    update_file: async (req, res, next) => {
        try {
            //* req.body.file_path
            //* before insert new file remove the latest file
            //* req.body.doc come from validate_paramId 
            if (!req.body.file_path) throw new Error('file is required')
            const resolution = await Model.findOne({ _id: req.params._id })
            if (!resolution) throw new Error('resolution not found')
            let file_path = 'public/' + resolution.file_path
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path)
            }
            const result = await Model.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true });
            if (!result) throw new Error('not found')
            return res.json({ data: result })
        } catch (error) {
            log(logLevels.error, error.stack)
            next(error)
        }
    },
    push_arr: async function (req, res, next) {
        try {
            const { _id } = req.params
            const { field, push_id } = req.body //* field = [like, dislike]
            // * check valid _id
            if (!(_id)) throw new Error("_id is required")
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')

            log(logLevels.info, 'req.body= ' + req.body)
            // * check _id is exists
            const params_id_checked = await boilerplate.does_id_exist(_id, Model)
            const push_id_checked = await boilerplate.does_id_exist(push_id, Model)

            let result
            if (params_id_checked || push_id_checked) {
                result = await boilerplate.pull(Model, field, req.body, _id, push_id)
                return res.json({ data: result })
            } else {
                throw new Error('_id does not exist')
            }
        } catch (error) {
            log(logLevels.error, error.stack)
            next(error)
        }
    },
    delete: async function (req, res, next) {
        // const session = await mongoose.startSession()
        // session.startTransaction();
        try {
            const { _id } = req.params //* resolution _id
            const { err_id } = req.body //* being used to pull resolution element
            // if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')
            // pull resolution by update err_definition.resolution
            const pull = await Err_definition.findByIdAndUpdate(err_id, { $pull: { resolutions: err_id } }, { new: true })
            if (!pull) throw new Error('ບໍ່​ພົບຂໍ້​ມູນ ຂອງ Error')
            // remove file 
            const resolution = await Model.findOne({ _id: _id })
            if (!resolution) throw new Error("resolution not found")
            let file_path = 'public/' + resolution.file_path
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path)
            }
            // remove resolution
            const result = await Model.deleteOne({ _id: _id })
            return res.json({ data: result })
        } catch (error) {
            next(error)
        }
        // session.endSession()
    }
}



