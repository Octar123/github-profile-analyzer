# GitHub Profile Analyzer

A Node.js/Express REST API that fetches a GitHub user's public profile and repository data, computes their top programming languages, and stores the analyzed result in a MySQL database for later retrieval.

## Features

- Fetch a GitHub user's profile via the GitHub REST API
- Aggregate the user's repositories to determine their top 3 most-used languages
- Persist (insert or update) the analyzed profile in MySQL
- Retrieve all previously analyzed profiles
- Retrieve a single analyzed profile by username
- Auto-creates the required database and table on startup

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** [Express](https://expressjs.com/) 5
- **Database:** MySQL (via `mysql2/promise`)
- **HTTP Client:** [Axios](https://axios-http.com/) (used to call the GitHub API)
- **Config:** [dotenv](https://github.com/motdotla/dotenv)

## Project Structure

```
github-profile-analyzer/
├── config/
│   ├── db.js          # MySQL connection pool setup
│   └── initDb.js       # Creates the database/table on startup
├── repositories/
│   └── profileRespository.js   # Data-access layer (SQL queries)
├── routes/
│   └── profileRoutes.js        # API route definitions
├── services/
│   └── profileService.js       # Business logic (GitHub API calls, language aggregation)
├── server.js           # App entry point
├── package.json
└── .gitignore
```

## Prerequisites

- Node.js (v18+ recommended)
- A running MySQL server
- (Optional) A [GitHub personal access token](https://github.com/settings/tokens) to increase the GitHub API rate limit

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Octar123/github-profile-analyzer.git
   cd github-profile-analyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   PORT=3000

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=github_profile_analyzer

   # Optional, increases GitHub API rate limits
   GITHUB_TOKEN=your_github_personal_access_token
   ```

4. **Run the server**

   ```bash
   # Production
   npm start

   # Development (auto-restart with nodemon)
   npm run dev
   ```

   On startup, the app connects to MySQL and automatically creates the database and `analyzed_profiles` table if they don't already exist.

## API Reference

All endpoints are prefixed with `/api/v1`.

### Analyze a GitHub profile

```
POST /api/v1/analyze/:username
```

Fetches the given GitHub user's profile and repositories, computes their top languages, and saves/updates the result in the database.

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/analyze/octocat
```

**Response**

```json
{
  "success": true,
  "message": "Profile successfully analyzed and saved",
  "data": {
    "id": 583231,
    "username": "octocat",
    "display_name": "The Octocat",
    "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
    "html_url": "https://github.com/octocat",
    "public_repos": 8,
    "public_gists": 8,
    "followers": 18000,
    "following": 9,
    "top_languages": ["Ruby", "JavaScript", "CSS"],
    "profile_created_at": "2011-01-25T18:44:36.000Z"
  }
}
```

### Get all analyzed profiles

```
GET /api/v1/profiles
```

Returns every profile that has been analyzed so far, most recently analyzed first.

### Get a specific analyzed profile

```
GET /api/v1/profiles/:username
```

Returns the stored analysis for a single username.

## Database Schema

The `analyzed_profiles` table stores:

| Column | Type | Description |
|---|---|---|
| `id` | INT (PK) | GitHub user ID |
| `username` | VARCHAR(40) | GitHub username (unique) |
| `display_name` | VARCHAR(150) | User's display name |
| `avatar_url` | VARCHAR(255) | Avatar image URL |
| `html_url` | VARCHAR(255) | GitHub profile URL |
| `email` | VARCHAR(254) | Public email, if set |
| `company` | VARCHAR(255) | Company, if set |
| `location` | VARCHAR(255) | Location, if set |
| `bio` | TEXT | User bio |
| `public_repos` | INT | Number of public repos |
| `public_gists` | INT | Number of public gists |
| `followers` | INT | Follower count |
| `following` | INT | Following count |
| `top_languages` | JSON | Top 3 languages by repo count |
| `profile_created_at` | TIMESTAMP | When the GitHub account was created |
| `analyzed_at` | TIMESTAMP | When the profile was last analyzed/updated |

## License

ISC