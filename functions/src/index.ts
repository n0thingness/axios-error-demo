import * as functions from "firebase-functions";
import { AxiosError } from "axios";

class CustomError extends Error {
  internalMessage: string;
  constructor(external: string, internal = "") {
    super(external);
    this.internalMessage = internal || external;
  }
}


export const throwsAxiosError = functions.https.onRequest((request, response) => {
  functions.logger.info("throwsAxiosError called");
  throw new AxiosError("This AxiosError will be logged with severity 'Debug'");
});

export const throwsNormalError = functions.https.onRequest((request, response) => {
  functions.logger.info("throwsNormalError called");
  throw new Error("This Error will be logged with severity 'Error'");
});


export const throwsCustomError = functions.https.onRequest((request, response) => {
  functions.logger.info("throwsCustomError called");
  throw new CustomError("This CustomError will be logged with severity 'Error'", "internal message");
});



