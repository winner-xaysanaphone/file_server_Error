module.exports = (views, role = 'USER') => (req, res, next) => {
    try {
        res.render(views, { data: req.result, role: role })
    } catch (error) {
        next(error)
    }
}