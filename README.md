# SFDLE - Street Fighter Daily Guessing Game

<p align="center">
  <img src="client/public/img/logo.png" alt="SFDLE Logo" width="100" height="100">
</p>

SFDLE is an interactive online trivia game designed for fans of fighting games, particularly the iconic Street Fighter series. Inspired by popular daily guessing games like Wordle and Loldle, SFDLE challenges players with a variety of game modes, including character guessing, blind tests, video-based trivia, and much more. The project aims to bring the excitement of fighting games to fans in a new and engaging way, encouraging community interaction through leaderboards and achievements.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contribution](#contribution)
- [License](#license)

## Features
- **Daily Character Guessing Game**: Inspired by games like Wordle, but dedicated to Street Fighter characters.
- **Multiple Game Modes**: Character guessing, video trivia, blind tests, and more.
- **Leaderboard System**: Compete against other players with a leaderboard tracking total points.
- **Achievements**: Earn points and badges by completing specific challenges.
- **Community Focused**: Built to engage and celebrate the Fighting Game Community (FGC).

## Technologies Used
### Languages
- **JavaScript**: Used for both backend and frontend.

### Frontend
- **React**: Used to build an interactive user interface.
- **Zustand**: State management tool for managing the game state across components.
- **Framer Motion**: Adds animations to enhance the user experience.

### Backend
- **Node.js & Express**: Handles the server-side logic and API endpoints.
- **MongoDB with Mongoose**: Stores user data, achievements, and game questions.

### Other Tools
- **CSS**: Styling for consistent user experience.
- **JWT (JSON Web Token)**: Authentication for securing routes.

## Project Structure
The project is divided into two main parts: the client and the server.
```
SFDLE/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── App.js
│   │   ├── index.js
│   └── ...
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
└── ...
```
### Client
- **Components**: Reusable UI components.
- **Pages**: Complete views such as the Home, Leaderboard, and Game pages.
- **Store**: Zustand stores for managing the application state.

### Server
- **Controllers**: Logic to handle API requests.
- **Models**: Database schemas for users, characters, achievements, and more.
- **Routes**: Define the server endpoints for the application.

## Installation & Setup
### Prerequisites
- **Node.js** (v14+)
- **MongoDB**
- **npm** (comes with Node.js) or **yarn**

### Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/SFDLE.git
   ```
2. **Install Dependencies**
   Navigate to both the `client` and `server` directories to install dependencies.
   ```sh
   cd SFDLE/client
   npm install
   ```
   ```sh
   cd SFDLE/server
   npm install
   ```
3. **Set Up Environment Variables**
   Create a `.env` file in the `server` directory and fill in the following variables:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. **Run the Server and Client**
   Start the backend server:
   ```sh
   cd SFDLE/server
   npm start
   ```
   Start the React frontend:
   ```sh
   cd SFDLE/client
   npm start
   ```
5. **Access the Application**
   Go to `http://localhost:3000` in your browser.

## Usage
- **Play Daily Challenges**: Guess the character, complete blind tests, and more to earn points.
- **View Achievements**: Track your progress and earn achievements.
- **Leaderboard**: Compete with other players to get the top spot.

## Deployment
Currently, the product is not deployed. Research was conducted on platforms like GitHub Pages, Vercel, Heroku, and Netlify for deployment possibilities. However, due to missing features and required optimizations, deployment is planned post further development.

### Future Deployment Plans
- **Vercel**: Likely for frontend hosting due to its ease with React apps.
- **Heroku** or **Render**: Potential backend hosting options.

## Contribution
Interested in contributing to SFDLE?
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a Pull Request.


Thank you for checking out SFDLE! We are always open to feedback and contributions to make this project a better experience for the FGC. If you have suggestions or find any bugs, feel free to open an issue or reach out directly.

