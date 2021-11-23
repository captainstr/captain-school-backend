module.exports = ({ env }) => ({
  email: {
    provider: "smtp",
    providerOptions: {
      host: "capquest-com.mail.protection.outlook.com", //SMTP Host
      port: 25, //SMTP Port
      secure: false,
      username: env("EMAIL_USERNAME", ""),
      password: env("EMAIL_PASSWORD", ""),
      rejectUnauthorized: true,
      requireTLS: true,
      connectionTimeout: 1,
    },
    settings: {
      from: env("EMAIL_USERNAME", ""),
      replyTo: env("EMAIL_USERNAME", ""),
    },
  },
});
