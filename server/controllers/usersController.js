// MongoDB database Model and Token --------------------------------------------------------------------
const UserModel = require('../models/users')
const CitiesModel = require('../models/citiesList')
const jwt = require('jsonwebtoken')

// Hapi Joi Validations -------------------------------------------------------------------------------- 
const Joi = require('@hapi/joi')

const registerStep1Schema = Joi.object({
    ID: Joi.string().required(),
    mail: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required(),
    confirmPassword: Joi.any().equal(Joi.ref('password')),
})
const registerStep2Schema = Joi.object({
    ID: Joi.string().required(),
    mail: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required(),
    confirmPassword: Joi.any().equal(Joi.ref('password')),
    city: Joi.string().required(),
    street: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
})

// ----------------------------------------------------------------------------------------------------
// Users Controller 
// ----------------------------------------------------------------------------------------------------
class UsersController {
    static async getCities(req, res, next) {
        try {
            const result = await CitiesModel.find({})
            return res.json(result)
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Error' });
        }
    }
    static async registerStep1(req, res, next) {

        try {
            const { error } = registerStep1Schema.validate(req.body)
            if (error) {
                const response = error.details[0].message.replace(/\"/g, '')
                return res.status(401).json(response)
            }

            const { ID, mail } = req.body

            // const foundID = await isIDExist(ID)
            const foundID = await isExist({ ID: ID })
            if (foundID) return res.status(401).json("ID already exist")

            const foundMail = await isExist({ mail: mail })
            if (foundMail) return res.status(401).json("mail already exist")

            const isInsert = await saveUserStep1(req.body)
            if (isInsert) return res.json({ message: "user saved!", status: "Step1 OK" })
            return res.json({ message: "error!", status: "Step1 Error" })

        } catch (error) {
            console.log(error);
            return res.json({ message: "error!", status: "Step1 Error" })
        }
    }
    static async registerStep2(req, res, next) {

        try {

            const { error } = registerStep2Schema.validate(req.body)
            if (error) {
                const response = error.details[0].message.replace(/\"/g, '')
                return res.status(401).json(response)
            }

            const { ID, firstName, lastName, city, street } = req.body
            let foundID = await isIDExist(ID)
            if (foundID) {

                foundID.firstName = firstName;
                foundID.lastName = lastName;
                foundID.city = city;
                foundID.street = street;
                foundID.role = 'user';
                await foundID.save();

                return res.json({ message: "User registered successfully! please login.", status: "Step2 OK" })
            }
            return res.json({ message: "error!", status: "Step2 Error 1" })
        } catch (error) {
            console.log(error);
            return res.json({ message: "error!", status: "Step2 Error 2" })
        }
    }
    static async login(req, res, next) {
        try {
            const { mail, password } = req.body;
            const foundUser = await isUserExist(mail, password);

            if (!foundUser) return res.status(401).json({ userStatus: "error" })
            const user = { ...foundUser._doc, password: null }
            const jwtToken = await getJwt(user)
            return res.json({ token: jwtToken, user })

        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    }
}
module.exports = UsersController;

async function isIDExist(id) {
    try {
        const result = await UserModel.findOne({ ID: { $eq: id } }).exec();
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function isExist({ ID: ID = null, mail: mail = null }) {
    try {
        const payload = ID ? { ID: { $eq: ID } } : { mail: { $eq: mail } }
        const result = await UserModel.findOne(payload).exec();
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function isUserExist(mail, password) {
    try {
        const result = await UserModel.findOne({ mail: mail, password: password }).exec();
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function saveUserStep1(user) {
    try {
        const newUser = new UserModel(user)
        const result = await newUser.save();
        return result
    } catch (error) {
        console.log(error);
    }
}
function getJwt(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, process.env.SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) reject("error")
            resolve(token)
        })
    })
}
