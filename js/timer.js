/**
 * ========================================
 * SLEEP TIMER MODULE - Hẹn giờ tắt nhạc
 * ========================================
 * Chức năng: Quản lý timer để tự động dừng phát nhạc
 * - Thiết lập timer (5, 10, 30, 60 phút)
 * - Countdown display
 * - Auto pause music when timer expires
 * - Cancel timer functionality
 */

class SleepTimer {
    constructor(player) {
        this.player = player;
        this.timerId = null;
        this.remainingTime = 0;
        this.isActive = false;
        
        this.modal = null;
        this.timerStatusDiv = null;
        this.timerTextSpan = null;
        this.cancelButton = null;
        
        this.updateInterval = null;
        
        this.init();
    }

    /**
     * Khởi tạo sleep timer
     */
    init() {
        this.modal = new bootstrap.Modal(document.getElementById('sleepTimerModal'));
        this.timerStatusDiv = document.getElementById('timer-status');
        this.timerTextSpan = document.getElementById('timer-text');
        this.cancelButton = document.getElementById('cancel-timer');
        
        this.bindEvents();
        console.log('✅ Sleep Timer đã khởi tạo');
    }

    /**
     * Gắn event listeners
     */
    bindEvents() {
        // Nút mở sleep timer modal
        const sleepTimerBtn = document.getElementById('sleep-timer-btn');
        if (sleepTimerBtn) {
            sleepTimerBtn.addEventListener('click', () => {
                this.showModal();
            });
        }

        // Các nút thiết lập timer
        const timerOptions = document.querySelectorAll('.sleep-timer-option');
        timerOptions.forEach(button => {
            button.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.setTimer(minutes);
            });
        });

        // Nút hủy timer
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', () => {
                this.cancelTimer();
            });
        }

        // Keyboard shortcut: Ctrl + Shift + S
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.showModal();
            }
        });
    }

    /**
     * Hiển thị modal sleep timer
     */
    showModal() {
        this.updateModalUI();
        this.modal.show();
    }

    /**
     * Thiết lập timer
     * @param {number} minutes - Số phút
     */
    setTimer(minutes) {
        // Hủy timer cũ nếu có
        this.cancelTimer();
        
        this.remainingTime = minutes * 60; // Convert to seconds
        this.isActive = true;
        
        // Bắt đầu countdown
        this.startCountdown();
        
        // Thiết lập timer chính
        this.timerId = setTimeout(() => {
            this.onTimerExpired();
        }, minutes * 60 * 1000);

        // Cập nhật UI
        this.updateModalUI();
        this.updateSleepTimerButton();
        
        // Đóng modal
        this.modal.hide();
        
        // Hiện thông báo
        this.showNotification(`⏰ Đã thiết lập hẹn giờ ${minutes} phút`);
        
        console.log(`⏰ Sleep timer đã thiết lập: ${minutes} phút`);
    }

    /**
     * Bắt đầu countdown
     */
    startCountdown() {
        this.updateInterval = setInterval(() => {
            this.remainingTime--;
            
            if (this.remainingTime <= 0) {
                this.clearCountdown();
                return;
            }
            
            this.updateTimerDisplay();
            this.updateSleepTimerButton();
            
            // Cảnh báo khi còn 1 phút
            if (this.remainingTime === 60) {
                this.showNotification('⚠️ Còn 1 phút nữa sẽ tắt nhạc!', 'warning');
            }
            
            // Cảnh báo khi còn 30 giây
            if (this.remainingTime === 30) {
                this.showNotification('⚠️ Còn 30 giây nữa sẽ tắt nhạc!', 'warning');
            }
            
        }, 1000);
    }

    /**
     * Xóa countdown interval
     */
    clearCountdown() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Xử lý khi timer hết hạn
     */
    onTimerExpired() {
        console.log('⏰ Sleep timer đã hết hạn - Đang dừng nhạc...');
        
        // Dừng nhạc
        if (this.player && this.player.pause) {
            this.player.pause();
        }
        
        // Fade out volume
        this.fadeOutVolume();
        
        // Reset timer
        this.resetTimer();
        
        // Hiện thông báo
        this.showNotification('😴 Đã tắt nhạc theo hẹn giờ. Chúc bạn ngủ ngon!', 'success');
        
        // Dispatch custom event
        this.dispatchTimerExpiredEvent();
    }

    /**
     * Fade out âm lượng trước khi dừng
     */
    fadeOutVolume() {
        if (!this.player || !this.player.audio) return;
        
        const audio = this.player.audio;
        const originalVolume = audio.volume;
        const fadeStep = originalVolume / 20; // 20 steps
        
        const fadeInterval = setInterval(() => {
            if (audio.volume > fadeStep) {
                audio.volume -= fadeStep;
            } else {
                audio.volume = 0;
                clearInterval(fadeInterval);
                
                // Khôi phục volume sau khi dừng
                setTimeout(() => {
                    audio.volume = originalVolume;
                }, 2000);
            }
        }, 100);
    }

    /**
     * Hủy timer
     */
    cancelTimer() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        
        this.clearCountdown();
        this.resetTimer();
        this.updateModalUI();
        this.updateSleepTimerButton();
        
        if (this.isActive) {
            this.showNotification('❌ Đã hủy hẹn giờ tắt nhạc');
        }
        
        console.log('❌ Sleep timer đã bị hủy');
    }

    /**
     * Reset timer về trạng thái ban đầu
     */
    resetTimer() {
        this.isActive = false;
        this.remainingTime = 0;
        this.timerId = null;
    }

    /**
     * Cập nhật hiển thị thời gian còn lại
     */
    updateTimerDisplay() {
        if (!this.timerTextSpan) return;
        
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.timerTextSpan.textContent = `Còn ${timeString} sẽ tắt nhạc`;
    }

    /**
     * Cập nhật UI của modal
     */
    updateModalUI() {
        if (!this.timerStatusDiv) return;
        
        if (this.isActive) {
            this.timerStatusDiv.classList.remove('d-none');
            this.updateTimerDisplay();
        } else {
            this.timerStatusDiv.classList.add('d-none');
        }
    }

    /**
     * Cập nhật nút sleep timer chính
     */
    updateSleepTimerButton() {
        const sleepTimerBtn = document.getElementById('sleep-timer-btn');
        if (!sleepTimerBtn) return;
        
        const icon = sleepTimerBtn.querySelector('i');
        const text = sleepTimerBtn.querySelector('span');
        
        if (this.isActive) {
            icon.className = 'bi bi-clock-fill';
            const minutes = Math.floor(this.remainingTime / 60);
            const seconds = this.remainingTime % 60;
            text.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            sleepTimerBtn.classList.remove('btn-outline-info');
            sleepTimerBtn.classList.add('btn-outline-warning');
            sleepTimerBtn.classList.add('pulse');
        } else {
            icon.className = 'bi bi-clock';
            text.textContent = 'Sleep Timer';
            sleepTimerBtn.classList.remove('btn-outline-warning');
            sleepTimerBtn.classList.add('btn-outline-info');
            sleepTimerBtn.classList.remove('pulse');
        }
    }

    /**
     * Hiện thông báo toast
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo (success, warning, error)
     */
    showNotification(message, type = 'info') {
        const toastElement = document.getElementById('notification-toast');
        const toastBody = document.getElementById('toast-message');
        
        if (toastElement && toastBody) {
            toastBody.textContent = message;
            
            // Thêm class tương ứng với type
            toastElement.className = `toast show`;
            if (type === 'warning') {
                toastElement.classList.add('bg-warning');
            } else if (type === 'success') {
                toastElement.classList.add('bg-success', 'text-white');
            } else if (type === 'error') {
                toastElement.classList.add('bg-danger', 'text-white');
            }
            
            const toast = new bootstrap.Toast(toastElement, {
                delay: type === 'warning' ? 5000 : 3000
            });
            toast.show();
        }
    }

    /**
     * Dispatch custom event khi timer hết hạn
     */
    dispatchTimerExpiredEvent() {
        const event = new CustomEvent('sleeptimerexpired', {
            detail: {
                timestamp: Date.now(),
                action: 'music_paused'
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Lấy thông tin timer hiện tại
     * @returns {Object}
     */
    getTimerInfo() {
        return {
            isActive: this.isActive,
            remainingTime: this.remainingTime,
            remainingMinutes: Math.floor(this.remainingTime / 60),
            remainingSeconds: this.remainingTime % 60,
            startTime: this.isActive ? Date.now() : null
        };
    }

    /**
     * Kiểm tra timer có đang hoạt động không
     * @returns {boolean}
     */
    isTimerActive() {
        return this.isActive;
    }

    /**
     * Extend timer thêm thời gian
     * @param {number} additionalMinutes
     */
    extendTimer(additionalMinutes) {
        if (!this.isActive) return false;
        
        this.remainingTime += additionalMinutes * 60;
        
        // Hủy timer cũ và tạo timer mới
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => {
                this.onTimerExpired();
            }, this.remainingTime * 1000);
        }
        
        this.showNotification(`⏰ Đã gia hạn thêm ${additionalMinutes} phút`);
        return true;
    }

    /**
     * Hủy sleep timer
     */
    destroy() {
        this.cancelTimer();
        console.log('🧹 Sleep Timer đã được hủy');
    }
}

// Export để app.js sử dụng
window.SleepTimer = SleepTimer; 