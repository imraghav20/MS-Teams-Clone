# MS-Teams-Clone
https://imraghav20.github.io/MS-Teams-Clone/#/

### About
A Microsoft Teams Clone under Microsoft Engage Mentorship 2021.

### Tech Stack
The application is based on MERN stack (MongoDB, ExpressJS, ReactJS and NodeJS), webRTC API and socket.io

### Running locally
1. Clone the repository either using Git CLI or Download as Zip.
2. `cd server` and run `npm install` to install all the dependencies on server side.
3. In another terminal `cd client` folder and run `npm install` to install all the dependencies on client side.
4. Inside server folder, create a `.env` file and put 2 variables in it: <br>
i. `MONGO_URL = "mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_NAME>.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority"` <br>
(Modify the above URL as per the URL you receive after creating your Cluster on MongoDB Atlas)
ii. `JWT_SECRET = <ANY_STRING_YOU_PREFER>`
5. Run `npm start` on both server side and client side. Open the web app on http://localhost:3000/ .

### Deployment
1. Currently, the server is deployed at Heroku using Heroku CLI.
2. Change the localhost server link to deployed server link in `./client/api/index.js` and `./client/SocketContext.js`.
3. Now, run `npm run deploy` on client side to deploy the application on GitHub pages.