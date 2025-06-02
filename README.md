# 🎵 Music Player - Trình phát nhạc Online hiện đại

> Ứng dụng trình phát nhạc web được xây dựng với HTML5, CSS3, JavaScript ES6+ và Bootstrap 5. Tối ưu cho trải nghiệm người dùng với giao diện đẹp mắt và nhiều tính năng thông minh.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.2-purple.svg)

## 📸 Giao diện

```
┌─────────────────────────────────────────────────────────────────┐
│  🎵 Music Player                    🌙 Dark Mode   ⏰ Sleep Timer │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  │  📂 Danh sách phát     ➕ Thêm bài hát │
│  │                 │  │  ┌─────────────────────────────────────┐ │
│  │   Album Art     │  │  │ 🔍 Tìm kiếm bài hát...            │ │
│  │    200x200      │  │  └─────────────────────────────────────┘ │
│  │                 │  │  ♪ Bài hát 1 - Nghệ sĩ A        3:45 │
│  └─────────────────┘  │  ♪ Bài hát 2 - Nghệ sĩ B        4:12 │
│  Now Playing          │  ♪ Bài hát 3 - Nghệ sĩ C        2:33 │
│  ■■■■■■■□□□ 2:15/3:45  │                                     │
│  ⏮️ ⏯️ ⏭️  🔀 🔁       │                                     │
│  🔊 ████████████ 70%   │                                     │
└─────────────────────────────────────────────────────────────────┘
```

## ✨ Tính năng chính

### 🎵 **Player Core**
- ✅ **Phát/dừng/chuyển bài** với đầy đủ controls
- ✅ **Thanh tiến trình tương tác** - click để jump đến vị trí bất kỳ
- ✅ **Điều chỉnh âm lượng** với slider mượt mà
- ✅ **Hiển thị thời gian** real-time và tổng thời lượng
- ✅ **Shuffle & Repeat** modes (None/All/One) thông minh
- ✅ **Keyboard shortcuts** toàn diện

### 🎨 **Giao diện & UX**
- ✅ **Responsive design** - tối ưu cho mọi thiết bị
- ✅ **Dark/Light mode** với animation chuyển đổi mượt
- ✅ **Modern UI** với Bootstrap 5 và custom CSS
- ✅ **Loading states** và micro-animations
- ✅ **Toast notifications** thông minh
- ✅ **Drag & drop** sắp xếp playlist

### 📂 **Quản lý Playlist**
- ✅ **Upload file MP3** với modal nhập thông tin chi tiết
- ✅ **Tìm kiếm bài hát** theo tên hoặc nghệ sĩ
- ✅ **Thêm/xóa/sắp xếp** bài hát dễ dàng
- ✅ **Audio preview** ngay trong modal upload
- ✅ **Smart title extraction** từ tên file
- ✅ **Export/Import playlist** định dạng JSON

### 💾 **Lưu trữ & Cài đặt**
- ✅ **LocalStorage** tự động lưu mọi thay đổi
- ✅ **Khôi phục trạng thái** khi reload trang
- ✅ **Persistent settings** - theme, volume, playlist
- ✅ **Backup/restore** data hoàn chỉnh

### ⭐ **Tính năng nâng cao**
- 🌙 **Dark/Light Mode** - Chuyển đổi theme mượt mà
- ⏰ **Sleep Timer** - Hẹn giờ tắt nhạc (5, 10, 30, 60 phút)
- ⌨️ **Keyboard Shortcuts** - Điều khiển đầy đủ bằng phím tắt
- 💾 **Auto-save** - Tự động lưu mọi thay đổi
- 🎯 **Smart Upload** - Modal nhập thông tin bài hát thông minh

### 🎵 **Music Sources**

**📻 Auto-Loading:**
- **Radio Browser** - Live radio stations worldwide (auto-loaded on startup)

**📁 Manual Adding:**
- Upload MP3, WAV, M4A, OGG files  
- Add songs via URL
- Copy files to `music/` folder

> **🚀 New:** App automatically loads radio stations when you open it!

## 🚀 Cài đặt và Chạy

### 📋 Yêu cầu hệ thống
- **Browser:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript:** Enabled
- **LocalStorage:** Available
- **File API:** Supported (cho upload files)

