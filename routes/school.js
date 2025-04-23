const express = require('express');
const router = express.Router();
const db = require('../db');

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const toRad = (angle) => (Math.PI / 180) * angle;
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance;
  }



const { body, validationResult, matchedData } = require('express-validator');

const userValidationRules = () => {
    return [
        body('name').isString(),
        body('address').isString(),
        body('latitude').isFloat(),
        body('longitude').isFloat()
    ]
}

// Add School 
router.post('/addSchool' , userValidationRules() ,async (req,res) => {
    console.log("hello")
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors : errors.array()
        })
    }

    const validatedData = matchedData(req);
    // console.log(validatedData)
    const {name , address , latitude , longitude} = validatedData;

    // console.log(name , address ,latitude , longitude)

    try {

       const [result] = await db.execute('INSERT INTO schools (name , address , latitude , longitude) VALUES (? ,? , ? ,?)' , [name , address , latitude , longitude]) 
        
       res.status(201).json({message : "School added successfully!" , schoolId :result.insertId });
    } catch (err) {
        res.status(500).json({error : 'Database Error' , message : err.message})
        
    }

})


router.get('/listSchools' , async (req , res) => {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if(isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({
            message : "Valid latitude and longitude are required"
        })
    }

    try {
        const [schools] = await db.execute("SELECT * FROM schools")

        const sortedSchools = schools
        .map((school) => ({
            ...school,
            distance : `${Math.trunc(haversineDistance(userLat , userLon , school.latitude , school.longitude))} km`
        }))
        .sort((a,b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        res.status(500).json({error : "Database error " , message : error.message})
    }
})

module.exports = router;