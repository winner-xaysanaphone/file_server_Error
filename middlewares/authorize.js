const jwt = require('jsonwebtoken')

module.exports = {
    admin_auth: async (req, res, next) => {
        try {
            if (!req.cookies.token) throw new Error('401::unauthorized', { cause: { status: 401 } })
            const token = req.cookies.token
            if (!token) throw new Error('Please login again', { cause: { status: 401 } })
            jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
                if (err) throw new Error('Authorization token is invalid')
                if (decoded.role !== 'root') throw new Error('Invalid Permission')
                req.user = decoded
                next()
            })
        } catch (error) {
            console.log(error.stack)
            res.redirect('/views/login')
            // console.log(error)
            // next(error)
        }
    },
    user_auth: async (req, res, next) => {
        try {
            if (!req.cookies.token) throw new Error('401::unauthorized', { cause: { status: 401 } })
            const token = req.cookies.token
            if (!token) throw new Error('Please login again', { cause: { status: 401 } })
            jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
                if (err) throw new Error('Authorization token is invalid')
                req.user = decoded
                next()
            })
        } catch (error) {
            console.log(error.stack)
            res.redirect('/views/login')
        }
    },
}