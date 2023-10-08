const authorize = require('../middlewares/authorize')
const user_cont = require('../controllers/user')

const serve_views = require('../middlewares/serve_views')

module.exports = initRoutes = (app) => {
    app.get('/', (req, res) => res.send('ສະ​ບາຍ​ດີ'))
    app.get('/logout', user_cont.logout)
    //* admin auth
    app.post('/api/login', user_cont.login)
    app.post('/api/register', user_cont.user_register) //* user 
    app.post('/api/admin/register', user_cont.admin_register) //* admin

    // update user data
  

    app.get('/profile', authorize.user_auth, user_cont.profile, serve_views(''))

    app.use('/views/login', (req, res) => res.render('auth/login_user'))
    app.use('/views/register', (req, res) => res.render('auth/register_user'))

    app.use('/views/admin/login', (req, res) => res.render('auth/login_admin'))
    app.use('/views/admin/register', (req, res) => res.render('auth/register_admin'))


    app.use('/admin/api', authorize.admin_auth, require('./admin/api'))
    app.use('/admin/views', authorize.admin_auth, require('./admin/views'))

    app.use('/api', authorize.user_auth, require('./user/api'))
    app.use('/views', authorize.user_auth, require('./user/views'))

}