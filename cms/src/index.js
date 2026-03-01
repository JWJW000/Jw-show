'use strict';

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    try {
      const roleService = strapi.plugin('users-permissions').service('role');
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });
      if (!publicRole) {
        strapi.log.warn('Public role not found, skip permission bootstrap');
        return;
      }

      const roleWithPermissions = await roleService.findOne(publicRole.id);
      if (!roleWithPermissions || !roleWithPermissions.permissions) {
        strapi.log.warn('Public role permissions not loaded, skip');
        return;
      }

      const permissions = roleWithPermissions.permissions;
      const toEnable = [
        'api::work.work.find',
        'api::work.work.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
        'api::about.about.find',
      ];
      for (const actionStr of toEnable) {
        const parts = actionStr.split('.');
        const type = parts[0];
        const controller = parts[1];
        const action = parts[2];
        if (permissions[type]?.controllers?.[controller]?.[action]) {
          permissions[type].controllers[controller][action].enabled = true;
        }
      }

      await roleService.updateRole(publicRole.id, {
        name: publicRole.name,
        description: publicRole.description,
        permissions,
      });
      strapi.log.info('Public API permissions (work, category, about) enabled.');
    } catch (err) {
      strapi.log.error('Bootstrap Public permissions failed:', err);
    }
  },
};
