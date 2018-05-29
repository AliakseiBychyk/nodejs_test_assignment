## TvMaze Scraper - Node.js Application

This project has been created as Node.js test assignment.

As soon as you clone the project, don't forget to install dependencies:

```
npm install
```

Run MongoDB locally on `mongo://localhost:27017` :

```
mongod
```

Then you can simply run the app with:

```
npm start
```

The App will run on `http://localhost:3000`

You can send HTTP request with [Postman](https://www.getpostman.com/apps).

The application serves data on `'/'` and `'/page=:pageNumber'` routes.


Additionally I deployed the application on [Heroku](https://nodejs-test-assignment.herokuapp.com/), whereas database deployed on MongoDB Atlas cloud.

You can navigate in browser, e.g.:
```
https://nodejs-test-assignment.herokuapp.com/page=9
``` 
or send request with Postman to this endpoint.



Technology stack applied in the project:
- Node.js
- Express
- MongoDB
- Mongoose
- ESLint
- Babel

And I have used ES6+ JS as much as I can.
