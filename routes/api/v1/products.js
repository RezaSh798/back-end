const express = require('express');
const router = express.Router();
const ProductController = require('../../../controllers/ProductController');

router.route('/')
    .get(ProductController.getProducts)
    .post(ProductController.newProduct);

router.route('/:id')
    .get(ProductController.getProduct)
    .put(ProductController.updateProduct)
    .delete(ProductController.deleteProduct);

router.route('/uploads/image')
    .post(ProductController.UploadImage);

router.route('/update/image')
    .post(ProductController.UpdateImage);

module.exports = router;