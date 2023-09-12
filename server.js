const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static('public'));

// API proxy for Yelp Fusion, key is valid for 48h
const apiKey = 'UgS-vAyFni6-DJ-J5HGFdP1pdkfZ_u_7znlmoNTqa1UNXEc24nb01P3xdacI3113NQsfjQjUwjrTYuDNleePwqZsNd-B8t0iss-IvZL7JRm-B-S-DBJ6cl_BjsgAZXYx';
const yelpApiBaseUrl = 'https://api.yelp.com/v3/businesses';

app.get('/api/business/search', async (req, res, next) => {
  try {
    const { term, location } = req.query;
    const response = await axios.get(`${yelpApiBaseUrl}/search`, {
      params: { term, location },
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Checks the content type
    if (response.headers['content-type'].includes('application/json')) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: 'Received a non-JSON response from Yelp API' });
    }
  } catch (error) {
    next(error); 
  }
});

app.get('/api/business/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${yelpApiBaseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    
    if (response.headers['content-type'].includes('application/json')) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: 'Received a non-JSON response from Yelp API' });
    }
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.response?.status || 500).json({ error: err.message || 'An error occurred' });
});

// Server should be on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
