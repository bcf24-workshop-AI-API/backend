const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const cors = require('cors');
const Jimp = require('jimp'); // For image processing
const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors(
    {
        origin: '*', // adjust based on your requirements
    }
));

//Express Middleware
app.use(express.json())

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });


// Load the YOLO model
let yoloModel;

async function loadModel() {
    yoloModel = await tf.loadGraphModel('yolo11n.pt');
}

// Endpoint for object detection
app.post('/detect', upload.single('image'), async (req, res) => {
    try {
        // Load the model
        const model = await tf.loadGraphModel('file://public/model.json');

        // Load and preprocess the image using Jimp
        const image = await Jimp.read(req.file.path);
        const resizedImage = image.resize(640, 640); // Resize to model input size

        // Convert image to tensor
        const inputTensor = tf.tensor4d(
            resizedImage.bitmap.data,
            [1, resizedImage.bitmap.height, resizedImage.bitmap.width, 4]
        ).div(255); // Normalize pixel values

        // Run inference
        const predictions = await model.predict(inputTensor).array();

        // Clean up uploaded file
        fs.unlinkSync(req.file.path); // Remove the uploaded file

        // Send back predictions as response
        res.json(predictions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the image');
    }
});


app.get('/bcf', (req, res) => {
    res.send('Hello from BUET CSE FEST!');
});

app.get('/formatted', (req, res) => {
    // database call or other logic, computation, etc.


    // send json formatted response
    res.json({
        message: 'Hello from BUET CSE FEST!',
        date: new Date()
    });
});

app.post('/welcome', async (req, res) => {
    console.log(req.body);

    // send json formatted response
    res.json({
        message: `Hello ${req.body.name} from BUET CSE FEST!`,
    });
    
});

// LLM integration
// https://platform.openai.com/docs/guides/text-generation/quickstart
app.post('/chat/gpt', async (req, res) => {
    try {
        // Make an API call to the OpenAI chat completion endpoint
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo", // Make sure to use the correct model name
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: req.body.prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Log the full response data
        console.log('OpenAI API Response:', JSON.stringify(response.data, null, 2));

        // Extract the message content and send back to the client
        const messageContent = response.data.choices[0].message.content;
        res.json({ message: messageContent });

    } catch (error) {
        // Log the error details
        console.error('Error with OpenAI API:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        // Send a 500 Internal Server Error response to the client
        res.status(500).json({ error: 'Failed to fetch response from OpenAI', details: error.message });
    }
});

app.post('/chat/ollama', async (req, res) => {
    const { prompt } = req.body;
    try {
        // Make an API call to the OpenAI chat completion endpoint
        const response = await axios.post('http://localhost:11434/api/chat', {
            model: "llama3.2", // Make sure to use the correct model name
            "messages": [
                {
                "role": "user",
                "content": prompt
                }
            ],
            "stream": false
        });

        // Log the full response data
        console.log('Response:', JSON.stringify(response.data, null, 2));

        // Extract the message content and send back to the client
        const messageContent = response.data.message.content;
        res.json({ message: messageContent });

    } catch (error) {
        console.log('Error:', error);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Load the model when the server starts
// loadModel().then(() => {
//     console.log('YOLO model loaded');
// });