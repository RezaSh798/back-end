const express = require('express');
const router = express.Router();
const CategoryController = require('../../../controllers/CategoryController');

router.route('/')
    .get(CategoryController.getCategories)
    .post(CategoryController.newCategody);

router.route('/:id')
    .get(CategoryController.getCategory)
    .put(CategoryController.updateCategory)
    .delete(CategoryController.deleteCategory);

module.exports = router;