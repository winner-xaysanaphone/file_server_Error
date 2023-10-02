module.exports = views => (req, res, next) => {
    try {
        res.render(views, { data: req.result })
    } catch (error) {
        next(error)
    }
}