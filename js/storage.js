/**
 * ========================================
 * STORAGE MODULE - Quản lý Local Storage
 * ========================================
 * Chức năng: Lưu trữ và khôi phục dữ liệu người dùng
 * - Playlist
 * - Theme preferences
 * - Volume setting
 * - Current song
 */

class Storage {
    constructor() {
        this.keys = {
            PLAYLIST: 'musicPlayer_playlist',
            THEME: 'musicPlayer_theme',
            VOLUME: 'musicPlayer_volume',
            CURRENT_SONG: 'musicPlayer_currentSong',
            CURRENT_INDEX: 'musicPlayer_currentIndex',
            SHUFFLE: 'musicPlayer_shuffle',
            REPEAT: 'musicPlayer_repeat'
        };
    }

    /**
     * Lưu playlist vào localStorage
     * @param {Array} playlist - Mảng các bài hát
     */
    savePlaylist(playlist) {
        try {
            const playlistData = playlist.map(song => ({
                src: song.src,
                title: song.title,
                artist: song.artist,
                duration: song.duration,
                artwork: song.artwork
            }));
            
            localStorage.setItem(this.keys.PLAYLIST, JSON.stringify(playlistData));
            console.log('✅ Đã lưu playlist vào localStorage');
        } catch (error) {
            console.error('❌ Lỗi khi lưu playlist:', error);
        }
    }

    /**
     * Tải playlist từ localStorage
     * @returns {Array} Mảng các bài hát
     */
    loadPlaylist() {
        try {
            const saved = localStorage.getItem(this.keys.PLAYLIST);
            if (saved) {
                const playlist = JSON.parse(saved);
                console.log('✅ Đã tải playlist từ localStorage');
                return playlist;
            }
        } catch (error) {
            console.error('❌ Lỗi khi tải playlist:', error);
        }
        return [];
    }

    /**
     * Lưu theme hiện tại
     * @param {string} theme - 'light' hoặc 'dark'
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.keys.THEME, theme);
            console.log(`✅ Đã lưu theme: ${theme}`);
        } catch (error) {
            console.error('❌ Lỗi khi lưu theme:', error);
        }
    }

    /**
     * Tải theme đã lưu
     * @returns {string} Theme name
     */
    loadTheme() {
        try {
            return localStorage.getItem(this.keys.THEME) || 'light';
        } catch (error) {
            console.error('❌ Lỗi khi tải theme:', error);
            return 'light';
        }
    }

    /**
     * Lưu mức âm lượng
     * @param {number} volume - Giá trị từ 0-100
     */
    saveVolume(volume) {
        try {
            localStorage.setItem(this.keys.VOLUME, volume.toString());
        } catch (error) {
            console.error('❌ Lỗi khi lưu volume:', error);
        }
    }

    /**
     * Tải mức âm lượng đã lưu
     * @returns {number} Volume level
     */
    loadVolume() {
        try {
            const saved = localStorage.getItem(this.keys.VOLUME);
            return saved ? parseInt(saved) : 70;
        } catch (error) {
            console.error('❌ Lỗi khi tải volume:', error);
            return 70;
        }
    }

    /**
     * Lưu bài hát hiện tại
     * @param {Object} songData - Thông tin bài hát
     */
    saveCurrentSong(songData) {
        try {
            localStorage.setItem(this.keys.CURRENT_SONG, JSON.stringify(songData));
        } catch (error) {
            console.error('❌ Lỗi khi lưu current song:', error);
        }
    }

    /**
     * Tải bài hát hiện tại
     * @returns {Object|null} Song data
     */
    loadCurrentSong() {
        try {
            const saved = localStorage.getItem(this.keys.CURRENT_SONG);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('❌ Lỗi khi tải current song:', error);
            return null;
        }
    }

    /**
     * Lưu chỉ số bài hát hiện tại
     * @param {number} index
     */
    saveCurrentIndex(index) {
        try {
            localStorage.setItem(this.keys.CURRENT_INDEX, index.toString());
        } catch (error) {
            console.error('❌ Lỗi khi lưu current index:', error);
        }
    }

