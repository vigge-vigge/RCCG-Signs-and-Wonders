# Testimonies & News Backend Integration

This document describes the backend integration for the testimonies and news feature.

## Overview

The testimonies and news section has been fully integrated with a backend API, replacing all mock data with dynamic content that can be managed through the admin dashboard.

## Features

### Public Features (Events Page)
- **Filter by Type**: Users can filter posts to view all items, testimonies only, or news only
- **Dynamic Loading**: Content is fetched from the backend API with loading states
- **Empty States**: Friendly messages when no content is available
- **Type Badges**: Visual indicators showing whether an item is a testimony or news
- **Author Display**: Shows the author name if provided
- **Responsive Design**: Works seamlessly on all device sizes

### Admin Features (Dashboard)
- **Create Posts**: Add new testimonies or news items with rich content
- **Type Selection**: Choose between testimony or news when creating posts
- **Optional Fields**: Add author name and image URL as needed
- **Delete Posts**: Remove outdated or unwanted posts
- **Filter Management**: View all posts or filter by type in the admin panel
- **Real-time Updates**: List refreshes automatically after creating or deleting posts

## API Endpoints

### Get All Posts
```
GET /api/posts?type={all|testimony|news}
```
- Returns an array of posts based on the type filter
- Currently returns an empty array until the database is activated

### Create Post
```
POST /api/posts
Content-Type: application/json
```
**Body:**
```json
{
  "title": "Post Title",
  "content": "Full post content...",
  "type": "testimony", // or "news"
  "author": "Optional Author Name",
  "imageUrl": "https://optional-image-url.jpg"
}
```
- Requires authentication (admin session)
- Validates that type is either "testimony" or "news"

### Get Single Post
```
GET /api/posts/[id]
```
- Returns a specific post by ID
- Currently returns 404 until the database is activated

### Update Post
```
PATCH /api/posts/[id]
Content-Type: application/json
```
- Requires authentication (admin session)
- Updates any provided fields for a post

### Delete Post
```
DELETE /api/posts/[id]
```
- Requires authentication (admin session)
- Permanently removes a post

## Files Created/Modified

### API Routes
- `app/api/posts/route.ts` - GET and POST endpoints for posts collection
- `app/api/posts/[id]/route.ts` - GET, PATCH, and DELETE endpoints for single posts

### Public Pages
- `app/events/page.tsx` - Updated to fetch posts dynamically with filtering

### Admin Pages
- `app/admin/dashboard/posts/page.tsx` - Full CRUD interface for managing posts
- `app/admin/dashboard/page.tsx` - Added link to posts management

### Database Schema
- `prisma/schema.prisma` - Added Post model (currently commented)

## Database Schema (When Activated)

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  type      String   // 'testimony' or 'news'
  author    String?
  imageUrl  String?
  date      DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Current State

✅ API routes created and tested
✅ Public events page fetches from backend
✅ Admin management interface complete
✅ Filter functionality working (all/testimony/news)
✅ Loading and empty states implemented
✅ Authentication on protected routes
✅ No mock data - all content is backend-driven

⚠️ Database is currently disabled - API returns empty arrays
⚠️ To activate: Uncomment Prisma schema and run migrations

## Next Steps

1. **Activate Database**: Uncomment the Post model in `prisma/schema.prisma`
2. **Run Migrations**: Execute `npx prisma generate` and `npx prisma db push`
3. **Create Sample Data**: Use the admin dashboard to add initial posts
4. **Add Images**: Upload or link images for posts with visual content

## Usage Instructions

### For Admins

1. **Login**: Navigate to `/admin/login` and sign in
2. **Access Dashboard**: Go to `/admin/dashboard`
3. **Manage Posts**: Click on "Manage Posts" or "Testimonies & News"
4. **Create Post**:
   - Click "Add New Post"
   - Select type (Testimony or News)
   - Fill in title and content (required)
   - Optionally add author and image URL
   - Click "Add Post"
5. **Delete Post**: Click the "Delete" button on any post (with confirmation)
6. **Filter Posts**: Use the All/Testimonies/News buttons to filter the list

### For Visitors

1. Navigate to the "Events" page (testimonies and news section)
2. Use filter buttons to view specific types of content
3. Read testimonies from church members
4. Stay updated with church news and announcements

## Integration Pattern

This follows the same backend integration pattern used for:
- Photo Gallery (Albums & Photos)
- Sermons & Media

All three systems now:
- Fetch data from backend APIs
- Support admin management through dashboard
- Have no hardcoded mock data
- Include proper loading and empty states
- Use authentication for protected operations

## Authentication

All POST, PATCH, and DELETE operations require authentication using NextAuth.js with session-based verification via `getServerSession`.
