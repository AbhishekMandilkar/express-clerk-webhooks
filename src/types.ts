import {WebhookEvent as ClerkWebhookEvent} from '@clerk/express'
import { Request, Response } from 'express'

export type WebhookEvent = ClerkWebhookEvent;
export type WebhookHandler<T = any> = (event: WebhookEvent) => Promise<void>

export interface WebhookHandlerOptions {
  handlers: Record<WebhookEvent['type'], WebhookHandler>
  secretKey?: string
  path?: string
}