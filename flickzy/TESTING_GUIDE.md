# Flickzy Testing Guide

## ✅ NO AUTHENTICATION REQUIRED!

**You can now use Movies, Music, and Games features WITHOUT logging in!**

### Anonymous Access:
- ✅ Create rooms without logging in
- ✅ Join rooms without logging in
- ✅ Send messages without logging in
- ✅ Use video calls without logging in
- ⚠️ Messages will show as "Anonymous" if not logged in

### Optional Login Benefits:
- Your messages show your username
- You appear in the participant list
- Your profile picture is displayed
- Room ownership is tracked

---

## Chat Functionality

### How to Test Chat:
1. **Create or join a room** on the Movies, Music, or Games page
2. **Type a message** in the chat input at the bottom of the chat panel
3. **Press Enter or click Send** button
4. You should see:
   - A toast notification saying "Message sent"
   - Your message appearing in the chat
   - If logged in: Shows your username and timestamp
   - If anonymous: Shows "Anonymous" and timestamp

### Troubleshooting Chat:
- **Check browser console** (F12) for any errors
- **No login required** - chat works for everyone
- **Test with another user** - open an incognito window and join the same room
- **Messages persist** - all users in the room see the same messages

## Video Call Functionality

### How to Test Video Call:
1. **Click "Video Call" button** in the room header
2. **Click the video camera icon** (bottom controls) to turn on your camera
3. **Allow camera/microphone access** when browser prompts
4. You should see:
   - Your live video feed in the first video box
   - A toast notification saying "Camera & Mic started"

### Audio Testing (When Alone):
- **You WILL hear yourself** - this is normal for testing
- **You may hear echo** - this is expected when testing alone
- **Mic indicator** - red icon shows when mic is off, green when on
- **Video indicator** - red icon shows when camera is off

### Video Call Controls:
- 🎤 **Mic button** - Toggle microphone on/off (blue = on, red = off)
- 📹 **Video button** - Toggle camera on/off (blue = on, red = off)
- 📞 **Phone button** - End call and close video panel

### Testing with Multiple Users:
1. **Open two browser windows** (or use incognito mode)
2. **Create accounts** in both windows
3. **Create a room** in window 1
4. **Copy the room code** and join from window 2
5. **Enable video call** in both windows
6. **Note**: Real peer-to-peer video requires WebRTC server (not implemented yet)
   - Currently shows local camera feeds only
   - For full video calling, would need services like Twilio/Agora

## Fullscreen Mode

### How to Use:
1. **Load a YouTube video** in the room
2. **Click "Fullscreen" button** below the video player
3. **Exit fullscreen** by clicking "Exit Fullscreen" button (top-right)

### What's Fixed:
- ✅ Participants list no longer overlaps video in fullscreen
- ✅ Only video player and exit button visible in fullscreen
- ✅ Clean, distraction-free viewing experience

## Common Issues

### Chat Not Working:
```
Problem: Messages not sending
Solution: 
1. Check browser console for errors
2. Verify you're authenticated (logged in)
3. Check if Supabase is connected
4. Try refreshing the page
```

### Audio Not Working:
```
Problem: Can't hear yourself
Solution:
1. Check browser permissions (camera/mic allowed)
2. Check system audio settings
3. Try different browser (Chrome recommended)
4. Check if mic is muted in system settings
```

### Camera Not Working:
```
Problem: Camera not showing
Solution:
1. Allow camera access when prompted
2. Check if another app is using camera
3. Try refreshing the page
4. Check browser permissions in settings
```

## Browser Compatibility

### Recommended:
- ✅ Chrome/Edge (best support)
- ✅ Firefox
- ✅ Safari (may have limitations)

### Required Permissions:
- 📹 Camera access
- 🎤 Microphone access
- 🔔 Notifications (optional)

## Technical Notes

### Real-time Features:
- **Chat**: Uses Supabase Realtime for instant message delivery
- **Participants**: Updates in real-time when users join/leave
- **Video sync**: Host controls video URL for all participants

### Current Limitations:
- **Video calling**: Shows local camera only (no peer-to-peer streaming yet)
- **Audio**: May echo when testing alone (normal behavior)
- **Screen sharing**: Not implemented yet
- **Recording**: Not implemented yet

### Future Enhancements:
- WebRTC peer-to-peer video streaming
- Screen sharing capability
- Recording functionality
- Better audio processing (echo cancellation)
- Virtual backgrounds

---

## Music Rooms

### How to Use Music Rooms:
1. **Log in first** (required!)
2. **Navigate to Music page** from the header
3. **Create a room** by clicking "Create Music Room" card
4. **Enter a room name** and click "Create Room"
5. **Share the room code** with friends (click copy icon)
6. **Load a YouTube video** by entering the video ID
   - Example: For `https://youtube.com/watch?v=dQw4w9WgXcQ`, use `dQw4w9WgXcQ`
7. **Click "Load"** to start the video

### Music Room Features:
- 🎵 **YouTube player** - Watch music videos together
- 💬 **Real-time chat** - Discuss the music
- 📹 **Video calls** - See each other while listening
- 👥 **Participant list** - See who's in the room
- 🔗 **Room codes** - Easy sharing with 6-character codes

### Joining a Music Room:
1. **Get the room code** from a friend
2. **Click "Join Music Room"** card
3. **Enter the 6-character code**
4. **Click "Join Room"**

---

## Game Rooms

### How to Use Game Rooms:
1. **Log in first** (required!)
2. **Navigate to Games page** from the header
3. **Create a room** by clicking "Create Game Room" card
4. **Enter a room name** and click "Create Room"
5. **Share the room code** with friends (click copy icon)
6. **Load a browser game** by entering the game URL
   - Example: `https://example.com/game`
7. **Click "Load"** to start the game

### Game Room Features:
- 🎮 **Browser games** - Play web-based games together
- 💬 **Real-time chat** - Coordinate gameplay
- 📹 **Video calls** - See teammates while playing
- 👥 **Participant list** - See who's playing
- 🔗 **Room codes** - Easy sharing with 6-character codes

### Joining a Game Room:
1. **Get the room code** from a friend
2. **Click "Join Game Room"** card
3. **Enter the 6-character code**
4. **Click "Join Room"**

### Supported Games:
- Any browser-based game with a public URL
- HTML5 games
- Web-based multiplayer games
- Flash-free games (Flash is deprecated)

---

## Troubleshooting Create Room Button

### Issue: "Nothing happens when I click Create Room"

**Solution**: You need to log in first!

1. **Check if you're logged in**:
   - Look for "Login" button in the header
   - If you see "Login", you're NOT logged in

2. **Log in**:
   - Click "Login" in the header
   - Sign up or log in with your credentials
   - Return to Music/Games page

3. **Try again**:
   - Click "Create Room" card
   - You should now see the dialog open
   - Enter a room name and create

### What You'll See:
- ✅ **If logged in**: Dialog opens, you can enter room name
- ❌ **If NOT logged in**: Toast notification appears saying "Login required", then redirects to login page after 1.5 seconds

### Same applies to:
- Creating rooms in Movies, Music, and Games
- Joining rooms with codes
- Sending chat messages
- Starting video calls
