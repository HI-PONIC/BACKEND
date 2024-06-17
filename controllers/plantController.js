const Plant = require('../models/plantModel');
const uploadImage = require('../services/bucket_upload');
exports.addPlant = async (req, res) => {
    try {
        const { name, date_added } = req.body;
        const image = req.file ? req.file.buffer : null;
        const user_id = req.user.id; // Retrieve user ID from authenticated user
        console.log('User ID:', user_id);

        // Check if required fields are provided
        if (!name || !date_added) {
            return res.status(400).json({
                error: true,
                message: 'Name and date_added are required',
                plant: null
            });
        }

        //upload image and get the url
        const imageURL = await uploadImage(req.file);
        //console.log(imageURL);
        // Create the plant
        const plant = await Plant.create(name, date_added, imageURL, user_id);
        //const plant = await Plant.create(name, date_added, image, user_id);

        // Respond with the created plant
        res.status(201).json({
            error: false,
            message: 'Plant added successfully',
            plant: {
                id: plant.id,
                name: plant.name,
                date_added: plant.date_added,
                image: plant.image,
                user_id: plant.user_id
            }
        });
    } catch (error) {
        console.error(`Error adding plant: ${error.message}`);
        res.status(500).json({
            error: true,
            message: 'Failed to add plant',
            plant: null
        });
    }
};

exports.updatePlant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date_added } = req.body;
        const image = req.file ? req.file.buffer : null;
        const user_id = req.user.id; // Retrieve user ID from authenticated user

        // Check if required fields are provided
        if (!name || !date_added) {
            return res.status(400).json({
                error: true,
                message: 'Name and date_added are required',
                plant: null
            });
        }

        // Update the plant
        const updatedPlant = await Plant.update(id, name, date_added, image, user_id);
        
        // Respond with the updated plant
        res.status(200).json({
            error: false,
            message: 'Plant updated successfully',
            plant: updatedPlant
        });
    } catch (error) {
        console.error(`Error updating plant: ${error.message}`);
        res.status(500).json({
            error: true,
            message: 'Failed to update plant',
            plant: null
        });
    }
};

exports.deletePlant = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the plant belongs to the authenticated user
        const plant = await Plant.delete(id);
        if (!plant || plant.user_id !== req.user.id) {
            return res.status(403).json({
                error: true,
                message: 'You can only delete your own plants',
                plant: null
            });
        }

        await Plant.delete(id);
        res.status(200).json({
            error: false,
            message: 'Plant deleted successfully',
            plant: { id }
        });
    } catch (error) {
        console.error(`Error deleting plant: ${error.message}`);
        res.status(500).json({
            error: true,
            message: error.message,
            plant: null
        });
    }
};

exports.getPlantsByUser = async (req, res) => {
    try {
        const user_id = req.user.id;
        
        // Fetch plants by user_id
        const plants = await Plant.findByUserId(user_id);
        
        // Include user_id in the response
        const plantsWithUserId = plants.map(plant => ({
            ...plant,
            user_id: user_id
        }));
        console.log(plantsWithUserId);
        // Respond with the plants
        res.status(200).json({
            error: false,
            message: 'Plants retrieved successfully',
            plants: plantsWithUserId
        });
    } catch (error) {
        console.error(`Error getting plants by user: ${error.message}`);
        res.status(500).json({
            error: true,
            message: error.message,
            plants: null
        });
    }
};