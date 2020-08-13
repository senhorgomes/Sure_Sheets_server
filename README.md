## Sure Sheets Server

Server side for Sure Sheets app. This server contains all routing and information to communicate with the front-end and its database.

- Run "npm install"
- Load vagrant using command "vagrant up" and connect to it via "vagrant ssh"
- Traverse into the root of the folder "finals_server"
- Once in, use the command "psql -U development" to enter PSQL under the user development
- Enter "development" when it prompts you for a password
- Run command "\i schema/create.sql" to create database and create schemas
- Run command "\i schema/test.sql" to verify everything was created succesfully (You can also verify this running "SELECT * FROM user")
- Start up the server with "npm start" and you're ready to go!
- Be sure to have vagrant running at all times if you are ever running the server

## Dependencies

- pg
- Express
- Bcrypt
- CookieSession
- Cors
- nodemon