### 🔧 Cách 1: Chạy trực tiếp (Nhanh)
```bash
# 1. Download hoặc clone dự án
git clone <repository-url>
cd music-player-app

# 2. Mở trực tiếp file HTML
# Windows
start index.html
# macOS  
open index.html
# Linux
xdg-open index.html
```

### 🌐 Cách 2: Sử dụng Web Server (Khuyến nghị)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000

# VS Code Live Server
# Right-click index.html > "Open with Live Server"
```

Sau đó truy cập: **http://localhost:8000**

### ⚡ Cách 3: Deploy lên hosting
Upload toàn bộ thư mục lên **GitHub Pages**, **Netlify**, **Vercel**, hoặc hosting bất kỳ.

## 📁 Cấu trúc dự án

```
music-player-app/
├── 📄 index.html                 # Giao diện chính
├── 📄 README.md                  # Documentation
├── 📂 css/
│   └── 📄 style.css             # CSS tùy chỉnh với themes
├── 📂 js/                       # JavaScript modules
│   ├── 📄 app.js                # Module chính - khởi tạo app
│   ├── 📄 storage.js            # LocalStorage management  
│   ├── 📄 theme.js              # Dark/Light mode system
│   ├── 📄 timer.js              # Sleep timer functionality
│   ├── 📄 player.js             # Core music player logic
│   └── 📄 playlist.js           # Playlist & upload management
├── 📂 music/                    # Thư mục cho file nhạc
│   └── 📄 .gitkeep              # Giữ thư mục trong git
└── 📂 images/                   # Hình ảnh và artwork
    └── 📄 default-artwork.jpg   # Album art mặc định
```

## ⌨️ Keyboard Shortcuts

| Phím tắt | Chức năng | Mô tả |
|----------|-----------|-------|
| `Space` | Phát/Dừng | Toggle play/pause |
| `←` | Bài trước | Previous track |
| `→` | Bài tiếp | Next track |  
| `↑` | Tăng âm lượng | Volume +5% |
| `↓` | Giảm âm lượng | Volume -5% |
| `M` | Tắt/Bật tiếng | Toggle mute |
| `Ctrl+S` | Toggle Shuffle | Bật/tắt phát ngẫu nhiên |
| `Ctrl+R` | Toggle Repeat | Chuyển đổi chế độ lặp |
| `Ctrl+F` | Focus search | Tìm kiếm bài hát |
| `Ctrl+Shift+T` | Toggle theme | Chuyển Dark/Light mode |
| `Ctrl+Shift+S` | Sleep Timer | Mở hẹn giờ tắt nhạc |
| `F1` | Help | Hiện hướng dẫn |
| `Alt+I` | App Info | Thông tin ứng dụng |

## 🎯 Hướng dẫn sử dụng

### 1️⃣ **Thêm bài hát mới**

> **📻 Auto-Load:** Ứng dụng tự động tải radio stations khi khởi động!

#### 🎵 Upload từ máy tính (Khuyến nghị)
1. Click nút **"➕ Thêm bài hát"**
2. Chọn file MP3/WAV/M4A từ máy tính
3. **Modal sẽ hiện ra** với:
   - 🎧 **Audio preview** 
   - 📝 **Form nhập thông tin:**
     - **Tên bài hát*** (bắt buộc)
     - **Nghệ sĩ*** (bắt buộc)  
     - **Album** (tùy chọn)
     - **Artwork URL** (tùy chọn)
   - 💡 **Gợi ý nhanh:**
     - "Lấy từ tên file" - Tự động phân tích tên file
     - "Artwork ngẫu nhiên" - Tạo link ảnh random
4. Click **"Thêm vào playlist"**

#### 🌐 Thêm từ URL
1. Click **"➕ Thêm bài hát"** → Tab **"From URL"**
2. Paste URL của file MP3/OGG/WAV
3. Nhập thông tin bài hát
4. Click **"Preview URL"** để test trước
5. Click **"Thêm từ URL"**

#### 💻 Thêm bằng code (Advanced)
```javascript
// Mở Console (F12) và chạy:
window.playlist.addSong({
    src: 'https://example.com/song.mp3',
    title: 'Tên bài hát',
    artist: 'Nghệ sĩ',
    duration: '3:45',
    artwork: 'https://example.com/artwork.jpg'
});
```

### 2️⃣ **Điều khiển phát nhạc**

#### 🎮 Cơ bản
- **Click bài hát** trong playlist để phát
- **Sử dụng controls:** ⏮️ ⏯️ ⏭️ 
- **Click thanh tiến trình** để jump đến vị trí
- **Kéo slider âm lượng** để điều chỉnh

#### 🔀 Modes nâng cao
- **Shuffle:** 🔀 Phát ngẫu nhiên từ playlist
- **Repeat:** 🔁 Lặp lại
  - `None` → `All` → `One` → `None`

### 3️⃣ **Tìm kiếm & quản lý**

#### 🔍 Tìm kiếm
- Gõ **tên bài hát** hoặc **nghệ sĩ** vào ô search
- Nhấn `Escape` để xóa search
- Hoặc `Ctrl+F` để focus vào search box

#### 🗂️ Sắp xếp playlist
- **Drag & drop** bài hát để thay đổi thứ tự
- **Click 🗑️** để xóa bài hát
- **"Xóa tất cả"** để làm sạch playlist

### 4️⃣ **Themes & Settings**

#### 🌙 Dark/Light Mode
- Click nút **"Dark Mode"** / **"Light Mode"**
- Hoặc dùng `Ctrl+Shift+T`
- Theme được **lưu tự động**

#### ⏰ Sleep Timer
- Click **"Sleep Timer"**
- Chọn thời gian: **5, 10, 30, 60 phút**
- Nhạc sẽ **tự động dừng** và **fade out** khi hết giờ
- **Cảnh báo** khi còn 1 phút và 30 giây

### 5️⃣ **Backup & Restore**

#### 💾 Xuất Playlist
- Click **"Lưu playlist"** 
- File JSON sẽ được download
- Chứa **tất cả thông tin** bài hát

#### 📥 Nhập Playlist  
```javascript
// Upload file JSON đã xuất trước đó
// (Tính năng UI đang phát triển)
```

## 🛠️ Phát triển & Tùy chỉnh

### 🎨 Custom Theme Colors
```css
/* Thêm vào css/style.css */
:root {
    --primary-color: #your-primary-color;
    --secondary-color: #your-secondary-color;
    --bg-primary: #your-background;
}

