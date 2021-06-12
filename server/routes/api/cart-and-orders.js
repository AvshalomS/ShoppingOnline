const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartAndOrdersController')
const authMiddleware = require('../../middlewares/authMiddleware')


/* GET get cart by cartID. */
router.get('/get-cart/:cartId', [authMiddleware.isUser], cartController.getCartByCartId)
/* POST get all user carts. */
router.post('/get-user-carts', [authMiddleware.isUser], cartController.getCartsByUserId)
/* POST get the latest user cart. */
router.post('/get-user-cart', [authMiddleware.isUser], cartController.getLastCartByUserId)
/* POST open new cart */
router.post('/open-new-cart', cartController.openNewCart)
/* POST add item to cart. */
router.post('/add-item-to-cart', [authMiddleware.isUser], cartController.addToCart)
/* DELETE item from cart. */
router.delete('/delete-from-cart', cartController.deleteFromCart)
/* POST order the cart. */
router.post('/order-the-cart', [authMiddleware.isUser], cartController.orderTheCart)
/* POST check if cart is ordered. */
router.post('/check-if-cart-is-ordered', [authMiddleware.isUser], cartController.checkIfCartIsOrdered)


// System -----------------------------------------------------------------------------------------------
/* GET num of orders. - (System require) */
router.get('/num-of-orders', cartController.getNumOfOrders)


module.exports = router;
