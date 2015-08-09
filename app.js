'use strict';
var entities = require('./controllers/entity');
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();

// Logger
app.use(logger());

app.use(route.get('/', entities.home));
app.use(route.get('/entities/', entities.all));
app.use(route.get('/entities/:id', entities.fetch));
app.use(route.post('/entities/', entities.add));
app.use(route.put('/entities/:id', entities.modify));
app.use(route.delete('/entities/:id', entities.remove));
app.use(route.options('/', entities.options));
app.use(route.trace('/', entities.trace));
app.use(route.head('/', entities.head));



// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337'); //eslint-disable-line no-console
}