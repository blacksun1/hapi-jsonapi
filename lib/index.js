'use strict';

const Url = require('url');
const Hoek = require('hoek');
const Boom = require('boom');
const Joi = require('joi');

const jsonapiDocument = require('./validation.js');


exports.register = function (server, options, next) {

    options = options || {};
    options.baseUrl = options.baseUrl || server.info.uri;

    // Create a new method `reply.jsonapi()` in hapi
    server.decorate('reply', 'jsonapi', function (data) {

        // Handle empty calls
        if (!data) {
            return this
                .response({ data: [] })
                .type('application/vnd.api+json');
        }

        // Handle error output
        if (data instanceof Error) { data = [data]; }
        if (Array.isArray(data)) {

            data = data.map(function (data) {

                // Wrap errors not coming from hapi with boom, turns them into HTTP 500
                if (!data.isBoom) { Boom.wrap(data); }

                return {
                    status : String(data.output.statusCode),
                    detail : data.message,
                    meta   : { raw: data }
                };
            });

            return this
                .response({ errors: data })
                .type('application/vnd.api+json')
                .code(Number(data[0].status));
        }

        return Joi.validate(data, jsonapiDocument, (err) => {

            // Log validation errors, you might want to be stricter in production
            if (err) {
                this.request.log(['error'], err);
            }

            // Add 'self' reference to links if not already defined
            data.links = Hoek.merge(data.links || {}, { self: this.request.url.href });

            // Create absolute URL using `baseUrl` when no hostname is found
            Object.keys(data.links).forEach(function (key) {
                data.links[key] = ( !Url.parse(data.links[key]).hostname ) ?
                    Url.resolve(options.baseUrl, data.links[key]) :
                    data.links[key];
            });

            return this
                .response(data)
                .type('application/vnd.api+json');
        });
    });


    // Pipe all HTTP errors through `reply.jsonapi()`
    server.ext('onPreResponse', function (request, reply) {

        let response = request.response;

        if (!response.isBoom) {
            return reply.continue();
        }

        request.server.log(['error'], response);
        return reply.jsonapi(response);
    });


    return next();
};


exports.register.attributes = {

    pkg: require('../package.json')
};
