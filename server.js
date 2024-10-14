const express = require('express');
const fs = require('fs');
const cors = require('cors');
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


// basic API endpoints
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

    const { name } = req.body;

    // send json formatted response
    res.json({
        message: `Hello ${name} from BUET CSE FEST!`,
    });
    
});



// LLM integration
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

        const response = await axios.post('http://localhost:11434/api/chat', {
            model: "llama3.2", // Make sure to use the correct model name
            "messages": [
                {
                "role": "user",
                "content": prompt
                }
            ],
            // temperature: 0.5,
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

app.post('/detect/ollama', async (req, res) => {
    const { imgPath } = req.body;
    // Read the image file as a binary buffer
    const imageBuffer = fs.readFileSync(imgPath);
    // Encode the image buffer as a Base64 string
    const imageBase64 = imageBuffer.toString('base64');

    try {

        const output = await axios.post('http://localhost:11434/api/generate', {
            "model": "llava",
            "prompt":"How many people are in the picture?",
            "images": [imageBase64],
            "stream": false
        });

        res.json({ message: output.data.response });

    } catch (error) {
        console.log('Error:', error);
    }
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
