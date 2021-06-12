// File System module ---------------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');

// MongoDB database Modal (mongoose) ------------------------------------------------------------------
const categoryListModel = require('../models/productCategoryList');
const productModel = require('../models/product')

// Img server path
const imgPath = 'images/';
const imgEmptyIcon = 'Folder Empty.ico';

// Multer Upload file -----------------------------------------------------------------------------------
var img;
var multer = require('multer');

// Multer File upload settings
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/' + imgPath);
    },
    filename: (req, file, cb) => {
        img = Date.now() + '-' + file.originalname;
        // const img = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, img)
    }
})

// Multer Mime Type Validation
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('productPicture');

// ----------------------------------------------------------------------------------------------------
// Products Controller 
// ----------------------------------------------------------------------------------------------------
class ProductsController {
    static async addNewCategory(req, res, next) {
        try {
            const newCategory = new categoryListModel(req.body)
            const isInsert = await newCategory.save();
            if (isInsert) return res.json({ message: "Category saved!", status: "OK" })
            return res.json({ message: "error!", status: "Category save Error" })
        } catch (error) {
            console.log(error);
            return res.json({ message: "error!", status: "Category save Error" })
        }
    }
    static async getCategoriesList(req, res, next) {
        try {
            const result = await categoryListModel.find({}).exec();
            if (result) return res.json(result)
            return res.status(401).json(result)
        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    }
    static editProduct(req, res, next) {
        try {
            img = imgEmptyIcon;
            upload(req, res, async function (err) {
                try {
                    // Multer upload Errors
                    if (err instanceof multer.MulterError) {
                        return res.status(500).json(err)
                    } else if (err) {
                        return res.status(500).json(err)
                    }
                    if (img == "undefined") { img = imgEmptyIcon }
                    // console.log('img: ', img);

                    // Everything is OK - Update MongoDB
                    const { _id, productName, productPrice, productCategory } = req.body

                    // find category _id from productCategory string (Meat & Fish)
                    const category = await categoryListModel.findOne({ name: productCategory }).exec();
                    const category_id = category._id;

                    // Get product
                    const product = await productModel.findById(_id).exec()
                    // Delete Old Img
                    deleteOldImgFromServer(product.productPicture, imgEmptyIcon, imgPath)
                    // Updata product
                    product.productName = productName
                    product.productPicture = img
                    product.productCategory = category_id
                    isNaN(productPrice) ? product.productPrice = 0 : product.productPrice = productPrice

                    const isInsert = await product.save()

                    // send response
                    if (isInsert) return res.status(200).json({ message: 'The product has been updated!', product })
                    return res.status(401).json({ message: 'Product update Error!' })

                } catch (error) {
                    console.log(error);
                    return res.status(401).json({ message: 'Product update Error!', error })
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    }
    static addNewProduct(req, res, next) {
        try {
            img = imgEmptyIcon;
            upload(req, res, async function (err) {
                try {
                    // Multer upload Errors
                    if (err instanceof multer.MulterError) {
                        return res.status(500).json(err)
                    } else if (err) {
                        return res.status(500).json(err)
                    }
                    if (img == "undefined") { img = imgEmptyIcon }
                    // console.log('img: ', img);

                    // Everything is OK - Update MongoDB
                    const { productName, productPrice, productCategory } = req.body

                    // find category _id from productCategory string (Meat & Fish)
                    const category = await categoryListModel.findOne({ name: productCategory }).exec();
                    const category_id = category._id;

                    // Create new product
                    const product = await productModel.create({ productName, productPicture: img, productCategory: category_id })
                    isNaN(productPrice) ? product.productPrice = 0 : product.productPrice = productPrice

                    const isInsert = await product.save()

                    // send response
                    if (isInsert) return res.status(200).json({ message: 'New product has been add!', product })
                    return res.status(401).json({ message: 'Add new product Error!' })

                } catch (error) {
                    console.log(error);
                    return res.status(401).json({ message: 'Add new product Error!', error })
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    }
    static async getNumOfProducts(req, res, next) {
        const response = await getFromProducts('all')
        return res.status(response.status).json({ numOfProducts: response.result.length })
    }
    static async getAllProducts(req, res, next) {
        const response = await getFromProducts('all')
        return res.status(response.status).json(response.result)
    }
    static async getProductsByCategory(req, res, next) {

        const { id } = req.params
        const response = await getFromProducts(id)
        return res.status(response.status).json(response.result)

    }
}
module.exports = ProductsController;

async function getFromProducts(key) {
    try {

        const payload = key === 'all' ? {} : { productCategory: key }
        const result = await productModel.find(payload).
            populate({ path: 'productCategory', model: categoryListModel }).exec();

        if (result) {
            result.map(product => {
                product.productPicture = imgPath + product.productPicture
                return product
            })
            return { status: '200', result }
        }
        return { status: '401', result }

    } catch (error) {
        console.log(error)
        return { status: '401', result: error }
    }
}
function deleteOldImgFromServer(oldImg, imgEmptyIcon, imgPath) {
    try {
        if (oldImg !== imgEmptyIcon) {
            fs.unlinkSync(path.join("public", imgPath + oldImg))
        }
    } catch (error) {
        console.log(error);
    }
}
