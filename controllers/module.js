const Model = require('../models/module')
const mongoose = require('mongoose')
const { paginate } = require('../utils/paginate')
const boilerplate = require('../utils/boilerplate')
const populate = [{ path: "sub_modules", path: "err_definitions" }]

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
            if (!result) throw new Error('not found')
            return res.json({ data: result })
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const { title } = req.body
            if (!title) throw new Error('title is required')
            // const result = await Model.create({ title: title, user_id: req.user._id })
            const result = await Model.create({ title: title })
            return res.json({ data: result })
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { _id } = req.params
            if (!(_id)) throw new Error("_id is required")
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')
            const result = await Model.findOneAndUpdate({ _id: _id }, req.body, { new: true });
            if (!result) throw new Error('not found')
            return res.json({ data: result })
        } catch (error) {
            next(error)
        }
    },
    pull_arr: async function (req, res, next) {
        try {
            const { _id } = req.params
            const { field, pull_id } = req.body //* field = [err_definition, sub_module]
            // * check valid _id
            if (!(_id)) throw new Error("_id is required")
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')

            // * check _id is exists
            const params_id_checked = await boilerplate.does_id_exists(_id, Model)
            // const pull_id_checked = await boilerplate.does_id_exists(pull_id)

            let result
            if (params_id_checked) {
                result = await boilerplate.pull(Model, field, req.body, _id, pull_id)
                return res.json({ data: result })
            } else {
                throw new Error('_id does not exist')
            }
        } catch (error) {
            next(error)
        }
    },
    push_arr: async function (req, res, next) {
        try {
            const { _id } = req.params
            const { field, push_id } = req.body //* field = [error_id, module_id]
            // * check valid _id
            if (!(_id)) throw new Error("_id is required")
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('invalid _id')

            // * check _id is exists
            const params_id_checked = await boilerplate.does_id_exists(_id, Model)
            const push_id_checked = await boilerplate.does_id_exists(push_id)

            let result
            if (params_id_checked || push_id_checked) {
                result = await boilerplate.pull(Model, field, req.body, _id, push_id)
                return res.json({ data: result })
            } else {
                throw new Error('_id does not exist')
            }
        } catch (error) {
            next(error)
        }
    },
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


