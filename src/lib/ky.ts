import Ky from 'ky';

export const kyInstance = Ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
