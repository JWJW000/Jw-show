'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

// 记录访问日志的辅助函数
function logAccess(strapi, workId, ctx) {
  if (!workId) return;

  try {
    // 获取客户端 IP 地址（优先使用反向代理传递的真实 IP）
    const xForwardedFor = ctx.request.headers['x-forwarded-for'];
    const realIpFromHeader =
      xForwardedFor?.split(',')[0]?.trim() ||
      ctx.request.headers['x-real-ip'];

    const ip =
      realIpFromHeader ||
      ctx.request.ip ||
      ctx.request.socket?.remoteAddress ||
      'unknown';

    // 获取其他请求信息
    const userAgent = ctx.request.headers['user-agent'] || '';
    const referer = ctx.request.headers['referer'] || ctx.request.headers['referrer'] || '';
    const path = ctx.request.url || '';

    // 异步创建访问日志记录，不阻塞响应
    setImmediate(async () => {
      try {
        // 尝试通过第三方服务解析 IP 所在地（仅用于方便查看，大致位置，可能不完全准确）
        let location = '';
        try {
          if (ip && ip !== 'unknown') {
            const res = await fetch(`https://ipapi.co/${ip}/json/`);
            if (res.ok) {
              const data = await res.json();
              const parts = [
                data.country_name,
                data.region,
                data.city,
              ].filter(Boolean);
              location = parts.join(' / ');
            }
          }
        } catch (geoError) {
          strapi.log.warn('Failed to resolve IP location:', geoError.message);
        }

        await strapi.entityService.create('api::access-log.access-log', {
          data: {
            work: workId,
            ip,
            userAgent,
            referer,
            path,
            location,
          },
        });
      } catch (error) {
        strapi.log.warn('Failed to log access:', error.message);
      }
    });
  } catch (error) {
    strapi.log.warn('Failed to prepare access log:', error.message);
  }
}

// 创建默认 controller
const defaultController = createCoreController('api::work.work');

module.exports = createCoreController('api::work.work', ({ strapi }) => {
  const controller = defaultController({ strapi });

  return {
    async find(ctx) {
      // 调用默认的 find 方法
      const result = await controller.find(ctx);

      // 如果查询返回单个结果（通过 slug 查询），记录访问日志
      if (result.data && Array.isArray(result.data) && result.data.length === 1) {
        logAccess(strapi, result.data[0].id, ctx);
      }

      return result;
    },

    async findOne(ctx) {
      // 调用默认的 findOne 方法
      const result = await controller.findOne(ctx);

      // 如果找到作品，记录访问日志
      if (result.data && result.data.id) {
        logAccess(strapi, result.data.id, ctx);
      }

      return result;
    },
  };
});
