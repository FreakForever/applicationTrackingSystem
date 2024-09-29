const axios = require('axios');
const dotenv = require('dotenv');
const pdfParse = require('pdf-parse'); // For extracting text from PDF
const Match = require('/Users/ashwin.s/Desktop/Application/ats-ml/src/Backend/models/matchModels.js'); // Adjust path if needed

dotenv.config(); // Load environment variables

// Function to pause execution for a specified time (in milliseconds)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to get OpenAI API response using Axios with retry logic
const getOpenAIResponse = async (input) => {
  const apiKey = process.env.OPENAI_API_KEY; // API key from .env
  let retries = 3; // Retry up to 3 times

  while (retries > 0) {
    try {
      // Making the POST request to OpenAI API using Axios
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'gpt-3.5-turbo',
          prompt: input,
          max_tokens: 500, // Set token limit based on your requirements
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`, // Pass the API key in the header
          },
        }
      );

      return response.data.choices[0].text;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If rate limit error, wait and retry
        console.warn('Rate limit hit, retrying...');
        await sleep(2000); // Wait 2 seconds before retrying
        retries--;
      } else {
        console.error('Error fetching response from OpenAI:', error.message);
        throw new Error('Error fetching response from OpenAI: ' + error.message);
      }
    }
  }

  throw new Error('Exceeded retry limit for OpenAI requests.');
};

// Function to parse the uploaded PDF
const inputPdfText = async (uploadedFile) => {
  const dataBuffer = uploadedFile.buffer; // Use the buffer directly
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text; // Extracted text from the resume PDF
};

// Process resume and job matching
exports.processResume = async (req, res) => {
  const jobDescription = req.body.job_description;

  // Access the uploaded file
  const uploadedFile = req.file;

  // Validate input
  if (!jobDescription || !uploadedFile) {
    return res.status(400).json({ error: 'Missing job description or resume' });
  }

  try {
    // Extract text from the uploaded PDF
    const resumeText = await inputPdfText(uploadedFile);

    // Prepare the input prompt for OpenAI
    const inputPromptsTemplate = `
      Evaluate the resume based on the given job description and provide a match percentage and key details.

      Resume: ${resumeText}
      Job Description: ${jobDescription}

      Please respond in JSON format with the fields: 
      {
        "match_percentage": "",
        "highlighted_resume": "",
        "suggestions": {}
      }
    `;

    // Get the response from OpenAI
    const openaiResponse = await getOpenAIResponse(inputPromptsTemplate);

    // Parse the JSON response from OpenAI
    let openaiParsed;
    try {
      openaiParsed = JSON.parse(openaiResponse);
    } catch (parseError) {
      console.error('Error parsing OpenAI API response:', parseError.message);
      return res.status(500).json({ error: 'Error parsing OpenAI API response.' });
    }

    // Save match result in MongoDB
    const match = new Match({
      jobId: req.body.jobId,
      resumeId: req.body.resumeId,
      matchPercentage: openaiParsed.match_percentage,
      highlightedResume: openaiParsed.highlighted_resume,
      suggestions: openaiParsed.suggestions,
    });

    await match.save();

    // Send the match result as a response
    return res.status(201).json(match);
  } catch (error) {
    console.error('Error processing resume:', error.message);
    return res.status(500).json({ error: 'Error processing resume: ' + error.message });
  }
};
