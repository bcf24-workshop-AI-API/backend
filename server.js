const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Load the YOLO model
let yoloModel;

async function loadModel() {
    yoloModel = await tf.loadGraphModel('file://path/to/yolo11n_web_model/model.json');
}

// Endpoint for object detection
app.post('/detect', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = fs.readFileSync(req.file.path);
        const tfImage = tf.node.decodeImage(imageBuffer);
        const inputTensor = tfImage.expandDims(0); // Add batch dimension

        const predictions = await yoloModel.executeAsync(inputTensor);
        
        // Process predictions (Assuming predictions are in a specific format)
        // Here you would typically extract bounding boxes and class labels from predictions
        const results = predictions[0].arraySync(); // Adjust based on your model's output

        res.json({ detections: results });
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Load the model when the server starts
loadModel().then(() => {
    console.log('YOLO model loaded');
});