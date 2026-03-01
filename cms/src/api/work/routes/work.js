'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/works',
      handler: 'work.find',
    },
    {
      method: 'GET',
      path: '/works/:id',
      handler: 'work.findOne',
    },
  ],
};
