const joi = require('joi')
const { VISIBILITY_TYPES } = require('../config/constants');
const { searchFormatter, timeFormatter } = require('../helpers');
const { Types: { ObjectId } } = require('mongoose');

const validateCreate = joi.object({
    title: joi.string().min(0).max(1000).required(),
	description: joi.string().min(0).max(5000).required(),
    time_restricted: joi.boolean().default(false).required(),
	visibility: joi.string().lowercase().trim().valid(...VISIBILITY_TYPES).required(),
	start_at: joi.date().iso()
    .when('time_restricted', { is: true, then: joi.required() })
    .when('time_restricted', { is: false, then: joi.forbidden() }),
	end_at: joi.date().iso()
    .when('time_restricted', { is: true, then: joi.required() })
    .when('time_restricted', { is: false, then: joi.forbidden() }),
    members: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    created_by: joi.string().regex(/^[0-9a-fA-F]{24}$/),
})

const validateRead = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    search_query: joi.string().custom(searchFormatter),
    time_restricted: joi.boolean(),
    finished: joi.boolean(),
    start_at: joi.date().iso(),
    end_at: joi.date().iso(),
    visibility:  joi.array().min(1).max(VISIBILITY_TYPES.length).items(joi.string().trim().valid(...VISIBILITY_TYPES)),
    members: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
    created_by: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    page: joi.number().min(0).integer().default(1),
    limit: joi.number().min(0).integer().default(6),
    sort: joi.number().max(1).min(-1).default(1),
})

const validateUpdate = joi.object({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    created_by: joi.string().regex(/^[0-9a-fA-F]{24}$/).custom(value => ObjectId(value)),
    title: joi.string().min(0).max(1000),
	description: joi.string().min(0).max(5000),
    time_restricted: joi.boolean(),
    finished: joi.boolean(),
	visibility: joi.string().lowercase().trim().valid(...VISIBILITY_TYPES),
	start_at: joi.date().iso()
    .when('time_restricted', { is: true, then: joi.required() })
    .when('time_restricted', { is: false, then: joi.forbidden() }),
	end_at: joi.date().iso()
    .when('time_restricted', { is: true, then: joi.required() })
    .when('time_restricted', { is: false, then: joi.forbidden() }),
    members: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
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