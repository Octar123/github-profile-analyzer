import express from 'express';
import { profileService } from '../services/profileService.js';

const router = express.Router();

router.post('/analyze/:username', async (req, res) => {

    const {username} = req.params;

    if(!username){
        return res.status(400).json({success: false, message: "Username parameter is required"});
    }

    const response = await profileService.getAndinsertInfo(username);

    if(!response){
        return res.status(404).json({
            success: false,
            message: `Profile with username:- ${username} not found.`
        })
    }

    return res.status(200).json({
        success: true,
        message: "Profile successfully analyzed and saved",
        data: response
    });
});

router.get('/profiles', async (req, res) => {
    const response = await profileService.getAllProfiles();

    if(!response){
        return res.status(400).json({success: false, message: "No profiles found"});
    }

    return res.status(200).json({
        success: true,
        count: response.length,
        data: response
    })
});

router.get('/profiles/:username', async (req, res) => {

    const {username} = req.params;

    if(!username){
        return res.status(400).json({success: false, message: "Username parameter is required"});
    }

    const response = await profileService.getProfileByUsername(username);

    if(!response){
        return res.status(400).json({success: false, message: "No profile found"});
    }

    return res.status(200).json({
        success: true,
        data: response
    })
});

export default router;