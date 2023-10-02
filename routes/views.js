const express = require('express')
const router = express.Router()
const err_definition = require('../controllers/err_definition')
const serve_views = require('../middlewares/serve_views')
const resolution = require('../controllers/resolution')

// * err definition
router.get('/', err_definition.read, serve_views('index'))
router.get('/err_definition/create', serve_views('err_definition/create'))
// router.get('/err_definition/update/description/:_id', err_definition.read_id, serve_views('err_definition/update_description'))
router.get('/err_definition/update/:_id', err_definition.read_id, serve_views('err_definition/update'))

// * resolution create
router.get('/resolution_create/to_err/:_id', err_definition.read_id, serve_views('resolution/create'))
router.get('/err_definition/:_id', err_definition.read_id, serve_views('err_definition/read_id'))


//* form
router.get('/resolution/update/:_id', resolution.read_id, serve_views('resolution/update'))
router.get('/resolution/update_file/:_id', resolution.read_id, serve_views('resolution/update_file'))


module.exports = router