import Admin from '../models/admin-model.js';
import mongoose from 'mongoose'; // Adjust the path as needed
const adminCltr={}
// Create a new content


// Create a new content with image/video upload
adminCltr.createAdminContent = async (req, res) => {
    try {
        const { contentName } = req.body;
        
        // Fix the file path assignment using template literals
        const file = req.file ? `/uploads/${req.file.filename}` : undefined;

        if (!file) {
            return res.status(400).json({ error: 'File upload failed' });
        }

        console.log('File saved at:', file); // Log the file path

        const newContent = new Admin({
            contentName,
            image: file // Save file path
        });

        await newContent.save();
        return res.status(201).json({ message: 'Content created successfully', content: newContent });
    } catch (error) {
        console.error('Error creating content:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};



// Update an existing content entry by ID, with optional image/video upload
adminCltr.updateAdminContent = async (req, res) => {
    const { id } = req.params;
    const { contentName } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : undefined; // Extract uploaded file if exists

    try {
        // Find the content entry by ID and update it
        const updatedContent = await Admin.findByIdAndUpdate(
            id,
            {
                contentName,
                image: file || req.body.image
            },
            { new: true }
        );
        

        if (!updatedContent) {
            return res.status(404).json({ error: 'Content not found' });
        }

        return res.status(200).json({ message: 'Content updated successfully', content: updatedContent });
    } catch (error) {
        console.error("Error updating content:", error);
        console.error("Error updating content:", error.message, error.stack);
        console.log("Updating content with id:", id);

        return res.status(500).json({ error: 'Server error' });
    }
};

// Get all content entries
adminCltr.getAllAdminContent = async (req, res) => {
    try {
        const contentList = await Admin.find(); // Fetch all content
        return res.status(200).json(contentList); // Return as JSON
    } catch (error) {
        console.error("Error fetching content:", error);
        return res.status(500).json({ error: 'Server error' });
    }
};


// Get a single content entry by ID


adminCltr.getAdminContentById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid content ID' });
    }

    try {
        const content = await Admin.findById(id);
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        return res.status(200).json(content);
    } catch (error) {
        console.error("Error fetching content by ID:", error);
        return res.status(500).json({ error: 'Server error' });
    }
};



// Update an existing content entry by ID


// Delete a content entry by ID
adminCltr.deleteAdminContent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContent = await Admin.findByIdAndDelete(id);

        if (!deletedContent) {
            return res.status(404).json({ error: 'Content not found' });
        }

        return res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error("Error deleting content:", error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export default adminCltr
