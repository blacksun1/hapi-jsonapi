# hapi-jsonapi

Helper for implementing [JSON API](http://jsonapi.org) with [hapi](http://hapijs.com).  
**Important: This is still work in progress!** (Thus, it's not on npm yet.)


## Usage

Register this plugin in your hapi server:

```js
var hapiJsonApiOptions = {
    baseUrl: 'http://api.example.com/v1/'
};

server.register(
    { register: require('hapi-jsonapi'), options: hapiJsonApiOptions }, function (err) {

        if (err) { throw err; }
        // Start the server
    });
```

Then use `reply.jsonapi()` in your route handler, using a JSON API style response, e.g.:

```js
reply.jsonapi({
    id: 1,
    type: 'heartbeat',
    meta: {
        status: 'ok',
    }
});
```

A `self` reference is always added inside a top-level `links` key. The response will be validated wit `Joi`, logging any issues. However, _at the moment_, the response will be sent regardless of the validation result.

Errors can be passed into responses directly and will be automatically converted to the proper JSON API structure:

```js
reply.jsonapi( Boom.notFound() );
reply.jsonapi( new Error('Something went wrong') );
```




## TODO:

- Suppport [compound documents](http://jsonapi.org/format/#document-structure-compound-documents)
- Write tests
- …


## License

[MIT](LICENSE)
