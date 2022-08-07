const joi = require('joi')
const { searchFormatter } = require('../helpers');
const { Types: { ObjectId } } = require('mongoose');

const validateCreate = joi.object({
    title: joi.string().min(0).max(1000).required(),
	description: joi.string().min(0).max(5000).required(),
    body: joi.string().min(0).max(10_000).required(),
    tags: joi.array().max(50),
    created_by: joi.string().regex(/^[0-9a-fA-F]{24}$/),
})

const validateRead = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    search_query: joi.string().custom(searchFormatter),
    tags:  joi.array().min(1).max(50),
    page: joi.number().min(0).integer().default(1),
    limit: joi.number().min(0).integer().default(6),
    sort: joi.number().max(1).min(-1).default(1),
})

const validateUpdate = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    created_by: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    title: joi.string().min(0).max(1000),
	description: joi.string().min(0).max(5000),
    body: joi.string().min(0).max(10_000),
    tags: joi.array().max(50),
})

const validateDelete = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    created_by: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
})

module.exports = {
    validateCreate,
    validateRead,
    validateUpdate,
    validateDelete
}