const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController')
const authMiddleware = require('../../middlewares/authMiddleware')


/* POST create product category. */
router.post('/new-category', [authMiddleware.isAdmin], productsController.addNewCategory)
/* POST add new product. */
router.post('/add-new-product', [authMiddleware.isAdmin], productsController.addNewProduct)
/* PUT edit product. */
router.put('/edit-product', [authMiddleware.isAdmin], productsController.editProduct)
/* GET all products. */
router.get('/all-products', [authMiddleware.isLogin], productsController.getAllProducts)
/* GET products by category. */
router.get('/products/:id', [authMiddleware.isLogin], productsController.getProductsByCategory)


// System -----------------------------------------------------------------------------------------------
/* GET num of products. - (System require) */
router.get('/num-of-products', productsController.getNumOfProducts)
/* GET products Categories List. - (System require) */
router.get('/category-list', productsController.getCategoriesList)


module.exports = router;
