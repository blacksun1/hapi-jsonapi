'use strict';

var Url = require('url');
var Hoek = require('hoek');


exports.register = function (server, options, next) {

    server.decorate('reply', 'jsonapi', function (data, links) {

        Hoek.assert(typeof data === 'object', 'JSON API "data" must be an object, array, or null');

        // Add 'self' reference to links if not already defined
        links = Hoek.merge(links || {}, { self: this.request.url.href });

        // Create absolute URL using `baseUrl` when no hostname is found
        Object.keys(links).forEach(function (key) {
            links[key] = ( !Url.parse(links[key]).hostname ) ?
                Url.resolve(options.baseUrl, links[key]) :
                links[key];
        });

        if (data && data.isBoom) {
            return this
                .response({
                    error: {
                        status : data.output.statusCode + '',
                        detail : data.message,
                        raw    : data
                    },
                    links: links
                })
                .type('application/vnd.api+json')
                .code(data.output.statusCode);
        }

        if (data && data instanceof Error) {
            return this
                .response({
                    error: {
                        title  : data.name,
                        detail : data.message,
                        raw    : data
                    },
                    links: links
                })
                .type('application/vnd.api+json')
                .code(500);
        }

        return this
            .response({
                data,
                links
            }).type('application/vnd.api+json');
    });

    return next();
};


exports.register.attributes = {

    pkg: require('../package.json')
};
