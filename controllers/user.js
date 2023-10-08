const Model = require('../models/user')
const bcrypt = require('bcrypt')
const { paginate } = require('../utils/paginate')
const jwt = require('jsonwebtoken')
module.exports = {
    // auth.js
    admin_register: async (req, res, next) => {
        try {
            const { username, password, password2, branch_code, teller_id } = req.body
            if (JSON.stringify(req.body) === "{}") throw new Error("request data is empty")
            if (password !== password2) return res.status(400).json({ message: 'password not match' })
            if (password.length < 6) return res.status(400).json({ message: "Password less than 6 characters" })
            //Encrypt user password
            encryptedUserPassword = await bcrypt.hash(password, 10);
            let result = await Model.create({
                teller_id: teller_id,
                username: username,
                password: encryptedUserPassword,
                role: 'root',
                branch_code: branch_code,
                status: 'normal'
            })
            return res.json({ data: result })
        } catch (err) {
            res.status(401).json({
                // message: "User not successful created",
                message: err.message
            })
        }
    },
    user_register: async (req, res, next) => {
        try {
            const { username, password, password2, branch_code, teller_id } = req.body
            if (JSON.stringify(req.body) === "{}") throw new Error("request data is empty")

            if (password !== password2) return res.status(400).json({ message: 'password not match' })
            if (password.length < 6) return res.status(400).json({ message: "Password less than 6 characters" })
            //Encrypt user password
            encryptedUserPassword = await bcrypt.hash(password, 10);
            let result = await Model.create({
                teller_id: teller_id,
                username: username,
                password: encryptedUserPassword,
                role: 'user',
                branch_code: branch_code,
                status: 'normal'
            })
            return res.json({ data: result })
        } catch (err) {
            res.status(401).json({
                // message: "User not successful created",
                message: err.message
            })
        }
    },
    login: async (req, res, next) => {
        try {
            const { teller_id, password } = req.body
            const user = await Model.findOne({ teller_id })
            if (!user) throw new Error('User not found', { cause: { status: 401 } })
            //* compare password
            const hash_password = user.password
            const is_valid_password = await bcrypt.compare(password, hash_password)
            if (!is_valid_password) throw new Error('Invalid password', { cause: { status: 400 } })
            // * generate token and return 
            const secretKey = process.env.SECRETKEY
            const options = {
                expiresIn: '25h'
            }
            const payload = {
                _id: user._id,
                teller_id: user.teller_id,
                role: user.role
            }
            const token = jwt.sign(payload, secretKey, options)
            res.cookie('token', token, { httpOnly: true })
            res.status(200).json({ message: "Login successful" })
        } catch (err) {
            console.log(err.stack)
            res.status(400).json({
                // message: "An error occurred",
                message: err.message,
            })
        }
    },
    reset_password_as_admin: async (req, res, next) => {
        //* default password $2b$10$tq1mjNia204346T26GRknO1YjEMyyTzNRX6/oCJ7JD7HqS6W3UhEG = p@zzw0rd
        try {
            const { _id } = req.params
            let password = '$2b$10$tq1mjNia204346T26GRknO1YjEMyyTzNRX6/oCJ7JD7HqS6W3UhEG'
            const result = await Model.findByIdAndUpdate(_id, { password: password }, { new: true })
            return res.json({ data: result })
        } catch (err) {
            console.log(err)
            res.status(400).json({
                // message: "An error occurred",
                error: err.message,
            })
        }
    },
    reset_password: async (req, res, next) => {
        //* default password $2b$10$tq1mjNia204346T26GRknO1YjEMyyTzNRX6/oCJ7JD7HqS6W3UhEG = p@zzw0rd
        try {
            const { _id } = req.user
            let password = '$2b$10$tq1mjNia204346T26GRknO1YjEMyyTzNRX6/oCJ7JD7HqS6W3UhEG'
            const result = await Model.findByIdAndUpdate(_id, { password: password }, { new: true })
            return res.json({ data: result })
        } catch (err) {
            res.status(400).json({
                // message: "An error occurred",
                error: err.message,
            })
        }
    },
    update_as_admin: async (req, res, next) => {
        try {
            delete req.body.password
            delete req.body.role
            const { _id } = req.params
            const user = await Model.findOne({ _id: _id })
            if (!user) throw new Error('User not found')
            const result = await Model.findByIdAndUpdate(_id, req.body, { new: true })
            if (!result) throw new Error('User not found', { cause: { status: 404 } })
            return res.json({ data: result })
        } catch (err) {
            res.status(400).json({
                // message: "An error occurred",
                message: err.message,
            })
        }
    },
    update_as_user: async (req, res, next) => {
        try {
            delete req.body.password
            delete req.body.role
            const { _id } = req.user
            const user = await Model.findOne({ _id: _id })
            if (!user) throw new Error('User not found')
            const result = await Model.findByIdAndUpdate(_id, req.body, { new: true })
            if (!result) throw new Error('User not found', { cause: { status: 404 } })
            return res.json({ data: result })
        } catch (err) {
            res.status(400).json({
                // message: "An error occurred",
                message: err.message,
            })
        }
    },
    update_password_as_admin: async (req, res, next) => {
        try {
            const { password_old, password_new, password2 } = req.body
            if (password_new !== password2) return res.status(400).json({ message: 'ການ​ຍືນຍັນລະ​ຫັດ​ຜ່ານໃໝ່​ບໍ່​ຖືກ​ຕ້ອງ' })
            if (password_new.length < 6) return res.status(400).json({ message: "ລະ​ຫັດ​ຜ່ານ​ຕ້ອງຫຼາຍກວ່າ 6 ຕົວ" })
            // if (password_new !== password2) throw new Error('Old password and new Password not match')
            // const { _id } = req.params
            const user = await Model.findOne({ _id: req.params._id })
            if (!user) throw new Error('User not found')
            const is_valid_password = await bcrypt.compare(password_old, user.password)

            if (!is_valid_password) throw new Error('Old password ບໍ່​ຖືກ​ຕ້ອງ')
            let encryptedUserPassword = await bcrypt.hash(password_new, 10);
            const data = { password: encryptedUserPassword }
            const result = await Model.findByIdAndUpdate(req.params._id, data, { new: true })
            // if (!result) throw new Error('User not found', { cause: { status: 404 } })
            return res.json({ data: result })
        } catch (err) {
            console.log(err.stack)
            res.status(400).json({
                // message: "An error occurred",
                message: err.message,
            })
        }
    },
    update_password: async (req, res, next) => {
        try {
            const { password_old, password_new, password2 } = req.body
            if (password_new !== password2) return res.status(400).json({ message: 'ການ​ຍືນຍັນລະ​ຫັດ​ຜ່ານໃໝ່​ບໍ່​ຖືກ​ຕ້ອງ' })
            if (password_new.length < 6) return res.status(400).json({ message: "ລະ​ຫັດ​ຜ່ານ​ຕ້ອງຫຼາຍກວ່າ 6 ຕົວ" })
            const user = await Model.findOne({ _id: req.user._id })
            if (!user) throw new Error('User not found')
            const is_valid_password = await bcrypt.compare(password_old, user.password)

            if (!is_valid_password) throw new Error('Old password ບໍ່​ຖືກ​ຕ້ອງ')
            let encryptedUserPassword = await bcrypt.hash(password_new, 10);
            const data = { password: encryptedUserPassword }
            const result = await Model.findByIdAndUpdate(req.params._id, data, { new: true })
            // if (!result) throw new Error('User not found', { cause: { status: 404 } })
            return res.json({ data: result })
        } catch (err) {
            console.log(err.stack)
            res.status(400).json({
                // message: "An error occurred",
                message: err.message,
            })
        }
    },
    read: async (req, res, next) => {
        try {
            const { teller_id, username, status } = req.body
            // const result = await Model.find().select('teller_id status role username')
            const result = await paginate({
                req,
                model: Model,
                searchField: ['teller_id', 'role'],
                select: ['teller_id', 'status', 'role', 'username']
            })
            // return res.json({ data: result })
            req.result = result
            next()
        } catch (err) {
            console.log(err.stack)
            res.status(400).json({
                // message: "An error occurred",
                message: err.message,
            })
        }
    },
    delete: async (req, res, next) => {
        try {
            const result = await Model.deleteOne({ _id: req.body._id })
            return res.json({ data: result })
        } catch (err) {
            res.status(400).json({
                // message: "An error occurred",
                message: err.message,
            })
        }
    },
    profile: async (req, res, next) => {
        try {
            const result = await Model.findById(req.user._id).select('teller_id status role username')
            if (!result) throw new Error('User not found', { cause: { status: 404 } })
            // return res.json({ data: result })
            req.result = result
            next()
        } catch (error) {
            console.log(error.stack)
            next(error)
        }
    },
    read_id: async (req, res, next) => {
        try {
            const result = await Model.findById(req.params._id).select('teller_id status role username')
            if (!result) throw new Error('User not found', { cause: { status: 404 } })
            // return res.json({ data: result })
            req.result = result
            next()
        } catch (error) {
            console.log(error.stack)
            next(error)
        }
    },
    logout: async (req, res, next) => {
        try {
            res.cookie('token', '', { expires: new Date(0) });
            // return result.json({ msg: "Success" })
            res.redirect('/views/login')
        } catch (error) {
            console.log(error.stack)
            next(error)
        }
    },

}