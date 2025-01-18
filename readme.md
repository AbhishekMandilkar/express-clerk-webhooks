# Express Clerk Webhook Handler 🚀

[![npm version](https://badge.fury.io/js/clerk-auth-webhook-handler.svg)](https://badge.fury.io/js/clerk-auth-webhook-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

A type-safe webhook handler for Express applications specifically designed for Clerk Authentication webhooks. Set up your Clerk webhook handlers in minutes!

## ✨ Features

- 🔒 **Type-safe**: Full TypeScript support with Clerk event types
- 🚀 **Express Integration**: Seamless integration with Express applications
- ⚡ **Zero Dependencies**: Lightweight with no external runtime dependencies
- 🔐 **Secure**: Built-in support for Clerk webhook signature verification
- 🎯 **Event-Based**: Simple event-based architecture for Clerk events
- ⚙️ **Middleware Ready**: Easy to extend with custom middleware

## 📦 Installation

```bash
# Using npm
npm install clerk-auth-webhook-handler

# Using yarn
yarn add clerk-auth-webhook-handler

# Using pnpm
pnpm add clerk-auth-webhook-handler
```

## 🚀 Quick Start

```typescript
import express from 'express';
import { ClerkWebhookManager } from 'clerk-auth-webhook-handler';
import { UserJSON } from '@clerk/clerk-sdk-node';

const app = express();

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'healthy' });
});`

// Initialize webhook handler
const webhookHandler = new ClerkWebhookManager({
  path: '/api/clerk-webhooks',
  secretKey: process.env.CLERK_WEBHOOK_SECRET,
  handlers: {
    'user.created': async (event) => {
      const user = event.data as UserJSON;
      console.log(`New user created: ${user.username} (${user.email_addresses[0].email_address})`);
    }
  }
});

// Use middleware
app.use(express.json());
app.use(webhookHandler.getRouter());

app.listen(3000, () => {
  console.log('🚀 Server ready at http://localhost:3000');
});
```

## 📘 Supported Clerk Events

The webhook handler supports all Clerk webhook events including:

- `user.created`
- `user.updated`
- `user.deleted`
<!-- More coming soon -->

## 🔐 Security

### Webhook Signature Verification

The handler automatically verifies Clerk webhook signatures when you provide the secret key:

```typescript
const webhookHandler = new ClerkWebhookManager({
  path: '/api/clerk-webhooks',
  secretKey: process.env.CLERK_WEBHOOK_SECRET, // Required for security
  handlers: {
    // Your handlers here
  }
});
```

## 🎯 Complete Example

```typescript
import express from 'express';
import { ClerkWebhookManager } from 'clerk-auth-webhook-handler';
import { UserJSON } from '@clerk/clerk-sdk-node';

const app = express();

// Initialize webhook handler
const webhookHandler = new ClerkWebhookManager({
  path: '/api/clerk-webhooks',
  secretKey: process.env.CLERK_WEBHOOK_SECRET,
  handlers: {
    'user.created': async (event) => {
    //  your logic here
    //   const user = event.data as UserJSON;
    //   await db.users.create({
    //     id: user.id,
    //     email: user.email_addresses[0].email_address,
    //     name: user.username
    //   });
    },
    'user.updated': async (event) => {
    //   your logic here
    //   const user = event.data as UserJSON;
    //   await db.users.update(user.id, {
    //     email: user.email_addresses[0].email_address,
    //     name: user.username
    //   });
    },
  }
});

app.use(express.json());
app.use(webhookHandler.getRouter());

app.listen(3000, () => {
  console.log('🚀 Server ready at http://localhost:3000');
});
```

## 🧪 Testing

To test your Clerk webhook handlers locally:

```typescript
// test/webhook.test.ts
import request from 'supertest';
import { app } from '../src/app';

describe('Clerk Webhook Handler', () => {
  it('should handle user.created event', async () => {
    const payload = {
      type: 'user.created',
      data: {
        id: '123',
        email_addresses: [{
          email_address: 'test@example.com'
        }],
        username: 'testuser'
      }
    };

    await request(app)
      .post('/api/clerk-webhooks')
      .send(payload)
      .expect(200);
  });
});
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help integrating the Clerk webhook handler, please open an issue or reach out to the maintainers.

---

Made with ❤️ by Abhishek