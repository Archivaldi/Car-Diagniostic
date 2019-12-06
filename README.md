# [Heroku Link](https://peaceful-gorge-28528.herokuapp.com)

# Car-diagnostic

Very powerful and useful Full Stack Web App. It allowes user to check his/her car's error code. Just go to `OBD LookUp` page and put your car's error code. It's goint to give next information: 
* Definition of the error
* Effect on vehicle
* Responsible system
* Urgency of repair

![screenshot](/shots/errorExample.JPG)

The app allows the user to check his/her car's VIN code. Just go to `VIN Decoder` page and write VIN code and it's going to give next info:

* Engine type
* Car make
* Car manufacturer
* Car Model
* Transmission Type
* Trim Type
* Car Model Year

![screenshot](/shots/VINExample.JPG)

The user can use this app as a guest or he/she can Sign Up. When the user is signing up, the app allows save only one car, but after signing up user will be redirect to profile page where he/she can add more cars. It's not limited.

![screenshot](/shots/profile.JPG)

We use hashing to keep passwords safe and make sure users information is private.


 ## Technologies used express:
 * HTML
 * CSS3
 * Bootstrap 4
 * Javascript
 * MySQL
 * Node.js
 * NPM packages: 
    *dotenv
    * mysql 
    * body-parser 
    * ejs 
    * cookie-parser
    * bcrypt 
    * express-sessions