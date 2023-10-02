const mongoose = require('mongoose')

module.exports = (middleware) => async (req, res, next) => {
    try {
        var session = await mongoose.startSession()
        session.startTransaction();
        // req.session = session
        await middleware(req, res, next)
        await session.commitTransaction(); // * `commitTransaction()` to commit the changes to the database
        console.log('Transaction committed successfully.');
    } catch (error) {
        console.log('roll_handler', error)
        await session.abortTransaction();//*  `abortTransaction()` on the session object to roll back the transaction
        next(error)
    } finally {
        session.endSession();
    }
}
