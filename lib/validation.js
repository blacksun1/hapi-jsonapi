const Joi = require('joi');
const internals = {};


// Validation rules according to jsonapi.org 1.0 spec
internals.jsonapiLink = [
    Joi.string().uri().required(),
    Joi.object({
        href: Joi.string().uri().required(),
        meta: Joi.object().required()
    })
];

internals.jsonapiResource = Joi.object({
    id            : Joi.any().required(),
    type          : Joi.string().required(),
    attributes    : Joi.object(),
    relationships : Joi.object(),
    links         : Joi.object(),
    meta          : Joi.object()
}).required();


internals.jsonapiResourceIdentifier = Joi.object({
    id            : Joi.any().required(),
    type          : Joi.string().required(),
    meta          : Joi.object()
}).required();


internals.jsonapiData = [
    internals.jsonapiResource,
    internals.jsonapiResourceIdentifier,
    Joi.array(0),
    Joi.array().items(internals.jsonapiResource),
    Joi.array().items(internals.jsonapiResourceIdentifier)
];


internals.jsonapiRelationship = Joi.object({
    links: Joi.object(),
    data: internals.jsonapiData,
    meta: Joi.object()
});


internals.jsonapiError = Joi.object({
    id     : Joi.any(),
    links  : Joi.object({ about: internals.jsonapiLink }),
    status : Joi.string(),
    code   : Joi.string(),
    title  : Joi.string(),
    detail : Joi.string(),
    source : Joi.object({
        pointer   : Joi.string(),
        parameter : Joi.string()
    }),
    meta  : Joi.object()
});


internals.jsonapiDocument = Joi.object({
    data    : internals.jsonapiData,
    errors  : [internals.jsonapiError],
    meta    : Joi.object(),
    jsonapi : Joi.object({
        version : Joi.string(),
        meta    : Joi.object()
    }),
    links   : Joi.object(),
    included: Joi.array().items(internals.jsonapiResource)
}).required().xor('data', 'errors');


module.exports = internals.jsonapiDocument;
