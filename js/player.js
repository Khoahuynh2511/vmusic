/**
 * ========================================
 * PLAYER MODULE - Core Music Player Logic
 * ========================================
 * Chức năng: Quản lý phát nhạc chính
 * - Play/Pause/Stop functionality
 * - Next/Previous track
 * - Volume control
 * - Progress tracking
 * - Shuffle/Repeat modes
 */

class MusicPlayer {
    constructor(storage) {
        this.storage = storage;
        this.audio = null;
        this.isPlaying = false;
        this.currentIndex = 0;
        this.volume = 70;
        
        // Player state
        this.isShuffleOn = false;
        this.repeatMode = 'none'; // 'none', 'one', 'all'
        this.shuffleOrder = [];
        this.originalOrder = [];
        
        // UI Elements
        this.playPauseBtn = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.shuffleBtn = null;
        this.repeatBtn = null;
        this.volumeSlider = null;
        this.volumeValue = null;
        this.progressBar = null;
        this.currentTimeSpan = null;
        this.durationSpan = null;
        this.currentSongTitle = null;
        this.currentArtist = null;
        this.songArtwork = null;

        this.init();
    }

    /**
     * Khởi tạo music player
     */
    init() {
        this.initializeElements();
        this.loadSettings();
        this.bindEvents();
        this.setupAudioEventListeners();
        
        console.log('✅ Music Player đã khởi tạo');
    }

    /**
     * Khởi tạo DOM elements
     */
    initializeElements() {
        this.audio = document.getElementById('audio');
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.shuffleBtn = document.getElementById('shuffle');
        this.repeatBtn = document.getElementById('repeat');
        this.volumeSlider = document.getElementById('volume');
        this.volumeValue = document.getElementById('volume-value');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeSpan = document.getElementById('current-time');
        this.durationSpan = document.getElementById('duration');
        this.currentSongTitle = document.getElementById('current-song-title');
        this.currentArtist = document.getElementById('current-artist');
        this.songArtwork = document.getElementById('song-artwork');
    }

    /**
     * Tải settings đã lưu
     */
    loadSettings() {
        // Load volume
        this.volume = this.storage.loadVolume();
        this.setVolume(this.volume);
        
        // Load shuffle/repeat states
        this.isShuffleOn = this.storage.loadShuffle();
        this.repeatMode = this.storage.loadRepeat();
        this.updateShuffleButton();
        this.updateRepeatButton();
        
        // Load current index
        this.currentIndex = this.storage.loadCurrentIndex();
    }

