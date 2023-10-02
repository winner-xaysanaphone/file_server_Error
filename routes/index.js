

module.exports = initRoutes = (app) => {
    app.get('/', (req, res) => res.send('ສະ​ບາຍ​ດີ'))
    // app.get('/', (req, res) => {
    //     res.render('index', { message: 'Hello EJS!' });
    // }
    // );
    // app.get('/download', (req, res) => {
    //     // let file = req.query.file.split('/')
    //     // let path = file[0]
    //     // let filename = file.pop()
    //     const  file = `${__dirname}/`
    //     res.download()
    // })
    // app.use('test')
    app.use('/api', require('./api'))
    app.use('/views', require('./views'))

}