const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./api/routes/index');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({origin: '*',credentials: true}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// console.log("Serving static uploads from:", path.join(__dirname, "uploads"));

app.use("/",userRoutes);

module.exports = app.listen(PORT, () => {
    console.log('server running on port 8080!');
});
