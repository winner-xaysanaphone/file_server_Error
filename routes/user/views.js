
const express = require('express')
const router = express.Router()
const err_definition = require('../../controllers/err_definition')
const serve_views = require('../../middlewares/serve_views')
const user = require('../../controllers/user')
// const resolution = require('../../controllers/resolution')

// * err definition
router.get('/', err_definition.read, serve_views('user/index'))
router.get('/profile', user.profile, serve_views('all/profile'))
// * resolution create
router.get('/err_definition/:_id', err_definition.read_id, serve_views('user/read_id'))

//* user
router.get('/user/:_id', user.read_id, serve_views('all/update_user'))
router.get('/user/update/password/:_id', user.read_id, serve_views('all/update_password'))



module.exports = router