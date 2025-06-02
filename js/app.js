/**
 * ========================================
 * MAIN APP MODULE - Ứng dụng Music Player
 * ========================================
 * Chức năng: Khởi tạo và quản lý toàn bộ ứng dụng
 * - Kết nối tất cả modules
 * - Global event handlers
 * - App lifecycle management
 * - Notification system
 */

class MusicPlayerApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        
        // Global notification function
        window.showNotification = this.showNotification.bind(this);
        
        this.init();
    }

    /**
     * Khởi tạo ứng dụng
     */
    async init() {
        try {
            console.log('🚀 Đang khởi tạo Music Player App...');
            
            // Hiện loading screen
            this.showLoadingScreen();
            
            // Đợi DOM loaded
            await this.waitForDOM();
            
            // Khởi tạo các modules theo thứ tự
            await this.initializeModules();
            
            // Kết nối các modules
            this.connectModules();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Load trạng thái đã lưu
            await this.loadSavedState();
            
            // Ẩn loading screen
            this.hideLoadingScreen();
            
            // Hoàn thành khởi tạo
            this.isInitialized = true;
            
            console.log('✅ Music Player App đã khởi tạo thành công!');
            this.showNotification('🎵 Music Player sẵn sàng sử dụng!', 'success');
            
        } catch (error) {
            console.error('❌ Lỗi khởi tạo ứng dụng:', error);
            this.showError('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.');
        }
    }

    /**
     * Đợi DOM loaded
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Khởi tạo các modules
     */
    async initializeModules() {
        console.log('📦 Đang khởi tạo các modules...');
        
        // 1. Storage Module (cần khởi tạo đầu tiên)
        this.modules.storage = new Storage();
        
        // 2. Theme Manager
        this.modules.theme = new ThemeManager(this.modules.storage);
        
        // 3. Playlist Manager
        this.modules.playlist = new PlaylistManager(this.modules.storage);
        
        // 4. Music Player
        this.modules.player = new MusicPlayer(this.modules.storage);
        
        // 5. Sleep Timer
        this.modules.timer = new SleepTimer(this.modules.player);
        
        // Gán vào window để các modules khác truy cập
        window.storage = this.modules.storage;
        window.playlist = this.modules.playlist;
        window.player = this.modules.player;
        window.theme = this.modules.theme;
        window.timer = this.modules.timer;
        
        console.log('✅ Tất cả modules đã được khởi tạo');
    }

    /**
     * Kết nối các modules với nhau
     */
    connectModules() {
        console.log('🔗 Đang kết nối các modules...');
        
        // Kết nối Player với Playlist
        if (this.modules.playlist.songs.length > 0) {
            // Load bài hát đầu tiên nếu có
            const savedIndex = this.modules.storage.loadCurrentIndex();
            if (savedIndex < this.modules.playlist.songs.length) {
                this.modules.playlist.updateActiveItem(savedIndex);
            }
        }
        
        console.log('✅ Các modules đã được kết nối');
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEvents() {
        // Theme change events
        document.addEventListener('themechange', (e) => {
            console.log(`🎨 Theme đã thay đổi: ${e.detail.oldTheme} → ${e.detail.newTheme}`);
        });

        // Music play/pause events
        document.addEventListener('musicplay', (e) => {
            this.onMusicPlay(e.detail);
        });

        document.addEventListener('musicpause', (e) => {
            this.onMusicPause(e.detail);
        });

        // Sleep timer events
        document.addEventListener('sleeptimerexpired', (e) => {
            console.log('😴 Sleep timer đã hết hạn');
        });

        // Window events
        window.addEventListener('beforeunload', () => {
            this.onBeforeUnload();
        });

        // Visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            this.onVisibilityChange();
        });

        // Error handling
        window.addEventListener('error', (e) => {
            console.error('🚨 Global Error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('🚨 Unhandled Promise Rejection:', e.reason);
        });

        // Keyboard shortcuts toàn cục
        this.setupGlobalKeyboardShortcuts();
        
        console.log('⌨️ Global event listeners đã được thiết lập');
    }

    /**
     * Setup keyboard shortcuts toàn cục
     */
    setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Media keys support
            if (e.target.tagName.toLowerCase() === 'input') return;

            // Phím tắt toàn cục với Alt
            if (e.altKey) {
                switch (e.key) {
                    case 'h':
                        e.preventDefault();
                        this.showHelpModal();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.showAppInfo();
                        break;
                }
            }

            // F key functions
            switch (e.key) {
                case 'F1':
                    e.preventDefault();
                    this.showHelpModal();
                    break;
            }
        });
    }

    /**
     * Load trạng thái đã lưu
     */
    async loadSavedState() {
        console.log('💾 Đang tải trạng thái đã lưu...');
        
        try {
            // Load current song nếu có
            const savedSong = this.modules.storage.loadCurrentSong();
            const savedIndex = this.modules.storage.loadCurrentIndex();
            
            if (savedSong && this.modules.playlist.songs[savedIndex]) {
                this.modules.playlist.updateActiveItem(savedIndex);
                // Không tự động phát nhạc khi load
            }
            
            console.log('✅ Trạng thái đã được khôi phục');
        } catch (error) {
            console.warn('⚠️ Không thể khôi phục trạng thái:', error);
        }
    }

    /**
     * Xử lý khi nhạc bắt đầu phát
     */
    onMusicPlay(detail) {
        // Cập nhật document title
        if (detail.song) {
            document.title = `🎵 ${detail.song.title} - ${detail.song.artist} | Music Player`;
        }

        // Cập nhật favicon (nếu có)
        this.updateFavicon('🎵');
    }

    /**
     * Xử lý khi nhạc dừng
     */
    onMusicPause(detail) {
        document.title = '🎵 Music Player - Trình phát nhạc Online';
        this.updateFavicon('⏸️');
    }

    /**
     * Cập nhật favicon
     */
    updateFavicon(emoji) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
        }
    }

    /**
     * Xử lý khi tab thay đổi visibility
     */
    onVisibilityChange() {
        if (document.hidden) {
            // Tab ẩn
            console.log('👁️ Tab đã bị ẩn');
        } else {
            // Tab hiện
            console.log('👁️ Tab đã hiện lại');
        }
    }

    /**
     * Xử lý trước khi đóng trang
     */
    onBeforeUnload() {
        // Lưu trạng thái cuối cùng
        if (this.modules.player) {
            const playerInfo = this.modules.player.getPlayerInfo();
            this.modules.storage.saveCurrentIndex(playerInfo.currentIndex);
            this.modules.storage.saveVolume(playerInfo.volume);
        }
        
        console.log('💾 Đã lưu trạng thái trước khi đóng');
    }

    /**
     * Hiện loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    /**
     * Ẩn loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000); // Hiện loading ít nhất 1 giây
        }
    }

    /**
     * Hiện thông báo toast
     */
    showNotification(message, type = 'info') {
        const toastElement = document.getElementById('notification-toast');
        const toastBody = document.getElementById('toast-message');
        
        if (!toastElement || !toastBody) {
            console.log(`📢 ${message}`);
            return;
        }

        // Clear previous classes
        toastElement.className = 'toast';
        
        // Set message
        toastBody.textContent = message;
        
        // Add appropriate classes
        switch (type) {
            case 'success':
                toastElement.classList.add('bg-success', 'text-white');
                break;
            case 'error':
                toastElement.classList.add('bg-danger', 'text-white');
                break;
            case 'warning':
                toastElement.classList.add('bg-warning', 'text-dark');
                break;
            default:
                toastElement.classList.add('bg-info', 'text-white');
        }
        
        // Show toast
        const toast = new bootstrap.Toast(toastElement, {
            delay: type === 'error' ? 5000 : 3000
        });
        toast.show();
    }

    /**
     * Hiện lỗi
     */
    showError(message) {
        this.showNotification(message, 'error');
        console.error('❌ App Error:', message);
    }

    /**
     * Hiện modal help
     */
    showHelpModal() {
        const helpContent = `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-keyboard"></i> Phím tắt</h6>
                    <ul class="list-unstyled small">
                        <li><kbd>Space</kbd> - Phát/Dừng nhạc</li>
                        <li><kbd>←</kbd> - Bài trước</li>
                        <li><kbd>→</kbd> - Bài tiếp</li>
                        <li><kbd>↑</kbd> - Tăng âm lượng</li>
                        <li><kbd>↓</kbd> - Giảm âm lượng</li>
                        <li><kbd>M</kbd> - Tắt/Bật tiếng</li>
                        <li><kbd>Ctrl+S</kbd> - Toggle Shuffle</li>
                        <li><kbd>Ctrl+R</kbd> - Toggle Repeat</li>
                        <li><kbd>Ctrl+F</kbd> - Tìm kiếm</li>
                        <li><kbd>F1</kbd> - Hiện help</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-gear"></i> Tính năng</h6>
                    <ul class="list-unstyled small">
                        <li>🎵 Phát nhạc với đầy đủ controls</li>
                        <li>🔀 Shuffle & Repeat modes</li>
                        <li>🔍 Tìm kiếm bài hát</li>
                        <li>🌙 Dark/Light mode</li>
                        <li>⏰ Sleep timer</li>
                        <li>💾 Lưu playlist tự động</li>
                        <li>📱 Responsive design</li>
                        <li>⌨️ Keyboard shortcuts</li>
                    </ul>
                </div>
            </div>
        `;

        this.showModal('Hướng dẫn sử dụng', helpContent);
    }

    /**
     * Hiện thông tin app
     */
    showAppInfo() {
        const appInfo = `
            <div class="text-center">
                <h4>🎵 Music Player</h4>
                <p class="text-muted">Trình phát nhạc trực tuyến hiện đại</p>
                
                <div class="row mt-4">
                    <div class="col-6">
                        <h6>Phiên bản</h6>
                        <p>1.0.0</p>
                    </div>
                    <div class="col-6">
                        <h6>Ngày phát hành</h6>
                        <p>${new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
                
                <div class="mt-3">
                    <h6>Công nghệ sử dụng</h6>
                    <p class="small">HTML5, CSS3, JavaScript ES6+, Bootstrap 5, Web Audio API</p>
                </div>
                
                <div class="mt-3">
                    <small class="text-muted">
                        Được phát triển với ❤️ bởi kỹ sư phần mềm kỳ cựu
                    </small>
                </div>
            </div>
        `;

        this.showModal('Thông tin ứng dụng', appInfo);
    }

    /**
     * Hiện modal động
     */
    showModal(title, content) {
        // Tạo modal động
        const modalId = 'dynamicModal';
        let modalElement = document.getElementById(modalId);
        
        if (!modalElement) {
            modalElement = document.createElement('div');
            modalElement.id = modalId;
            modalElement.className = 'modal fade';
            modalElement.tabIndex = -1;
            document.body.appendChild(modalElement);
        }

        modalElement.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

    /**
     * Lấy thông tin app
     */
    getAppInfo() {
        return {
            version: '1.0.0',
            initialized: this.isInitialized,
            modules: Object.keys(this.modules),
            uptime: Date.now() - (this.startTime || Date.now()),
            storage: this.modules.storage?.getStorageInfo() || null,
            player: this.modules.player?.getPlayerInfo() || null,
            playlist: this.modules.playlist?.getPlaylistInfo() || null,
            theme: this.modules.theme?.getCurrentTheme() || null
        };
    }

    /**
     * Restart ứng dụng
     */
    restart() {
        if (confirm('Bạn có chắc muốn khởi động lại ứng dụng?')) {
            location.reload();
        }
    }

    /**
     * Hủy ứng dụng
     */
    destroy() {
        console.log('🧹 Đang hủy Music Player App...');
        
        // Hủy tất cả modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // Clear global references
        delete window.storage;
        delete window.playlist;
        delete window.player;
        delete window.theme;
        delete window.timer;
        delete window.showNotification;
        
        console.log('✅ Music Player App đã được hủy');
    }
}

// Khởi tạo ứng dụng khi trang load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MusicPlayerApp();
});

// Export để có thể truy cập từ console
window.MusicPlayerApp = MusicPlayerApp; 