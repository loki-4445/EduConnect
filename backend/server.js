// Import express module
const exp = require('express');
const app = exp(); // app contains express application object

// Import environment variables
require('dotenv').config();

// Middleware
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

// Import MongoClient
const { MongoClient } = require('mongodb');

// Create MongoClient object
let mongoclient = new MongoClient(process.env.DB_URL);

// Connect to MongoDB server
mongoclient.connect().then((connectionObj) => {
    console.log("DB CONNECTION SUCCESS!");

    // Connect to the database
    const db = connectionObj.db('acacon-db');

    // Connect to collections
    const usersCollection = db.collection('users');
    const examCollection = db.collection('exam-corner');
    const eventsCollection = db.collection('events');
    const postsCollection = db.collection('student-corner');

    // Share collection objects with the API
    app.set('usersCollection', usersCollection);
    app.set('examCollection', examCollection);
    app.set('eventsCollection', eventsCollection);
    app.set('postsCollection', postsCollection);

    // Start the HTTP server if DB connection has succeeded
    app.listen(process.env.PORT, () => console.log("HTTP server started at port 4000"));
}).catch((err) => {
    console.log("Error in DB Connection : ", err);
});

// Import userApp
const userApp = require('./APIs/userAPI');
app.use('/user-api', userApp);

const examApp = require('./APIs/examAPI');
app.use('/exam-api', examApp);

const eventsApp = require('./APIs/eventsAPI');
app.use('/events-api', eventsApp);
// Connect to collections
const coursesCollection = db.collection('courses');
app.set('coursesCollection', coursesCollection);

// Import courseApp
const courseApp = require('./APIs/courseAPI');
app.use('/course-api', courseApp);

 

const studentCornerApp = require('./APIs/student-cornerAPI');
app.use('/student-corner-api', studentCornerApp);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send({ message: "An error occurred: ", errorMessage: err.message });
});
 