    /**
     * Tải chỉ số bài hát hiện tại
     * @returns {number}
     */
    loadCurrentIndex() {
        try {
            const saved = localStorage.getItem(this.keys.CURRENT_INDEX);
            return saved ? parseInt(saved) : 0;
        } catch (error) {
            console.error('❌ Lỗi khi tải current index:', error);
            return 0;
        }
    }

    /**
     * Lưu trạng thái shuffle
     * @param {boolean} isShuffleOn
     */
    saveShuffle(isShuffleOn) {
        try {
            localStorage.setItem(this.keys.SHUFFLE, isShuffleOn.toString());
        } catch (error) {
            console.error('❌ Lỗi khi lưu shuffle state:', error);
        }
    }

    /**
     * Tải trạng thái shuffle
     * @returns {boolean}
     */
    loadShuffle() {
        try {
            const saved = localStorage.getItem(this.keys.SHUFFLE);
            return saved === 'true';
        } catch (error) {
            console.error('❌ Lỗi khi tải shuffle state:', error);
            return false;
        }
    }

    /**
     * Lưu trạng thái repeat
     * @param {string} repeatMode - 'none', 'one', 'all'
     */
    saveRepeat(repeatMode) {
        try {
            localStorage.setItem(this.keys.REPEAT, repeatMode);
        } catch (error) {
            console.error('❌ Lỗi khi lưu repeat mode:', error);
        }
    }

    /**
     * Tải trạng thái repeat
     * @returns {string}
     */
    loadRepeat() {
        try {
            return localStorage.getItem(this.keys.REPEAT) || 'none';
        } catch (error) {
            console.error('❌ Lỗi khi tải repeat mode:', error);
            return 'none';
        }
    }

    /**
     * Xóa tất cả dữ liệu đã lưu
     */
    clearAll() {
        try {
            Object.values(this.keys).forEach(key => {
                localStorage.removeItem(key);
            });
            console.log('✅ Đã xóa tất cả dữ liệu localStorage');
        } catch (error) {
            console.error('❌ Lỗi khi xóa localStorage:', error);
        }
    }

    /**
     * Xuất dữ liệu để backup
     * @returns {Object} Tất cả dữ liệu đã lưu
     */
    exportData() {
        try {
            const data = {};
            Object.entries(this.keys).forEach(([name, key]) => {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    try {
                        data[name] = JSON.parse(value);
                    } catch {
                        data[name] = value;
                    }
                }
            });
            return data;
        } catch (error) {
            console.error('❌ Lỗi khi export data:', error);
            return {};
        }
    }

    /**
     * Nhập dữ liệu từ backup
     * @param {Object} data - Dữ liệu để import
     */
    importData(data) {
        try {
            Object.entries(data).forEach(([name, value]) => {
                const key = this.keys[name];
                if (key) {
                    const stringValue = typeof value === 'object' 
                        ? JSON.stringify(value) 
                        : value.toString();
                    localStorage.setItem(key, stringValue);
                }
            });
            console.log('✅ Đã import dữ liệu thành công');
        } catch (error) {
            console.error('❌ Lỗi khi import data:', error);
        }
    }

    /**
     * Kiểm tra dung lượng localStorage đã sử dụng
     * @returns {Object} Thông tin dung lượng
     */
    getStorageInfo() {
        try {
            let totalSize = 0;
            const details = {};
            
            Object.entries(this.keys).forEach(([name, key]) => {
                const value = localStorage.getItem(key);
                if (value) {
                    const size = new Blob([value]).size;
                    details[name] = {
                        size: size,
                        sizeFormatted: this.formatBytes(size)
                    };
                    totalSize += size;
                }
            });

            return {
                totalSize: totalSize,
                totalSizeFormatted: this.formatBytes(totalSize),
                details: details
            };
        } catch (error) {
            console.error('❌ Lỗi khi kiểm tra storage info:', error);
            return { totalSize: 0, totalSizeFormatted: '0 B', details: {} };
        }
    }

    /**
     * Format bytes thành đơn vị dễ đọc
     * @param {number} bytes
     * @returns {string}
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Export để các module khác sử dụng
window.Storage = Storage; 