import pool from "../config/db.js";

class ProfileRepository {

    async insertInfo(profile){
        try{

            const query = `
            INSERT INTO \`${process.env.DB_NAME}\`.analyzed_profiles (
                id, username, display_name, avatar_url, html_url,
                email, company, location, bio,
                public_repos, public_gists, followers, following,
                top_languages, profile_created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                display_name = VALUES(display_name),
                avatar_url = VALUES(avatar_url),
                html_url = VALUES(html_url),
                email = VALUES(email),
                company = VALUES(company),
                location = VALUES(location),
                bio = VALUES(bio),
                public_repos = VALUES(public_repos),
                public_gists = VALUES(public_gists),
                followers = VALUES(followers),
                following = VALUES(following),
                top_languages = VALUES(top_languages);
                `;
                
                const values = [
                    profile.id,
                    profile.username,
                    profile.display_name,
                    profile.avatar_url,
                    profile.html_url,
                    profile.email,
                    profile.company,
                    profile.location,
                    profile.bio,
                    profile.public_repos || 0,
                    profile.public_gists || 0,
                    profile.followers || 0,
                    profile.following || 0,
                    JSON.stringify(profile.top_languages), 
                    profile.profile_created_at ? new Date(profile.profile_created_at) : null
                ];

                
                const [result] = await pool.query(query, values);

                const response = await this.getProfileByUsername(profile.username);
                return response;
            }catch(err){
                console.error("Error while adding info to database: ", err);
                return;
            }
    }

    async getAllProfiles() {
        try{
            const query = `
                SELECT * FROM \`${process.env.DB_NAME}\`.analyzed_profiles ORDER BY analyzed_at DESC
            `;

            const rows = await pool.query(query);

            return rows[0];
        }catch(err){
            console.error("Error while fetching the profiles: ", err);
        }
    }

    async getProfileByUsername(username) {
        try{
            const query = `
                SELECT * FROM \`${process.env.DB_NAME}\`.analyzed_profiles WHERE username = ?
            `;

            const rows = await pool.query(query, [username]);


            return rows[0][0] || null;
        }catch(err){
            console.error("Error while fetching the profiles: ", err);
        }
    }
}

export const profileRepository = new ProfileRepository();