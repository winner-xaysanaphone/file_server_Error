const express = require('express')
const router = express.Router()
const err_definition = require('../../controllers/err_definition')
const resolution = require('../../controllers/resolution')
const file_upload = require('../../middlewares/file_upload')
const multipart_form = require('../../middlewares/multipart_form')
const serve_query = require('../../middlewares/serve_query')
const user = require('../../controllers/user')
const authorize = require('../../middlewares/authorize')

// * users
router.route('/user')
    .get(user.read, serve_query)

router.route('/user/:_id')
    .put(user.update_as_admin)
    .patch(user.reset_password_as_admin)
    .delete(user.delete)

router.route('/user/password/:_id')
    .patch(user.update_password_as_admin)


// * err_definition
router.route('/err_definition')
    .post(err_definition.create)
    .get(err_definition.read, serve_query)
router.route('/err_definition/:_id')
    .get(err_definition.read_id, serve_query)
    .put(err_definition.update, serve_query)
    .delete(err_definition.delete)

//* root cause
router.patch('/err_definition/root_cause/push/:_id', err_definition.push_root_cause)
router.patch('/err_definition/root_cause/pull/:_id', err_definition.pull_root_cause)

//* pull resolution
router.patch('/err_definition/resolution/pull/:_id', err_definition.pull_resolution_arr)

//* resolution
router.route('/resolution/create/push_to_err/:_id').post(multipart_form, file_upload, resolution.create) //* insert resolution and push resolution id into err_definition


router.route('/resolution/:_id')
    .put(resolution.update_text)
    .delete(resolution.delete) //* delete: pull resolution id from err_definition and delete resolution


router.patch('/resolution/update_file/:_id', resolution.validate_paramId, multipart_form, file_upload, resolution.update_file)




module.exports = router


