let exp = require("express");
let examApp = exp.Router();


examApp.use(exp.json());


examApp.get('/syllabus', async (req, res) => {
    try {
        const examCollection = req.app.get('examCollection');
        const syllabusData = await examCollection.find({}).toArray();

        const syllabuses = syllabusData.map(item => ({
            subjectName: item.subjectName, 
            syllabus: item.syllabus 
        })).filter(item => item.syllabus);

        res.status(200).json(syllabuses);
    } catch (error) {
        console.error("Error fetching syllabus data:", error);
        res.status(500).json({ message: "Failed to fetch syllabus data" });
    }
});


examApp.get('/pyqs', async (req, res) => {
    try {
        const examCollection = req.app.get('examCollection');
        const pyqsData = await examCollection.find({}).toArray();

        const pyqs = pyqsData.map(item => ({
            subjectName: item.subjectName, 
            pyqs: item.pyqs 
        })).filter(item => item.pyqs); 

        res.status(200).json(pyqs);
    } catch (error) {
        console.error("Error fetching PYQs data:", error);
        res.status(500).json({ message: "Failed to fetch PYQs data" });
    }
});


examApp.get('/tutorials', async (req, res) => {
    try {
        const examCollection = req.app.get('examCollection'); 
        const tutorialsData = await examCollection.find({}).toArray();

        const tutorials = tutorialsData.map(item => ({
            subjectName: item.subjectName, 
            tutorials: item.tutorials || [] 
        })).filter(item => item.subjectName && item.tutorials.length > 0); 

        res.status(200).json(tutorials);
    } catch (error) {
        console.error("Error fetching tutorials data:", error);
        res.status(500).json({ message: "Failed to fetch tutorials data" });
    }
});


module.exports = examApp;
