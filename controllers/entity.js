'use strict';
var parse = require('co-body');
var co = require('co');
var entities = [];


module.exports.home = function * home(next) {
  if ('GET' != this.method) return yield next;
  this.body = 'home! you have '+ entities.length +' entities';
};

module.exports.all = function * all(next) {
  if ('GET' != this.method) return yield next;
  this.body = yield entities.find({});
};

module.exports.fetch = function * fetch(id, next) {
  if ('GET' != this.method) return yield next;
  // Quick hack.
  if(id === '' + parseInt(id, 10)) {
    var entity = yield entities.find(function (element) {
      return id === element.id;
    });
    if (entity.length === 0) {
      this.throw(404, 'entity with id = ' + id + ' was not found');
    }
    this.body = yield entity;
  }
};

module.exports.add = function * add(data, next) {
  if ('POST' != this.method) return yield next;
  var entity = data; // sanitize your input!
  var inserted = yield entities.push(entity);
  this.body = 'Done!';
};

module.exports.modify = function * modify(id, next) {
  if ('PUT' != this.method) return yield next;

  var data = yield parse(this, {
    limit: '1kb'
  });

  var entityIndex = yield entities.findIndex(function (element) {
    return id === element.id;
  });

  if (entityIndex < 0) {
    this.throw(404, 'book with id = ' + id + ' was not found');
  }

  entities[entityIndex] = data;

  this.body = "Done";
};

module.exports.remove = function * remove(id, next) {
  if ('DELETE' != this.method) return yield next;

  var entityIndex = yield entities.findIndex(function (element) {
    return id === element.id;
  });

  if (entityIndex < 0) {
    this.throw(404, 'book with id = ' + id + ' was not found');
  }

  entities.slice(entityIndex, 1);

  this.body = "Done";
};

module.exports.head = function *(){
  return;
};

module.exports.options = function *() {
  this.body = "Allow: HEAD,GET,PUT,DELETE,OPTIONS";
};

module.exports.trace = function *() {
  this.body = "Smart! But trace along the lines.";
};