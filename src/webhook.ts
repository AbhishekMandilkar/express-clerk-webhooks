import { Router, Request, Response } from "express";
import { WebhookHandlerOptions, WebhookEvent } from "./types";
import { parseClerkEvent } from "./parse";

export class ClerkWebhookManager {
  private router: Router;
  private handlers: WebhookHandlerOptions["handlers"];
  private secretKey?: string;
  private path: string;

  constructor(options: WebhookHandlerOptions) {
    this.router = Router();
    this.handlers = options.handlers;
    this.secretKey = options.secretKey;
    this.path = options.path || "/webhook";

    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(`${this.path}/health`, (req, res) => {
      res.send("ok");
    });

    this.router.post(this.path, async (req, res) => {
      try {
        if (!this.secretKey) {
          throw new Error("Secret key is not set");
        }

        const event = parseClerkEvent({
          requestBody: req.body,
          requestHeaders: req.headers,
          secret: this.secretKey,
        });

        if (event.type in this.handlers) {
          await this.handlers[event.type]?.(event);
          return res
            .status(200)
            .json({ message: "Webhook processed successfully" });
        }

        console.warn(`Unhandled webhook type: ${event.type}`);
        return res.status(200).json({ message: "Unhandled webhook type" });
      } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(400).json({ error: "Webhook processing failed" });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
