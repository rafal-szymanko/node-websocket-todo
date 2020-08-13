const express = require('express');
const app = express();
const port = 8000;
const path = require('path');


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})