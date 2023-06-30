import { HTTPError } from 'ky';

type ServerError = {
  error: string;
};

export const handleRequest = async <T>(request: Promise<T>): Promise<T> => {
  try {
    const response = await request;
    return response;
  } catch (err) {
    if (err instanceof HTTPError) {
      const serverError = (await err.response.json()) as ServerError;
      console.error(serverError.error);
    } else {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
    throw err;
  }
};
