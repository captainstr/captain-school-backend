module.exports = ({ env }) => ({
  url: env("STRAPI_WEBSITE", "http://localhost"),
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "0ec389c2bb6d30205e1ea8ed4940fe2b"),
    },
  },
  cron: { enabled: true },
});
