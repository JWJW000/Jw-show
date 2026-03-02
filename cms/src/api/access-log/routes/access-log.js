'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/access-logs',
      handler: 'access-log.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/access-logs/:id',
      handler: 'access-log.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
