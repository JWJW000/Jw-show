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
          ACL: env('OSS_BUCKET_ACL', 'public-read'),
          signedUrlExpires: env.int('OSS_SIGNED_URL_EXPIRES', 60 * 60),
        },
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.qq.com'),
        port: env.int('SMTP_PORT', 465),
        secure: true,
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM', '848810436@qq.com'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO', '848810436@qq.com'),
      },
    },
  },
});