[data-theme="dark"] {
    --primary-color: #your-dark-primary;
    --bg-primary: #your-dark-background;
}
```

### 🔧 API tùy chỉnh
```javascript
// Truy cập modules từ Console
window.app.getAppInfo();           // Thông tin ứng dụng
window.player.getPlayerInfo();     // Trạng thái player
window.playlist.getPlaylistInfo(); // Thông tin playlist
window.storage.getStorageInfo();   // Dung lượng storage

// Lắng nghe events
document.addEventListener('musicplay', (e) => {
    console.log('Đang phát:', e.detail.song);
});

document.addEventListener('themechange', (e) => {
    console.log('Theme changed:', e.detail.newTheme);
});
```

### 🏗️ Kiến trúc Module
```javascript
// Mỗi module độc lập và có thể tái sử dụng
const storage = new Storage();
const theme = new ThemeManager(storage);  
const playlist = new PlaylistManager(storage);
const player = new MusicPlayer(storage);
const timer = new SleepTimer(player);

// App kết nối tất cả modules
const app = new MusicPlayerApp();
```

## 🔧 Troubleshooting

### ❌ **File không upload được**
**Triệu chứng:** Click "Thêm bài hát" nhưng không có gì xảy ra
```
✅ Kiểm tra: File phải là .mp3, .wav, .m4a, .ogg
✅ Kiểm tra: File < 50MB  
✅ Kiểm tra: Browser hỗ trợ File API
✅ Thử: File khác hoặc browser khác
```

### ❌ **Không phát được nhạc**
**Triệu chứng:** Bài hát trong playlist nhưng không phát
```
✅ Mở Console (F12) xem lỗi chi tiết
✅ Kiểm tra: File còn tồn tại không
✅ Kiểm tra: Browser hỗ trợ định dạng
✅ Thử: Reload trang (F5)
```

### ❌ **Không lưu được settings**
**Triệu chứng:** Reload trang mất hết cài đặt
```
✅ Kiểm tra: LocalStorage có bị disabled không
✅ Kiểm tra: Browser không ở chế độ Incognito
✅ Thử: Clear cache và cookies
✅ Kiểm tra: Dung lượng storage còn không
```

### ❌ **Theme không đổi**
**Triệu chứng:** Click Dark/Light mode không có hiệu ứng
```  
✅ Kiểm tra: CSS variables có load đúng không
✅ Kiểm tra: Console có lỗi JavaScript không
✅ Thử: Hard refresh (Ctrl+F5)
✅ Kiểm tra: Browser hỗ trợ CSS custom properties
```

## 📊 Hiệu suất & Tối ưu

### ⚡ **Performance**
- **Lazy loading** cho large playlists
- **Debounced search** (300ms delay)
- **Memory cleanup** cho audio elements
- **Optimized CSS** với hardware acceleration

### 💾 **Storage Management**
- **Smart filtering** - chỉ lưu data cần thiết
- **Compression** cho large base64 strings  
- **Cleanup** expired data tự động
- **Storage quota** monitoring

### 🔒 **Security**
- **Input sanitization** cho user data
- **XSS protection** với escapeHtml
- **File type validation** nghiêm ngặt
- **Size limits** để tránh DoS

## 🚧 Roadmap & Tính năng tương lai

### 🎯 **v1.1.0 - Q1 2024**
- [ ] **Audio Visualizer** - Thanh sóng nhạc real-time
- [ ] **Lyrics Display** - Hiện lời bài hát (LRC format)
- [ ] **Multiple Playlists** - Quản lý nhiều playlist
- [ ] **Crossfade** - Chuyển bài mượt mà

### 🎯 **v1.2.0 - Q2 2024**  
- [ ] **Equalizer** - Điều chỉnh âm thanh chi tiết
- [ ] **Online Integration** - YouTube, Spotify API
- [ ] **Cloud Sync** - Đồng bộ across devices
- [ ] **Podcast Support** - Phát podcast và audiobook

### 🎯 **v2.0.0 - Q3 2024**
- [ ] **PWA Support** - Install như native app
- [ ] **Offline Mode** - Hoạt động không cần internet  
- [ ] **Social Features** - Share playlists
- [ ] **AI Recommendations** - Gợi ý bài hát thông minh

## 🤝 Đóng góp

### 🐛 **Bug Reports**
1. Mở [GitHub Issues](link-to-issues)
2. Mô tả chi tiết **triệu chứng**
3. Đính kèm **Console logs** 
4. Ghi rõ **Browser** và **OS**

### ✨ **Feature Requests**
1. Check **Roadmap** trước khi request
2. Giải thích **use case** cụ thể
3. Mockup hoặc **wireframe** nếu có

### 💻 **Pull Requests**
```bash
# 1. Fork repository
git clone your-fork-url
cd music-player-app

