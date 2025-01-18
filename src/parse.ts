import { WebhookEvent } from "@clerk/express";
import { Webhook } from "svix";

export const parseClerkEvent = (params: {
  requestBody: any;
  requestHeaders: any;
  secret: string;
}) => {
  const { requestBody, requestHeaders, secret } = params;
  console.log("webhook event", params.requestBody);
  if (!secret) {
    console.error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
    throw new Error("Server configuration error: SIGNING_SECRET not found");
  }

  // Get the headers
  const svix_id = requestHeaders["svix-id"] as string;
  const svix_timestamp = requestHeaders["svix-timestamp"] as string;
  const svix_signature = requestHeaders["svix-signature"] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("Missing Svix headers");
  }

  // Create new Svix instance with secret
  const wh = new Webhook(secret);
  const body = JSON.stringify(requestBody);
  // Verify the payload with headers
  const evt = wh.verify(body, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  }) as WebhookEvent;

  return evt;
};
