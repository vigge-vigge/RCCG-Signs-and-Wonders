# Media & Sermons System - Backend Integration Guide

## Overview
The sermons/media system has been fully connected to backend API routes. All mock data has been removed and the system will only display sermons that are uploaded by administrators through the backend.

## Database Schema (Prisma)

### Sermon Model
```prisma
model Sermon {
  id           String   @id @default(cuid())
  title        String
  description  String?
  videoUrl     String?
  audioUrl     String?
  thumbnailUrl String?
  date         DateTime
  speaker      String
  scripture    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Fields:**
- `id`: Unique identifier (auto-generated)
- `title`: Sermon title (required)
- `description`: Brief description of the sermon
- `videoUrl`: Link to video (YouTube, Vimeo, etc.)
- `audioUrl`: Link to audio file or streaming service
- `thumbnailUrl`: Link to thumbnail/cover image
- `date`: Date the sermon was delivered (required)
- `speaker`: Name of the speaker/pastor (required)
- `scripture`: Bible verse reference
- `createdAt/updatedAt`: Timestamps

## API Routes

### 1. GET /api/sermons
Fetch all sermons with optional filtering
- Query params: `limit` (optional number to limit results)
- Returns: Array of sermon objects ordered by date (newest first)
- Public access

**Example Response:**
```json
[
  {
    "id": "1",
    "title": "Walking in Divine Purpose",
    "description": "Understanding God's plan for your life",
    "date": "2024-11-20",
    "speaker": "Pastor Abraham Akande",
    "scripture": "Jeremiah 29:11",
    "videoUrl": "https://youtube.com/watch?v=...",
    "audioUrl": "https://...",
    "thumbnailUrl": "https://..."
  }
]
```

### 2. POST /api/sermons
Create a new sermon (Admin only)
- Request body: 
  ```json
  {
    "title": "string (required)",
    "description": "string (optional)",
    "date": "YYYY-MM-DD (required)",
    "speaker": "string (required)",
    "scripture": "string (optional)",
    "videoUrl": "string (optional)",
    "audioUrl": "string (optional)",
    "thumbnailUrl": "string (optional)"
  }
  ```
- Returns: Created sermon object
- Requires authentication

### 3. GET /api/sermons/[id]
Get single sermon by ID
- Returns: Sermon object
- Public access

### 4. DELETE /api/sermons/[id]
Delete a sermon (Admin only)
- Returns: Success status
- Requires authentication

### 5. PATCH /api/sermons/[id]
Update sermon details (Admin only)
- Request body: Any sermon fields to update
- Returns: Success status
- Requires authentication

## Frontend Pages

### Public Page

#### /sermons (renamed to /media internally)
- Displays all sermons in a grid layout
- Shows sermon cards with title, description, date, speaker, scripture
- Links to video/audio if available
- Filter/sort capabilities
- Empty state: "No sermons available yet"
- Loading state while fetching
- Includes link to photo gallery section

**Features:**
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- YouTube subscription CTA section
- Photo gallery promotion banner

### Admin Page

#### /admin/dashboard/sermons
- Create new sermons with full form
- View all existing sermons
- Delete sermons (with confirmation)
- Shows empty state when no sermons exist
- Form fields:
  - Title (required)
  - Description (optional)
  - Date (required, date picker)
  - Speaker (required)
  - Scripture reference (optional)
  - Video URL (optional)
  - Audio URL (optional)
  - Thumbnail URL (optional)

**Admin Features:**
- Modal form for creating sermons
- Validation for required fields
- Loading states during operations
- Success/error feedback
- List view with all sermon details
- Quick delete action

## Integration with Photo Gallery

The media page (`/sermons`) now includes:
- Prominent photo gallery promotion banner
- Link to `/media/photos` for browsing photo albums
- Unified "Media & Sermons" experience

## Activating the Database

To enable the sermon system with a real database:

1. **Uncomment the Prisma schema** (already done for Sermon model)

2. **Set up environment variables**:
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Create the database**:
   ```bash
   npx prisma db push
   ```

5. **Uncomment Prisma imports in API routes**:
   - `/app/api/sermons/route.ts`
   - `/app/api/sermons/[id]/route.ts`
   - Replace TODO sections with actual Prisma database calls
   - Remove temporary mock responses

6. **Uncomment lib/prisma.ts** if not already done

## Current State

✅ **Implemented:**
- All API routes with authentication
- Public sermon listing page
- Admin sermon management dashboard
- Empty state handling
- Loading states
- Error handling
- Video/Audio URL support
- Thumbnail support
- Create and delete operations
- Integration with photo gallery

⏳ **To Implement** (when database is activated):
- Edit/update sermon functionality in UI
- Direct file upload for audio (currently URL-based)
- Embedded video players
- Advanced filtering (by speaker, date range, scripture)
- Search functionality
- Pagination for large sermon libraries

## Testing Without Database

Currently returns empty arrays from API:
- Public page shows "No sermons available yet"
- Admin page shows "No sermons created yet"
- Creating sermons returns success but doesn't persist
- This is intentional until database activation

## Media File Hosting Options

For video/audio hosting, recommend:

### Video:
- **YouTube** (free, recommended)
- Vimeo
- Self-hosted with services like Mux

### Audio:
- **SoundCloud** (free tier available)
- Anchor.fm/Spotify for Podcasters (free)
- AWS S3 + CloudFront
- Google Drive (public links)

### Thumbnails:
- Cloudinary (free tier)
- AWS S3
- imgix
- Local `/public/images/sermons/`

The system accepts URLs, so any publicly accessible media will work!

## Admin Dashboard Integration

The main admin dashboard (`/admin/dashboard`) now includes:
- "Manage Sermons" card with link to `/admin/dashboard/sermons`
- "Photo Albums" card with link to `/admin/dashboard/photos`
- Unified content management experience

## Statistics Updates

To show accurate sermon counts on the dashboard, update the stats section in `/admin/dashboard/page.tsx` to fetch from the API when database is activated.