# 2. Tạo feature branch  
git checkout -b feature/amazing-feature

# 3. Code và test
# 4. Commit với message rõ ràng
git commit -m "Add: Amazing feature for better UX"

# 5. Push và tạo PR
git push origin feature/amazing-feature
```

### 📋 **Coding Standards**
- **ES6+** JavaScript với modules
- **Mobile-first** responsive design
- **Accessibility** với ARIA labels
- **Performance** optimization luôn được ưu tiên
- **Documentation** cho mọi function

## 📄 License

Dự án này được phát hành dưới **MIT License**. Xem file [LICENSE](LICENSE) để biết chi tiết.

```
MIT License - Bạn có thể:
✅ Sử dụng cho mục đích thương mại
✅ Modify và distribute  
✅ Private use
✅ Sublicense

⚠️ Điều kiện: Giữ nguyên copyright notice
```

## 👨‍💻 Tác giả

- 🎯 **Tối ưu:** Performance, Code quality, Best practices
- 📧 **Contact:** [dangkhoahuynh2511@gmail.com]
- 🌐 **Portfolio:** [http://kaih.vercel.app]

---

## 🎵 **Enjoy your music!** 

*Được phát triển với ❤️ tại Việt Nam*

**⭐ Nếu thấy hữu ích, hãy star repo này nhé!**

[![GitHub stars](https://img.shields.io/github/stars/Khoahuynh2511/music-player?style=social)](https://github.com/Khoahuynh2511/vmusic)
[![GitHub forks](https://img.shields.io/github/forks/Khoahuynh2511/music-player?style=social)](https://github.com/Khoahuynh2511/vmusic)

---
 