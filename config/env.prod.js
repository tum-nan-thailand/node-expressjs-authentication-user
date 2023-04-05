module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST || "127.0.0.1",
  PORT: 3000,
  secret: "62=3%PLypdLT{pCu",
  jwksUri: "https://example.auth0.com/.well-known/jwks.json",
  audience: "https://example.com/api",
  issuer: "https://example.auth0.com/",
  database: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "db_aiya",
  },
};
