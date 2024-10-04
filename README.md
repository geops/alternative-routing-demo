# DB alternative routing demo

This is a demo of how to use the alternative routing API.

## Get your geops API key

3 psossibilities:

- Use the official one, you can find it in the corresponding vercel project
- Get your own API key on [developer.geops.io](https://developer.geops.io/), APIs needed: Routing, Stops, Maps.
- Get a [temporary key](https://backend.developer.geops.io/publickey), key is valid for 24 hours.

## Running the demo locally

```bash
cp .env.dist .env.local  // Set the VITE_API_KEY environment variable using your geOps API key in .env.local
corepack enabled
pnpm dev
```

## Deploying the demo

Just push to master and the demo will be deployed automatically, on https://alternative-routing-demo.vercel.app/
