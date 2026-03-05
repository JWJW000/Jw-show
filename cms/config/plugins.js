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
      provider: 'strapi-provider-upload-oss',
      providerOptions: {
        accessKeyId: env('OSS_ACCESS_KEY_ID'),
        accessKeySecret: env('OSS_ACCESS_KEY_SECRET'),
        region: env('OSS_REGION'),
        bucket: env('OSS_BUCKET'),
        uploadPath: env('OSS_UPLOAD_PATH'),
        baseUrl: env('OSS_BASE_URL'),
        timeout: env.int('OSS_TIMEOUT', 60),
        secure: env.bool('OSS_SECURE', true),
        internal: env.bool('OSS_INTERNAL', false),
        bucketParams: {
          ACL: env('OSS_BUCKET_ACL', 'private'),
          signedUrlExpires: env.int('OSS_SIGNED_URL_EXPIRES', 60 * 60),
        },
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
