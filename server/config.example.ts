/* eslint-disable prettier/prettier */
// @ts-nocheck

// You can find more information about what everything is here:
// https://github.com/Dev-CasperTheGhost/snaily-cadv3/wiki/Config-file
const config = {
  port: Number(process.env.PORT) || 3030,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  databaseName: process.env.DB_NAME || "snaily-cad",
  jwtSecret: process.env.JWT_SECRET || "bongo super cat",
  env: process.env.PROFILE || "production",
};

export default config;
