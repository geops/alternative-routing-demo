# DB alternative routing demo

This is a demo of how to use the alternative routing API.

It uses a set of demo data stored in this repository.

To get new data, get the zip file at https://dalro.geops.io/api/alternatives/examples/zip?format=demo,

Extract the files in the `public/api/alternatives/examples` folder.

Then update the list in the `alroExamples` variable in  `src/App.tsx` file.

## Get your geops API key

3 psossibilities:

- Use the official one, you can find it in the corresponding vercel project
- Get your own API key on [developer.geops.io](https://developer.geops.io/), APIs needed: Routing, Stops, Maps.
- Get a [temporary key](https://backend.developer.geops.io/publickey), key is valid for 24 hours.

## Development

```bash
cp .env.dist .env.local  // Set the VITE_API_KEY environment variable using your geOps API key in .env.local
corepack enabled
pnpm dev
```

## Deploy

Just push to master and the demo will be deployed automatically, on https://alternative-routing-demo.vercel.app/

## Types

If the backend has changed you must regenerate types with the following command:

```bash
pnpm types:backend
```
