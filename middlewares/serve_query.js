module.exports = (req, res, next) => {
    try {
        return res.json({ data: req.result })
    } catch (error) {
        next(error)
    }
}