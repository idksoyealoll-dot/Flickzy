# Changelog

All notable changes to Flickzy will be documented in this file.

## [2.0.0] - 2025-12-11 - Public Access Release

### 🎉 Major Changes
- **Removed authentication requirement** - All features now work without logging in
- **Fully public platform** - Anyone can create and join rooms instantly
- **Anonymous user support** - No signup needed to use any feature

### ✨ Added
- Anonymous room creation
- Anonymous room joining
- Anonymous chat messaging
- Anonymous video calls
- Public access guide documentation
- Comprehensive testing guide updates

### 🔧 Changed
- Made `host_id` nullable in `rooms` table
- Made `user_id` nullable in `room_participants` table
- Made `user_id` nullable in `room_messages` table
- Updated all RLS policies to allow anonymous access
- Modified `createRoom()` API to work without authentication
- Modified `joinRoom()` API to work without authentication
- Modified `sendMessage()` API to work without authentication
- Modified `leaveRoom()` API to work without authentication
- Removed authentication checks from Games.tsx
- Removed authentication checks from Music.tsx

### 📚 Documentation
- Created `PUBLIC_ACCESS_GUIDE.md` with comprehensive guide
- Updated `TESTING_GUIDE.md` to reflect no authentication requirement
- Documented anonymous vs authenticated user capabilities
- Added troubleshooting and testing checklists

### 🔒 Security
- RLS policies still protect user profile data
- Anonymous users can't access authentication-required features
- Room codes remain randomly generated for privacy
- Rate limiting still applies (Supabase default)

### 🐛 Bug Fixes
- Fixed "Login required" errors when creating rooms
- Fixed "Login required" errors when joining rooms
- Fixed authentication redirect issues
- Fixed chat not working for anonymous users

### 💡 Technical Details
- Database migrations: `00003_make_rooms_public.sql`, `00004_make_rooms_public_v2.sql`
- API changes: All room-related functions now support anonymous users
- Frontend changes: Removed authentication guards from room creation/joining

---

## [1.0.0] - 2025-12-10 - Initial Release

### ✨ Features
- Movie watching rooms with synchronized playback
- Music listening rooms with YouTube integration
- Browser game rooms with iframe support
- Real-time chat in all rooms
- Video call functionality with WebRTC
- User authentication with Supabase
- Profile management
- Room code system for easy sharing

### 🎨 Design
- Modern UI with shadcn/ui components
- Responsive design for all screen sizes
- Dark mode support
- Smooth animations and transitions

### 🔧 Technical
- React + TypeScript
- Vite build system
- Supabase backend
- WebRTC for video calls
- Real-time subscriptions for chat
- Row Level Security (RLS) policies

---

## Version History

### Version 2.0.0 - Public Access Release
**Release Date**: December 11, 2025  
**Key Feature**: No authentication required - fully public platform

### Version 1.0.0 - Initial Release
**Release Date**: December 10, 2025  
**Key Feature**: Authentication-based room system

---

## Migration Guide

### From v1.0.0 to v2.0.0

#### For Users
- **No action required** - Everything works the same, but now without login
- **Optional login** - You can still log in for username display and tracking
- **Existing accounts** - All existing accounts and data are preserved

#### For Developers
- **Database changes** - Run migrations `00003` and `00004`
- **API changes** - All room functions now support `null` user_id
- **Frontend changes** - Remove authentication guards from room operations
- **Testing** - Update tests to work with anonymous users

#### Breaking Changes
- None - All existing functionality is preserved
- Authentication is now optional instead of required
- Anonymous users are supported throughout the system

---

## Roadmap

### Planned Features
- [ ] Custom anonymous usernames (e.g., "Guest123")
- [ ] Local storage for room history
- [ ] Direct room links (no code needed)
- [ ] Room analytics (view count, etc.)
- [ ] Auto-delete inactive rooms
- [ ] Avatar selection for anonymous users
- [ ] Room categories and tags
- [ ] Search and filter rooms
- [ ] Room favorites (for logged-in users)
- [ ] Admin panel for room management

### Under Consideration
- [ ] Private rooms with passwords
- [ ] Room capacity limits
- [ ] Kick/ban functionality
- [ ] Moderator roles
- [ ] Custom room themes
- [ ] Screen sharing in video calls
- [ ] File sharing in rooms
- [ ] Voice-only rooms (no video)

---

## Support

For issues, questions, or feature requests:
1. Check the documentation first
2. Review the troubleshooting guides
3. Check browser console for errors
4. Report issues with detailed logs

---

## Credits

Built with:
- React + TypeScript
- Vite
- Supabase
- shadcn/ui
- Tailwind CSS
- WebRTC

---

## License

[Your License Here]
