// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var server_url = '192.168.11.17:433';
//var server_url = 'exploreodin.com:443';
export const environment = {
  production: true,
  //REDIRECT_URL: `https://${server_url}`,
  REDIRECT_URL: `https://192.168.11.17:4200`,
  SOCKET_URL: `https://${server_url}`,
  SERVER_URL: `https://${server_url}/api`,
  USER_AVATAR_PATH: `https://${server_url}/uploads/images/`,
  USER_UPLOAD_PATH: `https://${server_url}/uploads/channel/`
};

//start with ng serve --ssl true --host 192.168.11.17