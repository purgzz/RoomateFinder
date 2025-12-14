# Roommate Finder

A full-stack application for finding and matching roommates, built with React Native Expo and GoLang.

## Project Structure

```
RoomateFinder/
├── frontend/          # React Native Expo app
│   ├── App.tsx
│   ├── src/
│   ├── assets/
│   └── package.json
│
└── backend/           # GoLang REST API
    ├── main.go
    ├── go.mod
    └── README.md
```

## Tech Stack

### Frontend

- **React Native** with **Expo** - Cross-platform mobile development
- **TypeScript** - Type safety
- **Axios** - HTTP client for API calls

### Backend

- **Go 1.21+** - High-performance backend
- **Gorilla Mux** - HTTP routing
- **CORS** - Cross-origin resource sharing

## Quick Start

### 1. Database requirements

Run the commands from root directory

````bash
copy .env.example .env
if macOS/Linux: cp .enc.example .env

docker compose up -d
confirm db running: docker compose ps

### 2. Start the Backend

Run these commands in the root directory to start the backend

```bash
cd backend
go mod download
go run main.go
````

The backend will start on `http://localhost:8080`

### 2. Start the Frontend

Run these commands in the root directory to start frontend

```bash
cd frontend
npm install
npm start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

Or scan the QR and use react Expo app to run on yout Phone.

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## Development Workflow

1. The backend runs on port 8080
2. The frontend connects to the backend via the API service layer
3. CORS is configured to allow requests from Expo development servers
4. Both frontend and backend support hot-reloading during development

## Environment Configuration

### Backend

The server runs on port 8080 by default. Update the `port` variable in `backend/main.go` to change it.

### Frontend

The API base URL is set in `frontend/src/services/api.ts`. Update it based on your environment:

- Local development: `http://localhost:8080/api`
- Physical device: `http://<YOUR_LOCAL_IP>:8080/api`

## Dev notes.

We are using Supabase for our database. Google cloud run for our hosting services. Please familiarize yourself with `.gitignore`files and secret variables to ensure safe programming.

Every developer is required to have a local file that is NEVER shared to github containing confidential secrets access keys to their used services.

I recommend anyone on the dev team makes their own [SUPABASE](https://supabase.com) account and project and make their own project, use those credentials to ensure we aren't risking leaking confidential secrets.

#### Backends secrets file is `.env`

#### Frontend is `secrets.txt.`

These files do Not appear on github and require the dev to create on their own.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly on both platforms
4. Submit a pull request

## License

This project is for educational purposes.

## when a user swipes we track it:

LOG pass: Alex Johnson
LOG pass: Sarah Chen
LOG pass: Marcus Rodriguez
LOG pass: Emma Wilson
LOG pass: David Kim
LOG like: Alex Johnson
LOG pass: Sarah Chen
LOG like: Marcus Rodriguez
LOG like: Emma Wilson
LOG like: David Kim
