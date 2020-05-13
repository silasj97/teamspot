# TournamentBuzz

## Release Notes

### Version 1.0.0

### Features for this release
* User Registration
* User Login
* Tournament Viewing, Creation & Modification
* Match Viewing, Creation & Modification
* Team Viewing, Creation & Modification
* Team Payment
* Score Entry
* Bracket Generation

### Bug fixes since the last release
None (first release)

### Known bugs and defects
* Match creation does not display properly in Firefox due to datetime not being supported
* There is no way to recover lost passwords or emails
* There is no way to change passwords
* There is no way to export or delete your account data (GDPR)
* No login brute force prevention
* Unit test coverage is not 100%, and not all unit tests are fixed
* Database has caps to the amount of data for each field and each table that could be exceeded

## Installation

### Prerequisites / Dependencies
nodejs >= 8.0 (https://nodejs.org)  
mysql 5.7 (https://www.mysql.com)  
A webserver to serve the frontend application (Apache, nginx, etc.)  

### Download Instructions
Download using git: `git clone https://github.com/TournamentBuzz/main.git`  
Download Zip: https://github.com/TournamentBuzz/main/archive/master.zip

### Build/Installation Instructions

`npm ci` is preferred over `npm install` because `npm install` can modify the pinned dependencies saved in the package-lock.json file.

#### Frontend
* In your terminal, open up the location you downloaded the application
* Use the `cd` command to get into the frontend folder
* Open package.json and set the proxy location to the location of the backend
* Run `npm ci`  to install the dependencies
* After the required modules are installed, `npm run build`
* Copy all the files in the build folder into webroot location
#### Backend
* In your terminal, open up the location you downloaded the application
* Use the `cd` command to get into the backend folder
* Run `npm ci` to install the dependencies
#### Database
* Create a mysql user with any username and password
* Run backend/model/setup.sql under the new mysql user to initialize the tables

### Run instructions
* Make sure your webserver is running
* Make sure mysql is running
* Set your backend environment variables:
  * PORT - the port the backend will run on
  * AUTH_EC_KEY - JWT secret key (set to something secure)
  * DB_HOST - database hostname (defaults to localhost)
  * DB_PORT - mysql database port (defaults to default mysql port)
  * DB_NAME - the name of your created database (defaults to ‘tournamentbuzz’)
  * DB_USERNAME - database username
  * DB_PASSWORD - database password
  * STRIPE_SECRET_KEY - secret key for stripe payments
* After configuring the environment variables, type `npm start` in the backend folder to start the backend
* Navigate to the web address that is configured to serve the frontend application

### Troubleshooting
* If the frontend is not displaying when you visit the web location, check your webserver config to make sure it is pointing to the correct files in the webroot and that your DNS records are pointing to your server.
* If the frontend is having issues displaying tournaments as well as with registering and logging in, make sure the backend is running and the proxy location is correct. 
* If the backend is erroring on startup, make sure the mysql service is running and that the environment variables are properly set.
