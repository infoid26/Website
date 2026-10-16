# INFO ID 2026 website

## Run locally

Install Node.js 24 LTS, then run these commands from the repository root:

```sh
npm ci
npm start
```

Open http://localhost:8080. The server uses the `PORT` environment variable when supplied by Azure App Service.

```sh
npm test
```

The test checks the existing pages, assets and schedule PDF over HTTP, including that server/configuration files are not publicly served.

## Azure deployment

The existing `.github/workflows/main_infoid26.yml` builds and deploys after changes reach `main`. Pull requests run the server test before merge. The deployment uses the identity already configured in Azure; no database credentials belong in this repository.

This first server stage serves the existing HTML without changing its content or asset paths. EJS migration and PostgreSQL queries are later learning steps; the provisioned database is not yet used by this code.

If App Service does not start the application automatically, set its startup command to `npm start`. Verify the Azure default URL before changing the DNS for infoid26.ro.

Azure reference: https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs
