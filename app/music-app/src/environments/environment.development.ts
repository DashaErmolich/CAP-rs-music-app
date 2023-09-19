import { CORS_DEV } from 'src/app/constants/constants';

export const environment = {
  production: false,
  apiUrl: `${CORS_DEV}/http://localhost:4004/`,
  deezerUrl: `${CORS_DEV}/https://api.deezer.com/`,
};
