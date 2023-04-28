const express   = require('express');
const app       = express();
const router    = require('./src/routes/index');
const port      = process.env.PORT || 3000

app.use(express.json())
app.use('/', router);

app.listen(port, () => {
    console.log('Server Started at 3000');
})