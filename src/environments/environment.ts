// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  region: 'us-east-2',
  identityPoolId: 'us-east-1:fbe0340f-9ffc-4449-a935-bb6a6661fd53',
  userPoolId: 'us-east-2_wt5gcRjP3',
  clientId: 'j1d3kcckrr51m50oa3jsugd3n',
  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: ''
};
