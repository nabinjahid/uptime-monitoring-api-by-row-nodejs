// dependencies

// module scafolding
const environments = {};

// staging environments
environments.staging = {
  port: 3000,
  envName: "staging",
};

// production environments
environments.production = {
  port: 5000,
  envName: "production",
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";
// environmentToExport
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
