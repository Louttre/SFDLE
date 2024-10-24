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
export const selectWillItKillOfTheDay = async () => {
    try {
      // Fetch the existing document
      let willItKillDoc = await WillItKillOfTheDayModel.findOne();
  
      // If no document exists, create one
      if (!willItKillDoc) {
        willItKillDoc = new WillItKillOfTheDayModel();
      }
  
      // Get total number of videos
      const totalVideos = await WillItKillModel.countDocuments();
  
      // Initialize prevvideos if undefined
      if (!willItKillDoc.prevvideos) {
        willItKillDoc.prevvideos = [];
      }
  
      // Check if all videos have been used
      if (willItKillDoc.prevvideos.length >= totalVideos) {
        willItKillDoc.prevvideos = []; // Reset the previous videos
      }
  
      // Fetch videos not in prevvideos
      const availableVideos = await WillItKillModel.find({
        _id: { $nin: willItKillDoc.prevvideos },
      });
  
      // No available videos
      if (availableVideos.length === 0) {
        throw new Error('No available videos to select.');
      }
  
      // Select a random video
      const randomVideo =
        availableVideos[Math.floor(Math.random() * availableVideos.length)];
  
      // Update the document with the new video
      willItKillDoc.video_id = randomVideo._id;
  
      // Add selected video to prevvideos
      willItKillDoc.prevvideos.push(randomVideo._id);
  
      // Update the date (optional)
      willItKillDoc.date = new Date();
  
      // Save the document
      await willItKillDoc.save();
  
      console.log('Will It Kill of the day updated successfully.');
  
    } catch (error) {
      console.error('Error selecting Will It Kill of the day:', error);
    }
  };

  export const getWillItKillOfTheDay = async (req, res) => {
    try {
      // Fetch the existing document
      const willItKillDoc = await WillItKillOfTheDayModel.findOne();
  
      if (!willItKillDoc || !willItKillDoc.video_id) {
        return res.status(404).json({ message: 'Will It Kill of the day not found.' });
      }
  
      // Fetch the video details
      const video = await WillItKillModel.findById(willItKillDoc.video_id);
  
      res.json(video);
    } catch (error) {
      console.error('Error fetching Will It Kill of the day:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  