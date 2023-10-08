const express = require('express')
const router = express.Router()
const err_definition = require('../../controllers/err_definition')
const resolution = require('../../controllers/resolution')
const file_upload = require('../../middlewares/file_upload')
const multipart_form = require('../../middlewares/multipart_form')
const serve_query = require('../../middlewares/serve_query')
const authorize = require('../../middlewares/authorize')
const user = require('../../controllers/user')

// * err_definition
router.route('/',).get(err_definition.read, serve_query)
router.route('/err_definition/:_id').get(err_definition.read_id, serve_query)
router.route('/:_id').put(user.update_as_user)

router.route('/user/reset_password')
    .patch(user.reset_password)

router.route('/user/:_id')
    .put(user.update_as_user)

router.route('/user/password').put(user.update_password)
// .delete(user.delete)


module.exports = router


