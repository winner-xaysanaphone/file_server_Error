const boilerplate = {
    does_id_exists: async function (_id, Model) {
        try {
            const result = await Model.findById(_id)
            if (!result) throw new Error('_id does not exists')
            return true
        } catch (error) {
            throw new Error(error)
        }
    },
    push_id: async function (Model, field, body, param_id, push_id) {
        try {
            const result = await Model.updateOne({ _id: param_id },
                {
                    ...body,
                    $addToSet: { [field]: push_id }
                },
            );
            // console.log(result)
            return result
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    },
    pull_id: async function (Model, field, param_id, pull_id) {
        try {
            console.log(pull_id)
            const result = await Model.findByIdAndUpdate(param_id,
                {
                    // ...body,
                    // $pull: { [field]: { $in: [pull_id] } }
                    $pull: {
                        resolutions: pull_id
                    }
                }, { new: true }
            );
            return result
        } catch (error) {
            throw new Error(error)
        }
    }

}

module.exports = boilerplate