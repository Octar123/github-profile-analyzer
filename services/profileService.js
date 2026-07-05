import { profileRepository } from "../repositories/profileRespository.js";
import axios from "axios";

class ProfileService {

    apiUrl = "https://api.github.com/users";

    githubConfig = process.env.GITHUB_TOKEN 
    ? { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
    : {};

    async getAndinsertInfo(username){

        let errorFlag = false;

        if(!username){
            return null;
        }

        try{
            const profileUrl = `${this.apiUrl}/${username}`;

            const githubResponse = await axios.get(profileUrl, this.githubConfig).catch((reason) => {
                errorFlag = true;
            });
            if(errorFlag){
                return null;
            }
            const responseData = githubResponse.data;

            const reposUrl = `${this.apiUrl}/${username}/repos?per_page=100`;
            const reposResponse = await axios.get(reposUrl, this.githubConfig);
            if(errorFlag){
                return null;
            }
            const reposData = reposResponse.data;

            const languageCount = {};

            reposData.forEach(repo => {
                if(repo.language){
                    languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
                }
            });


            let topLanguages = Object.entries(languageCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(entry => entry[0]);


            const profile = {
                id: responseData.id,
                username: responseData.login,
                display_name: responseData.name,
                avatar_url: responseData.avatar_url,
                html_url: responseData.html_url,
                email: responseData.email,
                company: responseData.company,
                location: responseData.location,
                bio: responseData.bio,
                public_repos: responseData.public_repos,
                public_gists: responseData.public_gists,
                followers: responseData.followers,
                following: responseData.following,
                top_languages: topLanguages,
                profile_created_at: new Date(responseData.created_at)
            };

            const response = await profileRepository.insertInfo(profile);

            if(!response){
                return null;
            }
            return response;

        }catch(err){
            console.error("Error while getting and adding info in service layer: ", err);
            return null;
        }
    }

    async getAllProfiles() {
        const response = await profileRepository.getAllProfiles();

        if(!response){
            return null;
        }

        return response;
    }

    async getProfileByUsername(username){

        if(!username){
            return null;
        }

        const response = await profileRepository.getProfileByUsername(username);

        if(!response){
            return null;
        }

        return response;
    }
}

export const profileService = new ProfileService();