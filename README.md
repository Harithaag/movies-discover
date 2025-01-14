# Movies Discover

## Project Overview
Movies Discover is a React-based application that provides a comprehensive platform to browse and search for movies. It leverages The Movie Database (TMDB) API to fetch movie data, including genres, ratings, release dates, and other details. Users can filter movies based on various criteria, such as genre, release year, and rating range. The app supports infinite scrolling, allowing users to load more movies as they scroll through the page. It also includes a watchlist feature (currently a TODO) to save favorite movies for easy access. 

## Feature List
1. **Search Functionality**: Users can search for movies by title.
2. **Genre Filtering**: Filter movies based on genres fetched from the TMDB API.
3. **Year Filtering**: Narrow down movies by release year.
4. **Rating Range Slider**: Adjust the range of movie ratings (0-10).
5. **Infinite Scrolling**: Automatically load more movies as the user scrolls.
6. **Watchlist**: Add or remove movies from a personal watchlist (TODO feature).
7. **Dark and Light Themes**: Adapts the app's appearance based on the selected theme using Context API.
8. **Debounced Search**: Improves performance by reducing API calls while typing in the search field.
9. **Lazy Loading for Images**: Optimizes image loading by deferring the loading of non-visible images until they enter the viewport.

## Setup Guide
### Prerequisites
- Node.js (>=16.x)
- npm or yarn package manager

### Steps to Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Harithaag/movies-discover.git
   cd movies-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your TMDB API key:
   ```env
   API_KEY=your_tmdb_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000/movies
   ```

### Production Build
To create a production-ready build, run:
```bash
npm run build
# or
yarn build
```

The build files will be available in the `build/` directory.

## Technology Stack
1. **Frontend**:
   - React: For building the user interface.
   - Material-UI (MUI): For pre-designed UI components.
   - Axios: For making API requests.

2. **Backend API**:
   - TMDB API: For movie data.

3. **State Management**:
   - Redux: For state management
   - Context API: For managing the application theme.

4. **Additional Libraries**:
   - react-router-dom: For routing.
   - Node.js: For setting up the environment.

5. **Utilities**:
   - Lazy loading for optimizing image loading.
   - Debounce function for reducing unnecessary API calls.

The Movies Discover app combines these technologies to deliver a smooth and feature-rich experience for browsing and managing movies.

