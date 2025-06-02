/**
 * ========================================
 * THEME MODULE - Quản lý Dark/Light Mode
 * ========================================
 * Chức năng: Chuyển đổi và lưu trữ theme
 * - Light/Dark mode toggle
 * - Smooth transition animations
 * - Auto detection system theme
 * - Persistent storage
 */

class ThemeManager {
    constructor(storage) {
        this.storage = storage;
        this.currentTheme = 'light';
        this.themeToggleBtn = null;
        this.transitionDuration = 300;
        
        this.init();
    }

    /**
     * Khởi tạo theme manager
     */
    init() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.detectSystemTheme();
        this.loadSavedTheme();
        this.bindEvents();
        this.updateThemeToggleUI();
        
        console.log('✅ Theme Manager đã khởi tạo');
    }

    /**
     * Phát hiện theme hệ thống
     */
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        }

        // Lắng nghe thay đổi theme hệ thống
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.storage.loadTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light', false);
                }
            });
        }
    }

    /**
     * Tải theme đã lưu
     */
    loadSavedTheme() {
        const savedTheme = this.storage.loadTheme();
        if (savedTheme) {
            this.setTheme(savedTheme, false);
        }
    }

    /**
     * Gắn event listeners
     */
    bindEvents() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Keyboard shortcut: Ctrl + Shift + T
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Chuyển đổi theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
    }

    /**
     * Thiết lập theme
     * @param {string} theme - 'light' hoặc 'dark'
     * @param {boolean} animate - Có animation hay không
     */
    setTheme(theme, animate = true) {
        if (theme === this.currentTheme) return;

        const oldTheme = this.currentTheme;
        this.currentTheme = theme;

        if (animate) {
            this.animateThemeTransition(oldTheme, theme);
        } else {
            this.applyTheme(theme);
        }

        this.updateThemeToggleUI();
        this.storage.saveTheme(theme);
        this.dispatchThemeChangeEvent(oldTheme, theme);

        console.log(`🎨 Theme đã chuyển: ${oldTheme} → ${theme}`);
    }

    /**
     * Áp dụng theme ngay lập tức
     * @param {string} theme
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.remove('theme-transitioning');
    }

    /**
     * Animation chuyển đổi theme
     * @param {string} oldTheme
     * @param {string} newTheme
     */
    animateThemeTransition(oldTheme, newTheme) {
        // Thêm class transition
        document.body.classList.add('theme-transitioning');
        
        // Tạo overlay để che transition
        const overlay = this.createTransitionOverlay();
        document.body.appendChild(overlay);

        // Trigger animation
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);

        // Đổi theme ở giữa animation
        setTimeout(() => {
            this.applyTheme(newTheme);
        }, this.transitionDuration / 2);

        // Kết thúc animation
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                document.body.classList.remove('theme-transitioning');
            }, this.transitionDuration / 2);
        }, this.transitionDuration);
    }

    /**
     * Tạo overlay cho transition
     * @returns {HTMLElement}
     */
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.currentTheme === 'light' ? '#0f172a' : '#ffffff'};
            opacity: 0;
            z-index: 10000;
            transition: opacity ${this.transitionDuration}ms ease-in-out;
            pointer-events: none;
        `;

        overlay.classList.add('active');
        
        return overlay;
    }

    /**
     * Cập nhật UI của nút toggle theme
     */
    updateThemeToggleUI() {
        if (!this.themeToggleBtn) return;

        const icon = this.themeToggleBtn.querySelector('i');
        const text = this.themeToggleBtn.querySelector('span');

        if (this.currentTheme === 'dark') {
            icon.className = 'bi bi-sun-fill';
            text.textContent = 'Light Mode';
            this.themeToggleBtn.classList.remove('btn-outline-secondary');
            this.themeToggleBtn.classList.add('btn-outline-warning');
        } else {
            icon.className = 'bi bi-moon-fill';
            text.textContent = 'Dark Mode';
            this.themeToggleBtn.classList.remove('btn-outline-warning');
            this.themeToggleBtn.classList.add('btn-outline-secondary');
        }

        // Animation cho icon
        icon.style.transform = 'scale(0.8)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Dispatch custom event khi theme thay đổi
     * @param {string} oldTheme
     * @param {string} newTheme
     */
    dispatchThemeChangeEvent(oldTheme, newTheme) {
        const event = new CustomEvent('themechange', {
            detail: {
                oldTheme,
                newTheme,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Lấy theme hiện tại
     * @returns {string}
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Kiểm tra có phải dark theme không
     * @returns {boolean}
     */
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    /**
     * Áp dụng theme cho một element cụ thể
     * @param {HTMLElement} element
     * @param {Object} themes - Object chứa styles cho từng theme
     */
    applyThemeToElement(element, themes) {
        if (!element || !themes) return;

        const currentThemeStyles = themes[this.currentTheme];
        if (currentThemeStyles) {
            Object.assign(element.style, currentThemeStyles);
        }
    }

    /**
     * Tạo CSS động cho theme
     * @param {string} selector
     * @param {Object} lightStyles
     * @param {Object} darkStyles
     */
    addDynamicThemeStyles(selector, lightStyles, darkStyles) {
        const styleId = `dynamic-theme-${selector.replace(/[^a-zA-Z0-9]/g, '')}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const lightCSS = this.objectToCSS(lightStyles);
        const darkCSS = this.objectToCSS(darkStyles);

        styleElement.textContent = `
            ${selector} { ${lightCSS} }
            [data-theme="dark"] ${selector} { ${darkCSS} }
        `;
    }

    /**
     * Convert object thành CSS string
     * @param {Object} styles
     * @returns {string}
     */
    objectToCSS(styles) {
        return Object.entries(styles)
            .map(([property, value]) => `${property}: ${value};`)
            .join(' ');
    }

    /**
     * Reset về theme mặc định
     */
    resetToDefault() {
        this.setTheme('light', true);
        this.storage.saveTheme('light');
    }

    /**
     * Lấy thông tin theme system
     * @returns {Object}
     */
    getThemeInfo() {
        return {
            current: this.currentTheme,
            system: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            saved: this.storage.loadTheme(),
            supportsDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches !== undefined
        };
    }

    /**
     * Hủy theme manager
     */
    destroy() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.removeEventListener('click', this.toggleTheme);
        }
        
        // Remove dynamic styles
        const dynamicStyles = document.querySelectorAll('[id^="dynamic-theme-"]');
        dynamicStyles.forEach(style => style.remove());
        
        console.log('🧹 Theme Manager đã được hủy');
    }
}

// Export để app.js sử dụng
window.ThemeManager = ThemeManager; 