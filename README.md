# NextJS Sample App

This starter app includes all the files necessary to get started with a basic, hello world app. This app uses NextJS, BigDesign, Typescript, and React.

## Running the app in development

To get the app running locally, follow these instructions:

1. [Use Node 18+ and NPM 8+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-node-js). To check the running versions, use the following commands:

```shell
node -v
npm -v
```

2. Clone and/or fork the repo and install npm packages:

```shell
git clone git@github.com:bigcommerce/sample-app-nodejs.git my-bigcommerce-app
cd my-bigcommerce-app
npm install
```

3. To expose your app server using an HTTP tunnel, install [ngrok](https://www.npmjs.com/package/ngrok#usage) globally, then start the ngrok service.

You can use `npm` to install ngrok:

```shell
npm install -g ngrok
```

Alternatively, MacOS users can use the [homebrew](https://brew.sh/) package manager:

```shell
brew install ngrok
```

Start ngrok on port `3000` to expose the default Next.js server:

```shell
ngrok http 3000
```

4. Use the BigCommerce [Developer Portal](https://devtools.bigcommerce.com) to [register a draft app](https://developer.bigcommerce.com/api-docs/apps/quick-start#register-the-app). For steps 5-7, enter callbacks as `'https://{ngrok_url}/api/{auth || load || uninstall}'`. Get the `ngrok_url` from the ngrok terminal session.

```shell
https://12345.ngrok-free.app/api/auth # auth callback
https://12345.ngrok-free.app/api/load # load callback
https://12345.ngrok-free.app/api/uninstall # uninstall callback
```

5. Copy `.env-sample` to `.env`.

```shell
cp .env-sample .env
```

6. In the `.env` file, replace the `CLIENT_ID` and `CLIENT_SECRET` variables with the API account credentials in the app profile. To locate the credentials, find the app's profile in the [Developer Portal](https://devtools.bigcommerce.com/my/apps), then click **View Client ID**.

7. In the `.env` file, update the `AUTH_CALLBACK` variable with the `ngrok_url` from step 4.

8. In the `.env` file, enter a secret `JWT_KEY`. To support HS256 encryption, the JWT key must be at least 32 random characters (256 bits).

9. **Configure the data store.** In the `.env` file, specify the `DB_TYPE`.

   > The DB type must be either `firebase` or `mysql`.

   If using Firebase, supply the `FIRE_` config keys listed in the `.env` file. See the [Firebase quickstart (Google)](https://firebase.google.com/docs/firestore/quickstart).

   If using MySQL, supply the `MYSQL_` config keys listed in the `.env` file, then do the initial database migration by running the following npm script:

```shell
npm run db:setup
```

10. Start your dev environment in a dedicated terminal session, **separate from `ngrok`**.

```shell
npm run dev
```

> If `ngrok` expires, update the callbacks in steps 4 and 7 with the new `ngrok_url`. You can learn more about [persisting ngrok tunnels longer (ngrok)](https://ngrok.com/docs/getting-started/#step-3-connect-your-agent-to-your-ngrok-account).

11. Consult our developer documentation to [install and launch the app](https://developer.bigcommerce.com/api-docs/apps/quick-start#install-the-app).

## Production builds

In production, you must build and run optimized version of the code. Use the following commands to get started:

> When you run the `start` script, specify a port number using the `-p` flag. Otherwise, the process will fail.

```shell
npm run build
npm run start -p 3000
```
