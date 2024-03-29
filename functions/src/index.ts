import * as functions from "firebase-functions";
import mail, { MailDataRequired } from "@sendgrid/mail";
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

// new functions

const fakeApiKey = "fake-api-key";

const mailData: MailDataRequired = {
  to: "to@example.com",
  from: "from@example.com",
  replyTo: "from@example.com",
  templateId: "fake-template",
}

export const mailThrowsErrorDirectly = functions.https.onRequest(async (request, response) => {
  functions.logger.info("throwsResponseErrorDirectly called: will be logged with severity 'Error'");
  mail.setApiKey(fakeApiKey);
  await mail.send(mailData);
});

export const mailThrowsIncorrectlyWrappedError = functions.https.onRequest(async (request, response) => {
  functions.logger.info("throwsBadlyWrappedResponseError called: will be logged with severity 'Default'");
  mail.setApiKey(fakeApiKey);
  try {
    await mail.send(mailData);
  } catch (err) {
    throw new Error(`Caught Sendgrid error: ${err}`);
  }
});

export const mailThrowsCorrectlyWrappedError = functions.https.onRequest(async (request, response) => {
  functions.logger.info("throwsCorrectlyWrappedResponseError called: will be logged with severity 'Error'");
  mail.setApiKey(fakeApiKey);
  try {
    await mail.send(mailData);
  } catch (err) {
    throw new Error("Caught Sendgrid error:", {cause: err} );
  }
});
