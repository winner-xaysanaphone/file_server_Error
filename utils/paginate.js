const paginate = async ({
    req,
    model,
    searchField = [],
    customSearch = {},
    populate = [],
    select = [],
    sort = [{ "created_at": 1 }],
}) => {
    // req is required
    if (!req) throw new Error("req is required");
    // model is required
    if (!model) throw new Error("model is required");

    // find limit and skip for pagination if exist in query string (default limit = 12) (default skip = 0)
    const { page, limit, search } = req.query;
    const _limit = parseInt(limit) || 12;
    const _page = parseInt(page) || 1;
    const _skip = _limit * _page - _limit;

    let total = 0;
    let findObj = {}

    // check if searchField is not empty array and search is not empty string then search query
    if (searchField.length > 0 && search?.length > 0) {
        // check search must be string type or number type
        if (search && typeof search !== "string" && typeof search !== "number") throw new Error("search must be string or number");

        findObj = {
            $or: searchField.map(field => ({
                [field]: { $regex: search, $options: "i" },
            })),
        }
    }

    if (JSON.stringify(customSearch) !== '{}') findObj = { ...findObj, ...customSearch }

    let result = await model
        .find(findObj)
        .populate(populate)
        .select(select)
        .sort(sort)
        .skip(_skip)
        .limit(_limit);
    // find total data
    total = await model.find(findObj).limit().countDocuments();

    // find total page
    const totalPage = Math.ceil(total / _limit);
    // find next page
    const nextPage = _page + 1 > totalPage ? null : _page + 1;
    // find previous page

    const previous = _page - 1 <= 0 ? null : _page - 1;
    // return pagination data
    return {
        total,
        page: _page,
        limit: _limit,
        total_in_page: result.length,
        total_page: totalPage,
        next: nextPage,
        previous,
        data: result,
    };
};

module.exports = {
    paginate,
};
