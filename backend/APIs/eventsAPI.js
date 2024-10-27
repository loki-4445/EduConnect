
let exp = require("express");
let eventsApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');

eventsApp.use(exp.json());

eventsApp.get('/events', expressAsyncHandler(async (req, res) => {
  try {
    const eventsCollection = req.app.get('eventsCollection');
    const events = await eventsCollection.find().toArray();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching events", error: error.message });
  }
}));



module.exports = eventsApp;
