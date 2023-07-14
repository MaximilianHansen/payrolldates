const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors())

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send({"text" : 'Hello client!'});
  });

app.post('/email', (req, res) => {
    console.log(req.body);
    res.send({"text" : 'Hello Client!'});
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });



  
  
  