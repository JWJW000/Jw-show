module.exports = ({ env }) => {
  const ossHost = env('OSS_PUBLIC_HOST');

  const imgSrc = ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com'];
  const mediaSrc = ["'self'", 'data:', 'blob:'];

  if (ossHost) {
    imgSrc.push(ossHost);
    mediaSrc.push(ossHost);
  }

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': imgSrc,
            'media-src': mediaSrc,
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
