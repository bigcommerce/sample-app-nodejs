# NextJS Sample App

This demo includes all of the files necessary to get started with a basic, hello world app. This app was built using NextJS, BigDesign, Typescript, and React.

## App Installation

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/bigcommerce/sample-app-nodejs)

To get the app running locally, follow these instructions:

1. [Use Node 14+ and NPM 7+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-node-js)
    - `node -v`
    - `npm -v`
2. Install npm packages
    - `npm install`
3. [Add and start ngrok.](https://www.npmjs.com/package/ngrok#usage) Note: use port 3000 to match Next's server.
    - `npm install ngrok`
    - `ngrok http 3000`
4. [Register a draft app.](https://developer.bigcommerce.com/docs/3ef776e175eda-big-commerce-apps-quick-start#register-the-app)
     - For steps 5-7, enter callbacks as `'https://{ngrok_id}.ngrok.io/api/{auth||load||uninstall}'`. 
     - Get `ngrok_id` from the terminal that's running `ngrok http 3000`.
     - e.g. auth callback: `https://12345.ngrok.io/api/auth`
5. Copy .env-sample to `.env`.
     - If deploying on Heroku, skip `.env` setup.  Instead, enter `env` variables in the Heroku App Dashboard under `Settings -> Config Vars`.
6. [Replace client_id and client_secret in .env](https://devtools.bigcommerce.com/my/apps) (from `View Client ID` in the dev portal).
7. Update AUTH_CALLBACK in `.env` with the `ngrok_id` from step 5.
8. Enter a jwt secret in `.env`.
    - JWT key should be at least 32 random characters (256 bits) for HS256
9. Specify DB_TYPE in `.env`
    - Either `firebase` or `mysql`
    - If using Firebase, enter your firebase config keys. See [Firebase quickstart](https://firebase.google.com/docs/firestore/quickstart)
    - If using MySQL, enter your mysql database config keys (host, database, user/pass and optionally port). **If not** using the heroku deploy button above, you will now want to run `npm run db:setup` to perform the initial database setup. Note: if using Heroku with ClearDB, the DB should create the necessary `Config Var`, i.e. `CLEARDB_DATABASE_URL`.
10. Start your dev environment in a **separate** terminal from `ngrok`. If `ngrok` restarts, update callbacks in steps 4 and 7 with the new ngrok_id.
    - `npm run dev`
11. [Install the app and launch.](https://developer.bigcommerce.com/docs/3ef776e175eda-big-commerce-apps-quick-start#install-the-app)
