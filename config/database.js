module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "mysql2",
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 8889),
        database: env("DATABASE_NAME", "strapi"),
        username: env("DATABASE_USERNAME", "root"),
        password: env("DATABASE_PASSWORD", "root"),
      },
      options: {},
    },
  },
});
