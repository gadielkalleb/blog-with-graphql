const development = {
  "username": process.env.DB_DEV_USER,
  "password": process.env.DB_DEV_PASSWORD,
  "database": process.env.DB_DEV_DATABASE,
  "host": process.env.DB_DEV_INSTANCIA,
  "dialect": process.env.DB_DIALECT,
  "operatorsAliases": false
}

const test = {
  "username": process.env.DB_HOMOL_USER,  
  "password": process.env.DB_HOMOL_PASSWORD,
  "database": process.env.DB_HOMOL_DATABASE,
  "host": process.env.DB_HOMOL_INSTANCIA,
  "dialect": process.env.DB_DIALECT,
  "operatorsAliases": false
}

const production = {
  "username": process.env.DB_PROD_USER,  
  "password": process.env.DB_PROD_PASSWORD,
  "database": process.env.DB_PROD_DATABASE,
  "host": process.env.DB_PROD_INSTANCIA,
  "dialect": process.env.DB_DIALECT,
  "operatorsAliases": false
}

export {
  development,
  test,
  production
}
