'use strict';
var parse = require('co-body');
var entities = [];


module.exports.home = function * home(next) {
  if ('GET' != this.method) return yield next;
  this.body = 'home! you have '+ entities.length +' entities';
};

module.exports.all = function * all(next) {
  if ('GET' != this.method) return yield next;
  this.body = entities;
};

module.exports.fetch = function * fetch(id, next) {
  if ('GET' != this.method) return yield next;
  // Quick hack.
  if(id === '' + parseInt(id, 10)) {
    let entity = yield entities.filter(function (element) {
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
  let entity = yield parse(this, {
    limit: '1kb'
  });
  entities.push(entity);
  this.body = 'Done!';
};

module.exports.modify = function * modify(id, next) {
  if ('PUT' != this.method) return yield next;

  let data = yield parse(this, {
    limit: '1kb'
  });

  let entityIndex = -1;
  yield entities.filter(function (element, index) {
    let check = id === element.id;
    if (check) {
      entityIndex = index;
    }
    return check;
  });

  if (entityIndex < 0) {
    this.throw(404, 'book with id = ' + id + ' was not found');
  }

  entities[entityIndex] = data;

  this.body = 'Done';
};

module.exports.remove = function * remove(id, next) {
  if ('DELETE' != this.method) return yield next;

  let entityIndex = -1;
  yield entities.filter(function (element, index) {
    var check = id === element.id;
    if (check) {
      entityIndex = index;
    }
    return check;
  });

  if (entityIndex < 0) {
    this.throw(404, 'book with id = ' + id + ' was not found');
  }

  entities.splice(entityIndex, 1);

  this.body = 'Done';
};

module.exports.head = function *(){
  return;
};

module.exports.options = function *() {
  this.body = 'Allow: HEAD,GET,PUT,DELETE,OPTIONS';
};

module.exports.trace = function *() {
  this.body = 'Smart! But trace along the lines.';
};