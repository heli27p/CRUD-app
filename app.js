const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

let authToken = '';

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  const url = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';

  try {
    const response = await axios.post(url, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
      },
    });

    authToken = response.data.access_token;

    res.json(response.data);
  } catch (error) {
    console.error('Proxy request failed:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get_customer_list', async (req, res) => {
  try {
    const response = await axios.get('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Direct request failed:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/delete_customer/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const response = await axios.post(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${uuid}`, null, {
      headers: {
        'Authorization': 'Bearer dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=',
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error deleting customer:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/create_data', async (req, res) => {
  try {
    const response = await axios.post('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create', req.body, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1; JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error creating data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/update_customer/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  const url = `https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${uuid}`;

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Cookie': 'JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1; JSESSIONID=7C611C611ED02F5CE7239F0CBB0177D1',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, req.body, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error updating customer data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.options('*', cors());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
