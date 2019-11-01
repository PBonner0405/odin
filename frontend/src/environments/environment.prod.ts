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

