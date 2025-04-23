const express = require('express')
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;
const schoolRoutes = require('./routes/school'); 

app.use(express.json());

app.get("/" , (req,res) => {
    res.json({
        message : "Welcome to School API , I am Aashir Haris"
    })
})

app.use('/api' , schoolRoutes);


app.listen(PORT , () => {
    console.log("Server is running on port" , PORT )
})

export default app