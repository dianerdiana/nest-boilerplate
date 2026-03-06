export const CONFIGURATION = {
  nodeEnv: 'app.nodeEnv',
  port: 'app.port',

  dbUrl: 'database.url',
  dbHost: 'database.host',
  dbPort: 'database.port',
  dbUser: 'database.user',
  dbPassword: 'database.password',
  dbDatabase: 'database.database',

  jwtAccessToken: 'jwt.accessToken',
  jwtRefreshToken: 'jwt.refreshToken',
  jwtAccessTokenExpire: 'jwt.accessTokenExpire',
  jwtRefreshTokenExpire: 'jwt.refreshTokenExpire',
} as const;