    /**
     * Gắn event listeners
     */
    bindEvents() {
        // Play/Pause button
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // Previous/Next buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.playPrevious();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.playNext();
            });
        }

        // Shuffle button
        if (this.shuffleBtn) {
            this.shuffleBtn.addEventListener('click', () => {
                this.toggleShuffle();
            });
        }

        // Repeat button
        if (this.repeatBtn) {
            this.repeatBtn.addEventListener('click', () => {
                this.toggleRepeat();
            });
        }

        // Volume control
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseInt(e.target.value));
            });
        }

        // Progress bar click to seek
        if (this.progressBar && this.progressBar.parentElement) {
            this.progressBar.parentElement.addEventListener('click', (e) => {
                this.seekToPosition(e);
            });
        }

        // Keyboard shortcuts
        this.bindKeyboardShortcuts();
    }

    /**
     * Gắn keyboard shortcuts
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Chỉ hoạt động khi không focus vào input
            if (e.target.tagName.toLowerCase() === 'input') return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.playPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.playNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.setVolume(Math.min(100, this.volume + 5));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.setVolume(Math.max(0, this.volume - 5));
                    break;
                case 'KeyM':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case 'KeyS':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.toggleShuffle();
                    }
                    break;
                case 'KeyR':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.toggleRepeat();
                    }
                    break;
            }
        });
    }

    /**
     * Thiết lập audio event listeners
     */
    setupAudioEventListeners() {
        if (!this.audio) return;

        // Khi metadata được load
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        // Cập nhật progress bar
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // Khi bài hát kết thúc
        this.audio.addEventListener('ended', () => {
            this.onSongEnded();
        });

        // Xử lý lỗi
        this.audio.addEventListener('error', (e) => {
            this.onAudioError(e);
        });

        // Khi bắt đầu load
        this.audio.addEventListener('loadstart', () => {
            this.showLoadingState();
        });

        // Khi có thể phát
        this.audio.addEventListener('canplay', () => {
            this.hideLoadingState();
        });

        // Khi đang loading
        this.audio.addEventListener('waiting', () => {
            this.showLoadingState();
        });

        // Khi có thể phát tiếp
        this.audio.addEventListener('canplaythrough', () => {
            this.hideLoadingState();
        });
    }

    /**
     * Phát bài hát theo index
     * @param {number} index - Index của bài hát trong playlist
     */
    playSong(index) {
        if (!window.playlist || !window.playlist.songs || index < 0 || index >= window.playlist.songs.length) {
            console.error('❌ Index không hợp lệ hoặc playlist trống');
            return;
        }

        const song = window.playlist.songs[index];
        this.currentIndex = index;

        // Update UI
        this.updateCurrentSongInfo(song);
        
        // Load audio
        this.audio.src = song.src;
        this.audio.load();

        // Play
        this.play();

        // Save current song
        this.storage.saveCurrentIndex(index);
        this.storage.saveCurrentSong(song);

        // Update playlist UI
        if (window.playlist && window.playlist.updateActiveItem) {
            window.playlist.updateActiveItem(index);
        }

        console.log(`🎵 Đang phát: ${song.title} - ${song.artist}`);
    }

    /**
     * Phát nhạc
     */
    async play() {
        if (!this.audio.src) return;

        try {
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayPauseButton();
            this.dispatchPlayEvent();
        } catch (error) {
            console.error('❌ Lỗi khi phát nhạc:', error);
            this.showError('Không thể phát bài hát này');
        }
    }

    /**
     * Dừng nhạc
     */
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayPauseButton();
            this.dispatchPauseEvent();
        }
    }

    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            // Nếu chưa có bài hát nào, phát bài đầu tiên
            if (!this.audio.src && window.playlist && window.playlist.songs.length > 0) {
                this.playSong(0);
            } else {
                this.play();
            }
        }
    }

    /**
     * Phát bài trước
     */
    playPrevious() {
        if (!window.playlist || !window.playlist.songs.length) return;

        let newIndex;
        
        if (this.isShuffleOn && this.shuffleOrder.length > 0) {
            const currentShuffleIndex = this.shuffleOrder.indexOf(this.currentIndex);
            if (currentShuffleIndex > 0) {
                newIndex = this.shuffleOrder[currentShuffleIndex - 1];
            } else {
                newIndex = this.shuffleOrder[this.shuffleOrder.length - 1];
            }
        } else {
            newIndex = this.currentIndex > 0 
                ? this.currentIndex - 1 
                : window.playlist.songs.length - 1;
        }
        
        this.playSong(newIndex);
    }

    /**
     * Phát bài tiếp
     */
    playNext() {
        if (!window.playlist || !window.playlist.songs.length) return;

        let newIndex;
        
        if (this.isShuffleOn && this.shuffleOrder.length > 0) {
            const currentShuffleIndex = this.shuffleOrder.indexOf(this.currentIndex);
            if (currentShuffleIndex < this.shuffleOrder.length - 1) {
                newIndex = this.shuffleOrder[currentShuffleIndex + 1];
            } else {
                newIndex = this.shuffleOrder[0];
            }
        } else {
            newIndex = this.currentIndex < window.playlist.songs.length - 1 
                ? this.currentIndex + 1 
                : 0;
        }
        
        this.playSong(newIndex);
    }

    /**
     * Xử lý khi bài hát kết thúc
     */
    onSongEnded() {
        switch (this.repeatMode) {
            case 'one':
                // Lặp lại bài hiện tại
                this.audio.currentTime = 0;
                this.play();
                break;
            case 'all':
                // Chuyển bài tiếp
                this.playNext();
                break;
            default:
                // Dừng khi hết playlist (trừ khi là bài cuối)
                if (this.currentIndex < window.playlist.songs.length - 1 || this.isShuffleOn) {
                    this.playNext();
                } else {
                    this.pause();
                }
        }
    }

    /**
     * Toggle shuffle mode
     */
    toggleShuffle() {
        this.isShuffleOn = !this.isShuffleOn;
        
        if (this.isShuffleOn) {
            this.generateShuffleOrder();
        }
        
        this.updateShuffleButton();
        this.storage.saveShuffle(this.isShuffleOn);
        
        console.log(`🔀 Shuffle: ${this.isShuffleOn ? 'BẬT' : 'TẮT'}`);
    }

    /**
     * Tạo thứ tự shuffle
     */
    generateShuffleOrder() {
        if (!window.playlist || !window.playlist.songs.length) return;
        
        this.shuffleOrder = [...Array(window.playlist.songs.length).keys()];
        
        // Fisher-Yates shuffle
        for (let i = this.shuffleOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffleOrder[i], this.shuffleOrder[j]] = [this.shuffleOrder[j], this.shuffleOrder[i]];
        }
    }

    /**
     * Toggle repeat mode
     */
    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentModeIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentModeIndex + 1) % modes.length];
        
        this.updateRepeatButton();
        this.storage.saveRepeat(this.repeatMode);
        
        console.log(`🔁 Repeat: ${this.repeatMode}`);
    }

    /**
     * Thiết lập âm lượng
     * @param {number} volume - Âm lượng từ 0-100
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        
        if (this.audio) {
            this.audio.volume = this.volume / 100;
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.value = this.volume;
        }
        
        if (this.volumeValue) {
            this.volumeValue.textContent = `${this.volume}%`;
        }
        
        this.storage.saveVolume(this.volume);
        this.updateVolumeIcon();
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        if (this.volume > 0) {
            this.previousVolume = this.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 70);
        }
    }

    /**
     * Seek đến vị trí trong bài hát
     * @param {Event} e - Click event
     */
    seekToPosition(e) {
        if (!this.audio.duration) return;
        
        const progressContainer = e.currentTarget;
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audio.duration;
        
        this.audio.currentTime = newTime;
    }

    /**
     * Cập nhật thông tin bài hát hiện tại
     * @param {Object} song - Thông tin bài hát
     */
    updateCurrentSongInfo(song) {
        if (this.currentSongTitle) {
            this.currentSongTitle.textContent = song.title;
        }
        
        if (this.currentArtist) {
            this.currentArtist.textContent = song.artist;
        }
        
        if (this.songArtwork) {
            this.songArtwork.src = song.artwork || 'images/default-artwork.jpg';
            this.songArtwork.alt = `${song.title} - ${song.artist}`;
        }

        // Update page title
        document.title = `🎵 ${song.title} - ${song.artist} | Music Player`;
    }

    /**
     * Cập nhật nút play/pause
     */
    updatePlayPauseButton() {
        if (!this.playPauseBtn) return;
        
        const icon = this.playPauseBtn.querySelector('i');
        if (this.isPlaying) {
            icon.className = 'bi bi-pause-fill';
            this.playPauseBtn.title = 'Dừng';
        } else {
            icon.className = 'bi bi-play-fill';
            this.playPauseBtn.title = 'Phát';
        }
    }

    /**
     * Cập nhật nút shuffle
     */
    updateShuffleButton() {
        if (!this.shuffleBtn) return;
        
        if (this.isShuffleOn) {
            this.shuffleBtn.classList.add('btn-primary');
            this.shuffleBtn.classList.remove('btn-outline-secondary');
        } else {
            this.shuffleBtn.classList.remove('btn-primary');
            this.shuffleBtn.classList.add('btn-outline-secondary');
        }
    }

    /**
     * Cập nhật nút repeat
     */
    updateRepeatButton() {
        if (!this.repeatBtn) return;
        
        const icon = this.repeatBtn.querySelector('i');
        
        // Reset classes
        this.repeatBtn.classList.remove('btn-primary', 'btn-warning', 'btn-outline-secondary');
        
        switch (this.repeatMode) {
            case 'none':
                this.repeatBtn.classList.add('btn-outline-secondary');
                icon.className = 'bi bi-arrow-repeat';
                this.repeatBtn.title = 'Không lặp';
                break;
            case 'all':
                this.repeatBtn.classList.add('btn-primary');
                icon.className = 'bi bi-arrow-repeat';
                this.repeatBtn.title = 'Lặp tất cả';
                break;
            case 'one':
                this.repeatBtn.classList.add('btn-warning');
                icon.className = 'bi bi-repeat-1';
                this.repeatBtn.title = 'Lặp bài hiện tại';
                break;
        }
    }

    /**
     * Cập nhật icon volume
     */
    updateVolumeIcon() {
        const volumeIcon = document.querySelector('.volume-control i');
        if (!volumeIcon) return;
        
        if (this.volume === 0) {
            volumeIcon.className = 'bi bi-volume-mute me-2';
        } else if (this.volume < 30) {
            volumeIcon.className = 'bi bi-volume-down me-2';
        } else {
            volumeIcon.className = 'bi bi-volume-up me-2';
        }
    }

    /**
     * Cập nhật progress bar
     */
    updateProgress() {
        if (!this.audio.duration || !this.progressBar) return;
        
        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${percentage}%`;
        
        // Update time display
        if (this.currentTimeSpan) {
            this.currentTimeSpan.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    /**
     * Cập nhật duration display
     */
    updateDuration() {
        if (this.durationSpan && this.audio.duration) {
            this.durationSpan.textContent = this.formatTime(this.audio.duration);
        }
    }

    /**
     * Format time thành mm:ss
     * @param {number} seconds
     * @returns {string}
     */
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Hiện trạng thái loading
     */
    showLoadingState() {
        if (this.playPauseBtn) {
            const icon = this.playPauseBtn.querySelector('i');
            icon.className = 'bi bi-hourglass-split';
        }
    }

    /**
     * Ẩn trạng thái loading
     */
    hideLoadingState() {
        this.updatePlayPauseButton();
    }

    /**
     * Hiện thông báo lỗi
     * @param {string} message
     */
    showError(message) {
        console.error('❌ Player Error:', message);
        
        if (window.showNotification) {
            window.showNotification(message, 'error');
        }
    }

    /**
     * Dispatch play event
     */
    dispatchPlayEvent() {
        const event = new CustomEvent('musicplay', {
            detail: {
                song: window.playlist?.songs[this.currentIndex],
                index: this.currentIndex,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Dispatch pause event
     */
    dispatchPauseEvent() {
        const event = new CustomEvent('musicpause', {
            detail: {
                song: window.playlist?.songs[this.currentIndex],
                index: this.currentIndex,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Xử lý lỗi audio
     * @param {Event} e
     */
    onAudioError(e) {
        console.error('❌ Audio Error:', e);
        this.showError('Lỗi khi tải file âm thanh');
    }

    /**
     * Lấy thông tin player hiện tại
     * @returns {Object}
     */
    getPlayerInfo() {
        return {
            isPlaying: this.isPlaying,
            currentIndex: this.currentIndex,
            volume: this.volume,
            isShuffleOn: this.isShuffleOn,
            repeatMode: this.repeatMode,
            currentTime: this.audio?.currentTime || 0,
            duration: this.audio?.duration || 0,
            currentSong: window.playlist?.songs[this.currentIndex] || null
        };
    }

    /**
     * Hủy player
     */
    destroy() {
        this.pause();
        
        if (this.audio) {
            this.audio.src = '';
        }
        
        console.log('🧹 Music Player đã được hủy');
    }
}

// Export để app.js sử dụng
window.MusicPlayer = MusicPlayer; 