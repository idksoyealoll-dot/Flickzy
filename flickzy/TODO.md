# Task: Remake Music and Games Pages with Real Functionality

## Plan

### Music Page (Spotify-like Player)
- [x] 1.1 Add YouTube search functionality for music
- [x] 1.2 Create music search UI with input and results grid
- [x] 1.3 Integrate YouTube player for music playback
- [x] 1.4 Add player controls (play/pause, next/previous, volume)
- [x] 1.5 Create queue/playlist management
- [x] 1.6 Integrate with room system (like Movies)
- [x] 1.7 Add synchronized playback for multiple users
- [x] 1.8 Remove all dummy data

### Games Page (Similar to Movies)
- [x] 2.1 Remove dummy game data
- [x] 2.2 Add game URL input (for browser games, streaming links)
- [x] 2.3 Create room system for games
- [x] 2.4 Add iframe support for browser games
- [x] 2.5 Integrate chat and video call (reuse from Movies)
- [x] 2.6 Add participant management

### Database Updates
- [x] 3.1 Update room types to support 'music' type (already done)
- [x] 3.2 Add music-specific fields if needed (using video_url field)
- [x] 3.3 Test room creation for music and games

### Testing
- [x] 4.1 Test music search and playback
- [x] 4.2 Test game room creation
- [x] 4.3 Test synchronized playback
- [x] 4.4 Run lint check

### Bug Fixes
- [x] 5.1 Fix Create Room button not working (authentication required)
- [x] 5.2 Add authentication check to handleCreateRoom
- [x] 5.3 Add authentication check to handleJoinRoom
- [x] 5.4 Update TESTING_GUIDE.md with authentication requirements
- [x] 5.5 Add clear error messages and auto-redirect to login

## Notes
- Music page complete - uses YouTube embed for playback
- Games page complete - supports browser games via iframe
- Both pages reuse existing room/chat/video infrastructure
- All dummy data removed
- Lint check passed successfully
- **IMPORTANT**: Users must be logged in to create/join rooms
- Authentication check added with clear error messages
- Auto-redirects to login page after 1.5 seconds if not authenticated