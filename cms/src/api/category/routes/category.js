'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/categories',
      handler: 'category.find',
    },
    {
      method: 'GET',
      path: '/categories/:id',
      handler: 'category.findOne',
    },
  ],
};
