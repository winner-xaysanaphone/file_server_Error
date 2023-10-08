
const Model = require('../models/err_definitions')
const mongoose = require('mongoose')
const { paginate } = require('../utils/paginate')
const boilerplate = require('../utils/boilerplate')
const resolution_Model = require('../models/resolution')
const rollback_handler = require('../middlewares/rollback_handler')
const populate = [{ path: "resolutions" }]
const { log, logLevels } = require('../utils/logger')
module.exports = {
    read: async (req, res, next) => {
        try {
            const result = await paginate({
                req,
                model: Model,
                // sort: { 'created_at': -1 },
                populate: populate,
                searchField: ['code', 'error_message']
            })
            req.result = result
            next()
        } catch (error) {
            next(error)
        }
    },
    read_id: async (req, res, next) => {
        try {
            const { _id } = req.params
            if (!(_id || mongoose.Types.ObjectId.isValid(_id))) throw new Error("_id is required")
            let result
            if (req.query.add_views) {
                result = await Model.findByIdAndUpdate(_id, { $inc: { views: 1 } }, { new: true }).populate(['user_id', 'resolutions'])
            } else {
                result = await Model.findById(_id).populate(['user_id', 'resolutions'])
            }
            if (!result) throw new Error('not found')
            req.result = result
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            console.log(req.body)
            const { code } = req.body
            if (!code) throw new Error('error code is required')
            // const result = await Model.create({ title: title, user_id: req.user._id })
            const result = await Model.create(req.body)
            return res.json({ data: result })
            // req.result = result
            // next()
        } catch (error) {
            console.log(error.stack)
            log(logLevels.error, error.stack)
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { _id } = req.params
            if (!(_id)) throw new Error("_id is required")
            console.log(req.body)
            // if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')
            const result = await Model.findOneAndUpdate({ _id: _id }, req.body, { new: true });
            if (!result) throw new Error('not found')
            return res.json({ data: result })
            // req.result = result
            // next()
        } catch (error) {
            log(logLevels.error, error.stack)

            next(error)
        }
    },
    push_root_cause: async (req, res, next) => {
        try {
            log(logLevels.info, 'req.body= ' + req.body)
            const { _id } = req.params
            // * check valid _id
            const result = await Model.findByIdAndUpdate(_id, { $addToSet: { root_cause: req.body.root_cause } }, { new: true })
            return res.json({ data: result })
        } catch (error) {
            log(logLevels.error, error.stack)
            console.log(error)
            next(error)
        }
    },
    pull_root_cause: async (req, res, next) => {
        try {
            log(logLevels.info, 'req.body= ' + req.body)
            const { _id } = req.params
            const result = await Model.findByIdAndUpdate(_id, {
                $pull: { root_cause: req.body.root_cause }
            }, { new: true })
            return res.json({ data: result })
        } catch (error) {
            log(logLevels.error, error.stack)
            console.log(error)
            next(error)
        }
    },
    pull_resolution_arr: rollback_handler(async function (req, res, next) { // no need to delete resolution before pull from err definition
        try {
            log(logLevels.info, 'req.body= ' + req.body)
            const { _id } = req.params
            const { resolution_id } = req.body //* field = [resolutions]
            // * check valid _id
            if (!(_id)) throw new Error("_id is required")
            //* remove resolution then pull id from  err-def
            // * if field = resolution remove it first
            const del_res = await resolution_Model.deleteOne({ _id: resolution_id })
            if (!del_res) throw Error('Resolution not found')
            let result
            result = await Model.findByIdAndUpdate(_id, { $pull: { resolutions: req.body.resolution_id } })
            return res.json({ data: result })
        } catch (error) {
            log(logLevels.error, error.stack)
            next(error)
        }
    }),
    delete: async function (req, res, next) {
        try {
            const { _id } = req.params
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')
            const result = await Model.deleteOne({ _id: _id })
            return res.json({ data: result })
        } catch (error) {
            next(error)
        }
    }
}


