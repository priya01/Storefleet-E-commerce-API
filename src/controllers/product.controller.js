import ErrorHandler from '../utils/errorHandler.js';
import {
    getAllProductsRepo,
    getProductByIdRepo,
    updateProductRepo,
} from '../repositories/product.repository.js';

// Get All Products - features search, filter & pagination
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await getAllProductsRepo(req.query);

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Review - Fix Review Delete Feature and Rating Update
export const deleteReview = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.query;

        const product = await getProductByIdRepo(productId);

        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        // Restrict users to deleting only their own reviews
        const review = product.reviews.find(
            (rev) => rev._id.toString() === reviewId
        );

        if (!review) {
            return next(new ErrorHandler('Review not found', 404));
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return next(
                new ErrorHandler('You can only delete your own reviews', 403)
            );
        }

        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== reviewId
        );

        let avg = 0;

        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        let ratings = 0;

        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = avg / reviews.length;
        }

        const numOfReviews = reviews.length;

        product.reviews = reviews;
        product.ratings = ratings;
        product.numOfReviews = numOfReviews;

        await updateProductRepo(product);

        res.status(200).json({
            success: true,
            message: 'Review Deleted Successfully',
        });
    } catch (error) {
        next(error);
    }
};
