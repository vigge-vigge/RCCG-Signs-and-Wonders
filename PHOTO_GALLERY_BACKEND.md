# Photo Gallery System - Backend Integration Guide

## Overview
The photo gallery system is now fully connected to backend API routes. All mock data has been removed and the system will only display photos that are uploaded by administrators through the backend.

## Database Schema (Prisma)

Two models have been added to `prisma/schema.prisma`:

### Album Model
```prisma
model Album {
  id          Int      @id @default(autoincrement())
  title       String
  date        DateTime
  eventType   String   // 'weekly' or 'special'
  coverImage  String?
  photos      Photo[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Photo Model
```prisma
model Photo {
  id        Int      @id @default(autoincrement())
  url       String
  caption   String?
  albumId   Int
  album     Album    @relation(fields: [albumId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Routes

### 1. GET /api/albums
Fetch all albums with optional filtering and sorting
- Query params: `type` (all|weekly|special), `sort` (newest|oldest)
- Returns: Array of album objects with photo count
- Public access

### 2. POST /api/albums
Create a new album (Admin only)
- Request body: `{ title, date, eventType }`
- Returns: Created album object
- Requires authentication

### 3. GET /api/albums/[id]
Get single album with all photos
- Returns: Album object with photos array
- Public access

### 4. DELETE /api/albums/[id]
Delete an album and all its photos (Admin only)
- Returns: Success status
- Requires authentication

### 5. PATCH /api/albums/[id]
Update album details (Admin only)
- Request body: `{ title?, date?, eventType?, coverImage? }`
- Returns: Success status
- Requires authentication

### 6. POST /api/albums/[id]/photos
Add a photo to an album (Admin only)
- Request body: `{ url, caption? }`
- Returns: Created photo object
- Requires authentication

### 7. DELETE /api/photos/[id]
Delete a specific photo (Admin only)
- Returns: Success status
- Requires authentication

### 8. PATCH /api/photos/[id]
Update photo caption (Admin only)
- Request body: `{ caption }`
- Returns: Success status
- Requires authentication

## Frontend Pages

### Public Pages

#### /media/photos
- Lists all photo albums
- Filter by event type (all/weekly/special)
- Sort by date (newest/oldest)
- Shows "No albums yet" when database is empty
- Loading state while fetching

#### /media/photos/[id]
- Displays all photos in an album
- Lightbox viewer for full-screen photos
- Shows "Album not found" for invalid IDs
- Shows "No photos yet" for empty albums

### Admin Pages

#### /admin/dashboard/photos
- Create new albums with title, date, and event type
- View all existing albums
- Delete albums (with confirmation)
- Shows "No albums created yet" when database is empty
- Note: Photo upload UI will be added in future update

## Activating the Database

To enable the photo gallery system with a real database:

1. **Uncomment the Prisma schema**:
   - Open `prisma/schema.prisma`
   - Uncomment the generator, datasource, and all models including Album and Photo

2. **Set up environment variables**:
   ```bash
   # Add to .env
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
   - All API routes in `/app/api/albums/` and `/app/api/photos/` have TODO comments
   - Replace the TODO sections with the actual Prisma database calls
   - Remove the temporary mock responses

6. **Uncomment lib/prisma.ts**:
   - Enable the PrismaClient singleton

## Current State

✅ **Implemented**:
- All API routes created with authentication
- Frontend pages fetch from backend
- No mock data in frontend
- Empty state handling
- Loading states
- Error handling
- Album creation via admin panel
- Album deletion via admin panel

⏳ **To Implement** (when database is activated):
- Photo upload functionality
- Image hosting/storage integration
- Cover image auto-selection
- Batch photo upload
- Photo editing and reordering

## Testing Without Database

The system is currently set up to return empty arrays from the API routes, so:
- Public photo gallery shows "No albums yet"
- Admin panel shows "No albums created yet"
- Creating albums will return success but won't persist
- This is intentional until you activate the database

## File Upload Consideration

For photo uploads, you'll need to implement file storage. Options:
1. **Cloud Storage** (recommended for production):
   - AWS S3
   - Cloudinary
   - Vercel Blob
   
2. **Local Storage** (development only):
   - Save to `/public/images/albums/`
   - Store path in database

The API routes are ready to accept photo URLs once you implement your chosen storage solution.
