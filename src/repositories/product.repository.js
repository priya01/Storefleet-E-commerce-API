import Product from '../models/product.model.js';

export const getAllProductsRepo = async (queryStr) => {
    // Search Feature
    const searchObj = queryStr.keyword
        ? {
              name: {
                  $regex: queryStr.keyword,
                  $options: 'i',
              },
          }
        : {};

    // Filter Feature (Copying query string object to handle other filters)
    const queryCopy = { ...queryStr };

    // Removing fields meant for pagination/search
    const removeFields = ['keyword', 'page', 'limit'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Advanced filter for price, ratings, etc.
    let queryStrStr = JSON.stringify(queryCopy);
    queryStrStr = queryStrStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$$${key}`);

    let finalQueryObj = { ...searchObj, ...JSON.parse(queryStrStr) };

    // Pagination Feature
    const resultPerPage = parseInt(queryStr.limit) || 8;
    const currentPage = Number(queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    return await Product.find(finalQueryObj).limit(resultPerPage).skip(skip);
};

export const getProductByIdRepo = async (id) => {
    return await Product.findById(id);
};

export const updateProductRepo = async (product) => {
    return await product.save({ validateBeforeSave: false });
};
