/**
 * ========================================
 * PLAYLIST MODULE - Quản lý Danh sách phát
 * ========================================
 * Chức năng: Quản lý playlist và giao diện
 * - Add/Remove songs
 * - Search functionality
 * - Drag & drop reordering
 * - Save/Load playlists
 * - Dynamic UI updates
 */

class PlaylistManager {
    constructor(storage) {
        this.storage = storage;
        this.songs = [];
        this.filteredSongs = [];
        this.currentActiveIndex = -1;
        
        // UI Elements
        this.playlistContainer = null;
        this.searchInput = null;
        this.clearPlaylistBtn = null;
        this.savePlaylistBtn = null;
        this.addSongBtn = null;
        this.songFileInput = null;
        
        // Add Song Modal elements
        this.addSongModal = null;
        this.pendingFile = null; // File đang chờ được thêm
        this.pendingDataURL = null;
        
        this.init();
    }

    /**
     * Khởi tạo playlist manager
     */
    init() {
        this.initializeElements();
        this.loadDefaultSongs();
        this.loadSavedPlaylist();
        this.bindEvents();
        this.render();
        
        console.log('✅ Playlist Manager đã khởi tạo');
    }

    /**
     * Khởi tạo DOM elements
     */
    initializeElements() {
        this.playlistContainer = document.getElementById('playlist');
        this.searchInput = document.getElementById('search-songs');
        this.clearPlaylistBtn = document.getElementById('clear-playlist');
        this.savePlaylistBtn = document.getElementById('save-playlist');
        this.addSongBtn = document.getElementById('add-song-btn');
        this.songFileInput = document.getElementById('song-file-input');
        
        // Add Song Modal
        this.addSongModal = new bootstrap.Modal(document.getElementById('addSongModal'));
    }

    /**
     * Tải danh sách bài hát mặc định
     */
    loadDefaultSongs() {
        // Tự động load Radio Browser khi vào app
        console.log('🚀 Auto-loading Radio Browser...');
        setTimeout(() => {
            this.loadRadioStations();
        }, 1000); // Delay 1s để app load xong

        // Hiện thông báo cho user
        setTimeout(() => {
            if (window.showNotification) {
                window.showNotification('📻 Đang tự động tải Radio Stations...', 'info');
            }
        }, 500);
    }

    /**
     * Tải playlist đã lưu từ localStorage
     */
    loadSavedPlaylist() {
        const savedPlaylist = this.storage.loadPlaylist();
        if (savedPlaylist && savedPlaylist.length > 0) {
            this.songs = savedPlaylist;
            console.log(`📂 Đã tải ${savedPlaylist.length} bài hát từ localStorage`);
        }
    }

