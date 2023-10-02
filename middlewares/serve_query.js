module.exports = (req, res, next) => {
    try {
        console.log(req.result)
        return res.json({ data: req.result })
    } catch (error) {
        next(error)
    }
}