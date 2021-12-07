module.exports = ({ env }) => ({
  email: {
    provider: "smtp",
    providerOptions: {
      host: "smtp.gmail.com", //SMTP Host
      port: 465, //SMTP Port
      secure: true,
      username: env("EMAIL_USERNAME"),
      password: env("EMAIL_PASSWORD"),
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