    /**
     * Gắn event listeners
     */
    bindEvents() {
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterSongs(e.target.value);
            });

            // Clear search với Escape
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }

        // Clear playlist button
        if (this.clearPlaylistBtn) {
            this.clearPlaylistBtn.addEventListener('click', () => {
                this.clearPlaylist();
            });
        }

        // Save playlist button
        if (this.savePlaylistBtn) {
            this.savePlaylistBtn.addEventListener('click', () => {
                this.savePlaylist();
            });
        }

        // Add song button
        if (this.addSongBtn) {
            this.addSongBtn.addEventListener('click', () => {
                this.triggerFileSelect();
            });
        }

        // File input change
        if (this.songFileInput) {
            this.songFileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });
        }

        // Confirm add song button in modal
        const confirmAddBtn = document.getElementById('confirm-add-song');
        if (confirmAddBtn) {
            confirmAddBtn.addEventListener('click', () => {
                this.confirmAddSong();
            });
        }

        // Confirm add URL button
        const confirmAddUrlBtn = document.getElementById('confirm-add-url');
        if (confirmAddUrlBtn) {
            confirmAddUrlBtn.addEventListener('click', () => {
                this.confirmAddURL();
            });
        }

        // URL Form submission
        const urlForm = document.getElementById('url-form');
        if (urlForm) {
            urlForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.confirmAddURL();
            });
        }

        // Tab switching
        const uploadTab = document.getElementById('upload-tab');
        const urlTab = document.getElementById('url-tab');
        const confirmAddSongBtn = document.getElementById('confirm-add-song');
        const confirmAddUrlBtnTab = document.getElementById('confirm-add-url');

        if (uploadTab && urlTab && confirmAddSongBtn && confirmAddUrlBtnTab) {
            uploadTab.addEventListener('shown.bs.tab', () => {
                confirmAddSongBtn.classList.remove('d-none');
                confirmAddUrlBtnTab.classList.add('d-none');
            });

            urlTab.addEventListener('shown.bs.tab', () => {
                confirmAddSongBtn.classList.add('d-none');
                confirmAddUrlBtnTab.classList.remove('d-none');
            });
        }

        // Preview URL button
        const previewUrlBtn = document.getElementById('preview-url');
        if (previewUrlBtn) {
            previewUrlBtn.addEventListener('click', () => {
                this.previewURL();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input') return;

            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.focusSearch();
            }
        });
    }

    /**
     * Thêm bài hát vào playlist
     * @param {Object} song - Thông tin bài hát
     */
    addSong(song) {
        // Tạo ID unique nếu chưa có
        if (!song.id) {
            song.id = this.generateUniqueId();
        }

        // Kiểm tra trùng lặp
        const existingIndex = this.songs.findIndex(s => s.src === song.src);
        if (existingIndex !== -1) {
            console.warn('⚠️ Bài hát đã tồn tại trong playlist');
            this.highlightSong(existingIndex);
            return false;
        }

        this.songs.push(song);
        this.saveToStorage();
        this.render();
        
        console.log(`➕ Đã thêm: ${song.title} - ${song.artist}`);
        this.showNotification(`Đã thêm "${song.title}" vào playlist`);
        
        return true;
    }

    /**
     * Xóa bài hát khỏi playlist
     * @param {number} index - Index của bài hát
     */
    removeSong(index) {
        if (index < 0 || index >= this.songs.length) return;

        const removedSong = this.songs[index];
        this.songs.splice(index, 1);
        
        // Cập nhật currentActiveIndex nếu cần
        if (index === this.currentActiveIndex) {
            this.currentActiveIndex = -1;
        } else if (index < this.currentActiveIndex) {
            this.currentActiveIndex--;
        }

        this.saveToStorage();
        this.render();
        
        console.log(`➖ Đã xóa: ${removedSong.title} - ${removedSong.artist}`);
        this.showNotification(`Đã xóa "${removedSong.title}" khỏi playlist`);
    }

    /**
     * Di chuyển bài hát trong playlist
     * @param {number} fromIndex - Vị trí ban đầu
     * @param {number} toIndex - Vị trí đích
     */
    moveSong(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        if (fromIndex < 0 || fromIndex >= this.songs.length) return;
        if (toIndex < 0 || toIndex >= this.songs.length) return;

        const song = this.songs.splice(fromIndex, 1)[0];
        this.songs.splice(toIndex, 0, song);

        // Cập nhật activeIndex
        if (fromIndex === this.currentActiveIndex) {
            this.currentActiveIndex = toIndex;
        } else if (fromIndex < this.currentActiveIndex && toIndex >= this.currentActiveIndex) {
            this.currentActiveIndex--;
        } else if (fromIndex > this.currentActiveIndex && toIndex <= this.currentActiveIndex) {
            this.currentActiveIndex++;
        }

        this.saveToStorage();
        this.render();
    }

    /**
     * Xóa toàn bộ playlist
     */
    clearPlaylist() {
        if (this.songs.length === 0) {
            this.showNotification('Playlist đã trống');
            return;
        }

        if (confirm('Bạn có chắc muốn xóa toàn bộ playlist?')) {
            this.songs = [];
            this.currentActiveIndex = -1;
            this.saveToStorage();
            this.render();
            
            console.log('🗑️ Đã xóa toàn bộ playlist');
            this.showNotification('Đã xóa toàn bộ playlist');
        }
    }

    /**
     * Lọc bài hát theo từ khóa
     * @param {string} query - Từ khóa tìm kiếm
     */
    filterSongs(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredSongs = [...this.songs];
        } else {
            this.filteredSongs = this.songs.filter(song => 
                song.title.toLowerCase().includes(searchTerm) ||
                song.artist.toLowerCase().includes(searchTerm)
            );
        }
        
        this.render();
    }

    /**
     * Xóa search
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.filterSongs('');
        }
    }

    /**
     * Focus vào ô search
     */
    focusSearch() {
        if (this.searchInput) {
            this.searchInput.focus();
            this.searchInput.select();
        }
    }

    /**
     * Cập nhật item đang active
     * @param {number} index - Index của bài hát đang phát
     */
    updateActiveItem(index) {
        this.currentActiveIndex = index;
        this.render();
    }

    /**
     * Highlight một bài hát
     * @param {number} index
     */
    highlightSong(index) {
        this.render();
        
        setTimeout(() => {
            const songElements = this.playlistContainer.querySelectorAll('.playlist-item');
            if (songElements[index]) {
                songElements[index].classList.add('pulse');
                setTimeout(() => {
                    songElements[index].classList.remove('pulse');
                }, 2000);
            }
        }, 100);
    }

    /**
     * Render playlist UI
     */
    render() {
        if (!this.playlistContainer) return;

        const songsToRender = this.filteredSongs.length > 0 ? this.filteredSongs : this.songs;

        if (songsToRender.length === 0) {
            this.renderEmptyState();
            return;
        }

        const playlistHTML = songsToRender.map((song, index) => {
            const originalIndex = this.songs.indexOf(song);
            const isActive = originalIndex === this.currentActiveIndex;
            
            return this.createSongItemHTML(song, index, originalIndex, isActive);
        }).join('');

        this.playlistContainer.innerHTML = playlistHTML;
        this.bindSongEvents();
    }

    /**
     * Render trạng thái playlist trống
     */
    renderEmptyState() {
        const emptyMessage = this.searchInput?.value 
            ? 'Không tìm thấy bài hát nào'
            : 'Danh sách phát trống';

        this.playlistContainer.innerHTML = `
            <div class="text-center p-4 text-muted">
                <i class="bi bi-music-note-beamed display-4"></i>
                <p class="mt-2">${emptyMessage}</p>
                ${!this.searchInput?.value ? '<p class="small">Các bài hát sẽ được tự động thêm vào đây</p>' : ''}
            </div>
        `;
    }

    /**
     * Tạo HTML cho một item bài hát
     * @param {Object} song
     * @param {number} displayIndex
     * @param {number} originalIndex
     * @param {boolean} isActive
     * @returns {string}
     */
    createSongItemHTML(song, displayIndex, originalIndex, isActive) {
        return `
            <div class="playlist-item ${isActive ? 'active' : ''}" 
                 data-index="${originalIndex}" 
                 data-song-id="${song.id}"
                 draggable="true">
                
                <div class="d-flex align-items-center">
                    <!-- Drag Handle -->
                    <div class="drag-handle me-2 text-muted">
                        <i class="bi bi-grip-vertical"></i>
                    </div>
                    
                    <!-- Song Number -->
                    <div class="song-number me-3">
                        ${isActive ? 
                            '<i class="bi bi-play-fill text-primary"></i>' : 
                            `<span class="text-muted">${displayIndex + 1}</span>`
                        }
                    </div>
                    
                    <!-- Song Info -->
                    <div class="song-info flex-grow-1 min-width-0">
                        <h6 class="song-title mb-0">${this.escapeHtml(song.title)}</h6>
                        <small class="song-artist text-muted">${this.escapeHtml(song.artist)}</small>
                    </div>
                    
                    <!-- Duration -->
                    <div class="song-duration me-3">
                        <small>${song.duration || '0:00'}</small>
                    </div>
                    
                    <!-- Actions -->
                    <div class="song-actions">
                        <button class="btn btn-sm btn-outline-danger remove-song" 
                                data-index="${originalIndex}" 
                                title="Xóa bài hát">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gắn events cho các song items
     */
    bindSongEvents() {
        if (!this.playlistContainer) return;

        // Click để phát bài hát
        this.playlistContainer.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Không xử lý click nếu click vào button
                if (e.target.closest('button')) return;
                
                const index = parseInt(item.dataset.index);
                this.playSong(index);
            });

            // Double click để phát ngay lập tức
            item.addEventListener('dblclick', (e) => {
                const index = parseInt(item.dataset.index);
                this.playSong(index);
            });
        });

        // Remove song buttons
        this.playlistContainer.querySelectorAll('.remove-song').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removeSong(index);
            });
        });

        // Drag and drop
        this.setupDragAndDrop();
    }

    /**
     * Thiết lập drag and drop
     */
    setupDragAndDrop() {
        const items = this.playlistContainer.querySelectorAll('.playlist-item');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.index);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingElement = this.playlistContainer.querySelector('.dragging');
                if (draggingElement !== item) {
                    item.classList.add('drag-over');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = parseInt(item.dataset.index);
                
                this.moveSong(fromIndex, toIndex);
            });
        });
    }

    /**
     * Phát bài hát
     * @param {number} index
     */
    playSong(index) {
        if (window.player && window.player.playSong) {
            window.player.playSong(index);
        }
    }

    /**
     * Lưu playlist vào localStorage
     */
    saveToStorage() {
        // Chỉ lưu những bài hát không phải file local (vì blob URL không serialize được)
        const songsToSave = this.songs.filter(song => !song.isLocal).map(song => ({
            src: song.src,
            title: song.title,
            artist: song.artist,
            duration: song.duration,
            artwork: song.artwork,
            id: song.id
        }));
        
        this.storage.savePlaylist(songsToSave);
        
        if (this.songs.some(song => song.isLocal)) {
            console.log('ℹ️ File local không được lưu vào localStorage (sẽ mất khi reload trang)');
        }
    }

    /**
     * Lưu playlist ra file
     */
    savePlaylist() {
        try {
            const playlistData = {
                name: `Playlist_${new Date().toISOString().split('T')[0]}`,
                created: new Date().toISOString(),
                songs: this.songs
            };

            const dataStr = JSON.stringify(playlistData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `${playlistData.name}.json`;
            link.click();
            
            this.showNotification('Đã xuất playlist thành công');
            console.log('💾 Playlist đã được xuất');
        } catch (error) {
            console.error('❌ Lỗi khi xuất playlist:', error);
            this.showNotification('Lỗi khi xuất playlist', 'error');
        }
    }

    /**
     * Import playlist từ file
     * @param {File} file
     */
    async importPlaylist(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.songs && Array.isArray(data.songs)) {
                this.songs = data.songs;
                this.saveToStorage();
                this.render();
                
                this.showNotification(`Đã import ${data.songs.length} bài hát`);
                console.log('📁 Playlist đã được import');
            } else {
                throw new Error('File không đúng định dạng');
            }
        } catch (error) {
            console.error('❌ Lỗi khi import playlist:', error);
            this.showNotification('Lỗi khi import playlist', 'error');
        }
    }

    /**
     * Tạo ID unique
     * @returns {string}
     */
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Escape HTML để tránh XSS
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Hiện thông báo
     * @param {string} message
     * @param {string} type
     */
    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`📢 ${message}`);
        }
    }

    /**
     * Lấy thông tin playlist
     * @returns {Object}
     */
    getPlaylistInfo() {
        return {
            totalSongs: this.songs.length,
            currentActive: this.currentActiveIndex,
            filteredCount: this.filteredSongs.length,
            isFiltered: this.filteredSongs.length > 0,
            songs: [...this.songs]
        };
    }

    /**
     * Trigger file select dialog
     */
    triggerFileSelect() {
        if (this.songFileInput) {
            this.songFileInput.click();
        }
    }

    /**
     * Xử lý khi chọn file
     * @param {Event} event
     */
    async handleFileSelect(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        this.showNotification('Đang xử lý file...', 'info');
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await this.processAudioFile(file);
        }

        // Reset file input
        event.target.value = '';
    }

    /**
     * Xử lý file audio
     * @param {File} file
     */
    async processAudioFile(file) {
        try {
            // Kiểm tra file type
            if (!file.type.startsWith('audio/')) {
                this.showNotification(`"${file.name}" không phải file audio. Chỉ hỗ trợ .mp3, .wav, .m4a, .ogg`, 'warning');
                return;
            }

            // Kiểm tra kích thước file (giới hạn 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                this.showNotification(`File "${file.name}" quá lớn (>${Math.round(file.size/1024/1024)}MB). Tối đa 50MB`, 'warning');
                return;
            }

            console.log(`📁 Đang xử lý file: ${file.name} (${file.type}, ${Math.round(file.size/1024)}KB)`);

            // Tạo data URL từ file
            const fileURL = await this.createDataURL(file);
            console.log(`🔗 Tạo data URL thành công`);
            
            // Kiểm tra data URL có hợp lệ không
            if (!fileURL || !fileURL.startsWith('data:')) {
                throw new Error('Không thể tạo data URL từ file');
            }
            
            // Lưu file và data URL tạm thời
            this.pendingFile = file;
            this.pendingDataURL = fileURL;
            
            // Lấy metadata của file
            const metadata = await this.getAudioMetadata(file, fileURL);
            console.log(`📋 Metadata:`, metadata);
            
            // Hiển thị modal để nhập thông tin
            this.showAddSongModal(file, fileURL, metadata);

        } catch (error) {
            console.error('❌ Lỗi khi xử lý file:', error);
            this.showNotification(`❌ Lỗi: Không thể thêm "${file.name}" - ${error.message}`, 'error');
        }
    }

    /**
     * Tạo Data URL từ file (thay vì blob URL)
     * @param {File} file
     * @returns {Promise<string>}
     */
    createDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const dataURL = e.target.result;
                console.log(`📄 FileReader thành công: ${dataURL.substring(0, 30)}...`);
                resolve(dataURL);
            };
            
            reader.onerror = (e) => {
                console.error('❌ FileReader lỗi:', e);
                reject(new Error('Không thể đọc file'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Lấy metadata từ file audio
     * @param {File} file
     * @param {string} fileURL
     * @returns {Promise<Object>}
     */
    getAudioMetadata(file, fileURL) {
        return new Promise((resolve) => {
            const audio = new Audio();
            let resolved = false;
            
            // Timeout sau 10 giây
            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    console.warn('⏰ Timeout khi đọc metadata, sử dụng giá trị mặc định');
                    cleanup();
                    resolve({
                        duration: '0:00',
                        title: null,
                        artist: null,
                        artwork: null
                    });
                }
            }, 10000);

            const cleanup = () => {
                audio.removeEventListener('loadedmetadata', handleMetadata);
                audio.removeEventListener('error', handleError);
                audio.removeEventListener('canplaythrough', handleCanPlay);
                clearTimeout(timeout);
                audio.src = '';
                audio.load(); // Reset audio element
            };
            
            const handleMetadata = () => {
                if (resolved) return;
                console.log(`📊 Metadata loaded: duration=${audio.duration}s`);
            };

            const handleCanPlay = () => {
                if (resolved) return;
                resolved = true;
                
                const duration = audio.duration;
                const formattedDuration = this.formatDuration(duration);
                
                console.log(`✅ Audio can play: ${formattedDuration}`);
                cleanup();
                
                resolve({
                    duration: formattedDuration,
                    title: null, // Web Audio API không đọc được ID3 tags dễ dàng
                    artist: null,
                    artwork: null
                });
            };

            const handleError = (e) => {
                if (resolved) return;
                resolved = true;
                
                console.error('❌ Lỗi khi load audio metadata:', e);
                cleanup();
                
                resolve({
                    duration: '0:00',
                    title: null,
                    artist: null,
                    artwork: null
                });
            };

            audio.addEventListener('loadedmetadata', handleMetadata);
            audio.addEventListener('canplaythrough', handleCanPlay);
            audio.addEventListener('error', handleError);
            
            // Thiết lập volume thấp để tránh âm thanh bất ngờ
            audio.volume = 0.01;
            audio.src = fileURL;
        });
    }

    /**
     * Format duration từ seconds sang mm:ss
     * @param {number} seconds
     * @returns {string}
     */
    formatDuration(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Hủy playlist manager
     */
    destroy() {
        // Data URLs không cần cleanup như blob URLs
        // Chỉ cần save playlist
        this.saveToStorage();
        console.log('🧹 Playlist Manager đã được hủy');
    }

    /**
     * Hiển thị modal thêm bài hát
     * @param {File} file
     * @param {string} dataURL
     * @param {Object} metadata
     */
    showAddSongModal(file, dataURL, metadata) {
        // Cập nhật thông tin file trong modal
        document.getElementById('preview-filename').textContent = file.name;
        document.getElementById('preview-filesize').textContent = `${Math.round(file.size/1024)} KB`;
        document.getElementById('preview-duration').textContent = metadata.duration || 'Không xác định';
        
        // Setup audio preview
        const previewAudio = document.getElementById('preview-audio');
        previewAudio.src = dataURL;
        previewAudio.currentTime = 0;
        
        // Điền thông tin gợi ý từ tên file
        const cleanFileName = file.name.replace(/\.[^/.]+$/, ""); // Bỏ extension
        const suggestedTitle = this.cleanupTitle(cleanFileName);
        
        document.getElementById('song-title').value = suggestedTitle;
        document.getElementById('song-artist').value = '';
        document.getElementById('song-album').value = '';
        document.getElementById('song-artwork-url').value = '';
        
        // Reset validation
        const form = document.getElementById('song-info-form');
        form.classList.remove('was-validated');
        
        // Focus vào input đầu tiên
        setTimeout(() => {
            document.getElementById('song-title').focus();
            document.getElementById('song-title').select();
        }, 500);
        
        // Hiển thị modal
        this.addSongModal.show();
    }

    /**
     * Làm sạch tên file để làm tiêu đề
     * @param {string} filename
     * @returns {string}
     */
    cleanupTitle(filename) {
        if (!filename) return '';
        
        // Xử lý tags từ Pixabay (cách nhau bởi dấu phẩy)
        if (filename.includes(',')) {
            // Lấy 2-3 từ đầu tiên từ tags
            const words = filename.split(',').slice(0, 3).join(' ');
            return this.toTitleCase(words.trim());
        }
        
        // Xóa các ký tự đặc biệt và số thường thấy trong tên file
        return filename
            .replace(/[\[\](){}]/g, '') // Xóa dấu ngoặc
            .replace(/\d{2,4}/g, '') // Xóa năm
            .replace(/[-_]+/g, ' ') // Thay - và _ bằng space
            .replace(/\s+/g, ' ') // Gộp space thừa
            .trim() // Xóa space đầu cuối
            .split(' ')
            .slice(0, 4) // Chỉ lấy 4 từ đầu
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Title case
            .join(' ');
    }

    /**
     * Convert to Title Case
     * @param {string} str
     * @returns {string}
     */
    toTitleCase(str) {
        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    /**
     * Xác nhận thêm bài hát
     */
    confirmAddSong() {
        const form = document.getElementById('song-info-form');
        const title = document.getElementById('song-title').value.trim();
        const artist = document.getElementById('song-artist').value.trim();
        const album = document.getElementById('song-album').value.trim();
        const artworkUrl = document.getElementById('song-artwork-url').value.trim();
        
        // Validation
        if (!title || !artist) {
            form.classList.add('was-validated');
            this.showNotification('Vui lòng nhập đầy đủ tên bài hát và nghệ sĩ', 'warning');
            return;
        }
        
        // Tạo object bài hát
        const song = {
            id: this.generateUniqueId(),
            src: this.pendingDataURL,
            title: title,
            artist: artist,
            album: album || '',
            duration: document.getElementById('preview-duration').textContent,
            artwork: artworkUrl || `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
            isLocal: true,
            originalFile: this.pendingFile,
            fileSize: Math.round(this.pendingFile.size/1024)
        };

        console.log(`🎵 Tạo bài hát: "${song.title}" - ${song.artist}`);

        // Thêm vào playlist
        const success = this.addSong(song);
        if (success) {
            this.showNotification(`✅ Đã thêm "${song.title}" - ${song.artist}`, 'success');
            
            // Đóng modal
            this.addSongModal.hide();
            
            // Cleanup
            this.pendingFile = null;
            this.pendingDataURL = null;
            
            // Stop preview audio
            const previewAudio = document.getElementById('preview-audio');
            previewAudio.pause();
            previewAudio.src = '';
        }
    }

    /**
     * Xác nhận thêm URL
     */
    confirmAddURL() {
        const form = document.getElementById('url-form');
        const url = document.getElementById('song-url').value.trim();
        const title = document.getElementById('url-song-title').value.trim();
        const artist = document.getElementById('url-song-artist').value.trim();
        const duration = document.getElementById('url-song-duration').value.trim();
        const artworkUrl = document.getElementById('url-song-artwork').value.trim();
        
        // Validation
        if (!url || !title || !artist) {
            form.classList.add('was-validated');
            this.showNotification('Vui lòng nhập đầy đủ URL, tên bài hát và nghệ sĩ', 'warning');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            this.showNotification('URL không hợp lệ', 'warning');
            return;
        }
        
        // Tạo object bài hát
        const song = {
            id: this.generateUniqueId(),
            src: url,
            title: title,
            artist: artist,
            duration: duration || '0:00',
            artwork: artworkUrl || `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
            isOnline: true
        };

        console.log(`🔗 Tạo bài hát từ URL: "${song.title}" - ${song.artist}`);

        // Thêm vào playlist
        const success = this.addSong(song);
        if (success) {
            this.showNotification(`✅ Đã thêm "${song.title}" - ${song.artist} từ URL`, 'success');
            
            // Đóng modal
            this.addSongModal.hide();
            
            // Reset form
            form.reset();
            form.classList.remove('was-validated');
            
            // Hide preview
            const previewAudio = document.getElementById('url-preview-audio');
            previewAudio.classList.add('d-none');
            previewAudio.src = '';
        }
    }

    /**
     * Preview URL
     */
    previewURL() {
        const url = document.getElementById('song-url').value.trim();
        const previewAudio = document.getElementById('url-preview-audio');
        
        if (!url) {
            this.showNotification('Vui lòng nhập URL trước', 'warning');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            this.showNotification('URL không hợp lệ', 'warning');
            return;
        }

        // Set audio source và hiện player
        previewAudio.src = url;
        previewAudio.classList.remove('d-none');
        
        // Auto fill duration when loaded
        previewAudio.addEventListener('loadedmetadata', () => {
            const duration = this.formatDuration(previewAudio.duration);
            document.getElementById('url-song-duration').value = duration;
        }, { once: true });

        // Handle errors
        previewAudio.addEventListener('error', () => {
            this.showNotification('Không thể preview URL này - có thể do CORS hoặc file không tồn tại', 'warning');
        }, { once: true });

        this.showNotification('🎵 Preview đã sẵn sàng!', 'info');
    }

    /* 
    ===================================
    UNUSED API METHODS - Commented out
    ===================================
    
    async loadPixabayPlaylist() { ... }
    async loadJamendoPlaylist() { ... }  
    async loadArchivePlaylist() { ... }
    async loadFreesoundPlaylist() { ... }
    async loadBackupPlaylist() { ... }
    async loadAllDemos() { ... }
    
    */

    /**
     * Load radio stations từ Radio Browser API
     */
    async loadRadioStations() {
        try {
            this.showNotification('📻 Đang tải radio stations...', 'info');
            
            // Radio Browser API - danh sách radio stations theo topvote
            const response = await fetch('https://de1.api.radio-browser.info/json/stations/topvote/20');
            
            if (!response.ok) {
                throw new Error('Không thể kết nối đến Radio Browser API');
            }
            
            const data = await response.json();
            console.log('📡 Radio Browser Response:', data);
            
            if (data && data.length > 0) {
                const radioStations = data.filter(station => station.url_resolved).map((station, index) => ({
                    id: `radio-${station.stationuuid}`,
                    src: station.url_resolved,
                    title: station.name || `Radio Station ${index + 1}`,
                    artist: `📻 ${station.country || 'Unknown Country'}`,
                    album: `${station.tags || 'Radio'} • ${station.language || 'Various'}`,
                    duration: '∞ LIVE',
                    artwork: station.favicon || `https://picsum.photos/200/200?random=${600 + index}`,
                    isOnline: true,
                    isRadio: true,
                    license: 'Live Radio Stream',
                    genre: station.tags || 'Radio',
                    bitrate: station.bitrate ? `${station.bitrate}kbps` : '',
                    country: station.country
                }));
                
                // Thêm vào playlist hiện tại
                this.songs.push(...radioStations);
                this.saveToStorage();
                this.render();
                
                this.showNotification(`✅ Đã thêm ${radioStations.length} radio stations!`, 'success');
                console.log(`📻 Loaded ${radioStations.length} radio stations`);
            }
            
        } catch (error) {
            console.error('❌ Lỗi khi tải radio stations:', error);
            this.showNotification('❌ Không thể tải radio stations.', 'error');
        }
    }
}

// Export để app.js sử dụng
window.PlaylistManager = PlaylistManager; 