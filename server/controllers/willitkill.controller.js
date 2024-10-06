import { WillItKillModel } from "../models/willitkill.model.js";
import { WillItKillOfTheDayModel } from "../models/willitkilloftheday.model.js";


export const getVideoId = async (req, res) => {
    const videoidoftheday = await WillItKillOfTheDayModel.findOne();
    const videooftheday = await WillItKillModel.findById(videoidoftheday.video_id);
    res.json(videooftheday.video_id)
}

export const killornot = async (req, res) => {
    const videoidoftheday = await WillItKillOfTheDayModel.findOne();
    const killornot = await WillItKillModel.findById(videoidoftheday.video_id);

    res.json(killornot.answer)
}

export const getAnswer = async (req, res) => {
    const { answer } = req.body;
    const videoidoftheday = await WillItKillOfTheDayModel.findOne();
    const videooftheday = await WillItKillModel.findById(videoidoftheday.video_id);

    answer === videooftheday.answer ? res.json(true) : res.json(false)
}

// Define the Will It Kill of the Day function
export const getWillItKillOfTheDay = async (req, res) => {
    try {
        // Check for the Will It Kill of the Day document
        let willItKillOfTheDay = await WillItKillOfTheDayModel.findOne({}); // Adjust the query as needed

        // total number of videos (this assumes you have a separate video model or collection)
        const totalVideos = await WillItKillModel.countDocuments();

        // If no document exists, create a new one
        if (!willItKillOfTheDay) {
            willItKillOfTheDay = new WillItKillOfTheDayModel();
        }

        // Check if all video IDs have been selected
        if (willItKillOfTheDay.prevvideos && willItKillOfTheDay.prevvideos.length >= totalVideos) {
            willItKillOfTheDay.prevvideos = []; // Reset the previous videos if all have been selected
        }

        // Fetch videos that are not in prevVideos
        const availableVideos = await WillItKillModel.find({
            _id: { $nin: willItKillOfTheDay.prevvideos }
        });

        // No available videos
        if (availableVideos.length === 0) {
            return res.status(400).json({ message: "No available videos." });
        }

        // Select a random video
        const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];

        // Update willItKillOfTheDay with the new video
        willItKillOfTheDay.video_id = randomVideo._id; // Update the video_id field
        willItKillOfTheDay.prevvideos = willItKillOfTheDay.prevvideos || []; // Ensure prevVideos is initialized
        willItKillOfTheDay.prevvideos.push(randomVideo._id); // Add to the previous video array

        await willItKillOfTheDay.save(); // Save the updated document

        // Return the Will It Kill of the Day
        return res.json(randomVideo);
    } catch (error) {
        console.error('Error selecting Will It Kill of the Day:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
