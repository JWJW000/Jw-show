module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      jwtSecret: env('JWT_SECRET', 'jwt-secret'),
    },
  },
  upload: {
    config: {
      provider: '@strapi/provider-upload-ali-oss',
      providerOptions: {
        accessKeyId: env('OSS_ACCESS_KEY_ID'),
        accessKeySecret: env('OSS_ACCESS_KEY_SECRET'),
        region: env('OSS_REGION'),
        bucket: env('OSS_BUCKET'),
        endpoint: env('OSS_ENDPOINT'),
        cname: env.bool('OSS_CNAME', false),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
