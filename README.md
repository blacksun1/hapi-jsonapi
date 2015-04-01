# hapi-jsonapi

Helper for implementing [JSON API](http://jsonapi.org) with [hapi](http://hapijs.com). **This is still work in progress!**


## Usage

Register this plugin and a default error handler in your server:

```js
var hapiJsonApiOptions = {
    baseUrl: 'http://api.example.com/v1/'
};

server.register({ register: require('hapi-jsonapi'), options: hapiJsonApiOptions }, function (err) {

    if (err) { throw err; }

    // Error handler
    server.ext('onPreResponse', function (request, reply) {

        var response = request.response;

        if (!response.isBoom) {
            return reply.continue();
        }

        request.server.log(['error'], response);
        return reply.jsonapi(response);
    });
});
```

Then use `reply.jsonapi()` in your route handler. Wrap error messages either using [Boom](https://github.com/hapijs/boom) or a regular JS `Error` object:

```js
reply.jsonapi( Boom.notFound() );
reply.jsonapi( new Error('Something went wrong') );
```

A `self` reference is always added inside a top-level `links` key, additional links can be added by passing a second parameter:

```js
var links = {
    next: "http://example.com/posts?page[offset]=2",
    last: "http://example.com/posts?page[offset]=10"
};
reply.jsonapi( data, links );
```


## TODO:
- Check if id/type is set in data part of response
- Add Joi validation for API response structure
- Suppport [compound documents](http://jsonapi.org/format/#document-structure-compound-documents)
- Write tests
- …


## License

[MIT](LICENSE)
