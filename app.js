const express = require('express');
const app = express();
const port = 3003;

const server = app.listen(port, () => console.log("Server listening on port " + port));