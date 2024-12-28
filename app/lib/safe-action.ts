import {
    DEFAULT_SERVER_ERROR_MESSAGE,
    createSafeActionClient,
  } from "next-safe-action";
  import { headers } from "next/headers";
  
  export const actionClient = createSafeActionClient({
    handleServerError(e) {
      if (e instanceof Error) {
        return e.message;
      }
  
      return DEFAULT_SERVER_ERROR_MESSAGE;
    }
  });