export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
  },
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
    accessTokenExpire: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    refreshTokenExpire: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  },
});
