# Video Pipeline System - Agentic Workflow for Video Generation

A comprehensive platform for automating video generation across multiple genres and languages using AI models (Gemini, Anthropic, OpenAI). Create, schedule, and manage video pipelines with real-time status monitoring, multi-language support, and social media integration.

## Features

✅ **Pipeline Management**
- Create and configure video generation pipelines
- Support for multiple genres: Kids Moral, Spiritual Hindu, Muslim, Christianity, Horror, Health, etc.
- AI model selection: Gemini, Anthropic, OpenAI with specific sub-models
- Flexible scheduling: Run once, daily, weekly, monthly

✅ **Parallel Execution**
- Run multiple pipelines simultaneously
- Support for different genres and languages in parallel
- Real-time job status monitoring

✅ **Multi-Language Support**
- Generate videos in multiple languages from a single pipeline
- Automatic content translation
- Language-specific titles and descriptions

✅ **Agentic Workflow**
- Step-by-step pipeline execution with visual progress
- Rotating dice animation for running steps
- Color-coded status: Green (success), Red (failed), Blue (running)
- Console logs for debugging

✅ **Video Management**
- Video gallery with genre-based filtering
- Display generated videos with metadata
- Download and delete options

✅ **Social Media Integration**
- Post generated videos to YouTube, Instagram, Facebook
- Automated social media publishing
- Track posting status

✅ **Job Monitoring**
- Real-time job status dashboard
- Detailed job logs and console output
- Historical job records

## Project Structure

```
.
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state management
│   │   ├── utils/           # API utilities
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── server.js        # Express server
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── package.json            # Root workspace config
└── README.md
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 12+
- Redis (for job queue)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd video-pipeline-system
```

### 2. Install dependencies

```bash
npm install
```

This installs dependencies for both frontend and backend (workspace configuration).

### 3. Set up environment variables

#### Backend (.env)

```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit with your values
DATABASE_URL=postgresql://user:password@localhost:5432/video_pipeline
PORT=3000
JWT_SECRET=your-very-secret-key-change-this
NODE_ENV=development

GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

REDIS_URL=redis://localhost:6379
STORAGE_PATH=./uploads

YOUTUBE_API_KEY=your_youtube_key
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
FACEBOOK_ACCESS_TOKEN=your_facebook_token
```

#### Frontend (.env.local)

```bash
# Create frontend/.env.local
VITE_API_URL=http://localhost:3000/api
```

### 4. Set up PostgreSQL database

```bash
# Make sure PostgreSQL is running, then run migrations
cd backend
npm run migrate
cd ..
```

### 5. Start the application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API: http://localhost:3000/api

## API Documentation

### Authentication

```bash
POST /api/auth/register
POST /api/auth/login
GET /api/auth/verify
```

### Pipelines

```bash
GET /api/pipelines                  # List all pipelines
GET /api/pipelines/:id              # Get pipeline details
POST /api/pipelines                 # Create pipeline
PUT /api/pipelines/:id              # Update pipeline
DELETE /api/pipelines/:id           # Delete pipeline
POST /api/pipelines/:id/execute     # Execute pipeline now
```

### Jobs

```bash
GET /api/jobs                       # List all jobs
GET /api/jobs/:id                   # Get job details
GET /api/jobs/:id/logs              # Get job logs
POST /api/jobs/:id/cancel           # Cancel job
```

### Videos

```bash
GET /api/videos                     # List all videos
GET /api/videos/:id                 # Get video details
DELETE /api/videos/:id              # Delete video
GET /api/videos/genre/:genre        # Get videos by genre
```

## Database Schema

### User
- id, email, password, name, timestamps

### Pipeline
- id, userId, name, description, genre, languages[], aiProvider, aiModel, schedule, enabled, lastRunAt, timestamps

### Job
- id, userId, pipelineId, pipelineName, genre, language, status, progress, error, steps (JSON), logs, timestamps

### JobLog
- id, jobId, level, message, timestamp

### Video
- id, userId, jobId, genre, title, titleEn, description, url, duration, language, postedOn[], timestamps

## Pipeline Execution Flow

1. **Generate Content** - AI generates initial content/script
2. **Translate Content** - Translate to all selected languages
3. **Generate Video** - Create video from script using video generation API
4. **Post Processing** - Add branding, subtitles, watermarks
5. **Upload & Archive** - Save video records and create archive entries

Each step:
- Shows rotating dice animation while running
- Turns green on success
- Turns red on failure
- Has console logs for debugging

## Scheduling

Pipelines support automatic execution:
- **Once** - Manual execution only
- **Daily** - Executes once per day
- **Weekly** - Executes once per week  
- **Monthly** - Executes once per month

The scheduler checks every minute and triggers pipelines based on their schedule.

## Configuration Examples

### Example 1: Kids Moral Stories in Multiple Languages

```json
{
  "name": "Daily Kids Moral Stories",
  "genre": "Kids Moral",
  "languages": ["English", "Spanish", "Hindi"],
  "aiProvider": "Gemini",
  "aiModel": "Flash",
  "schedule": "daily",
  "description": "Generate short moral stories for kids daily"
}
```

### Example 2: Health Tips in Arabic

```json
{
  "name": "Health Tips Arabic",
  "genre": "Health",
  "languages": ["Arabic"],
  "aiProvider": "Anthropic",
  "aiModel": "Claude 3 Sonnet",
  "schedule": "weekly",
  "description": "Weekly health tips in Arabic"
}
```

## Deployment

### Production Build

```bash
npm run build:frontend
npm run build:backend
```

### Docker Deployment

```bash
docker-compose up -d
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -d video_pipeline

# Re-run migrations
cd backend && npm run migrate
```

### Port Already in Use
```bash
# Change port in .env
# Or kill the process using the port
lsof -ti:3000 | xargs kill -9
```

### API Not Responding
```bash
# Check backend logs
npm run dev:backend

# Verify database connection
curl http://localhost:3000/health
```

## Support

For issues and questions, please create an issue in the repository or contact the development team.

## License

MIT License - see LICENSE file for details
