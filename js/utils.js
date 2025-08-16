// Utility Functions for Student Portal

const Utils = {
    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Calculate percentage
    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Debounce function for search inputs
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Get grade level from class name
    getGradeLevel(className) {
        const match = className.match(/(\d+)/);
        return match ? parseInt(match[1]) : 3; // Default to grade 3
    },

    // Create avatar URL (placeholder for now)
    createAvatarUrl(studentId, avatarData) {
        // This will be enhanced when we build the avatar system
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentId}`;
    },

    // Show toast notification (basic implementation)
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    },

    // Animate number counting
    animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        },

        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
                return null;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Failed to remove from localStorage:', error);
            }
        }
    },

    // Simple event emitter
    events: {
        listeners: {},

        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        },

        emit(event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(callback => callback(data));
            }
        },

        off(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
            }
        }
    },

    // Award Kudos points to a student with automatic XP and leveling
    async awardKudosPoints(studentId, points, reason = 'Great work!') {
        try {
            const result = await MockDataAPI.awardKudosPoints(studentId, points, reason);
            
            if (result) {
                // Update current student if it's the same one
                if (window.navigationManager && navigationManager.getCurrentStudent()?.id === studentId) {
                    navigationManager.setCurrentStudent(result.student);
                    
                    // Refresh dashboard if it's currently shown
                    if (window.dashboardManager && document.querySelector('.dashboard-container')) {
                        await dashboardManager.renderDashboard();
                    }
                }
                
                // Show notification
                let message = `🎉 ${reason}\n+${points} Kudos Points\n+${result.xpGained} XP`;
                if (result.leveledUp) {
                    message += `\n\n🆙 LEVEL UP! Welcome to Level ${result.newLevel}!`;
                }
                
                this.showToast(message, 'success');
                return result;
            }
        } catch (error) {
            console.error('Error awarding points:', error);
            this.showToast('Error awarding points', 'error');
        }
        return null;
    },

    // Quick award functions for common achievements
    async awardHomeworkPoints(studentId) {
        return this.awardKudosPoints(studentId, 10, 'Homework completed! 📚');
    },

    async awardQuizPoints(studentId, score) {
        const points = Math.floor(score / 10); // 1 point per 10% score
        return this.awardKudosPoints(studentId, points, `Quiz completed with ${score}% score! 🧠`);
    },

    async awardParticipationPoints(studentId) {
        return this.awardKudosPoints(studentId, 5, 'Great class participation! 🙋‍♀️');
    },

    async awardHelpingPoints(studentId) {
        return this.awardKudosPoints(studentId, 8, 'Helped a classmate! 🤝');
    },

    async awardCreativityPoints(studentId) {
        return this.awardKudosPoints(studentId, 12, 'Creative project work! 🎨');
    }
};

// Add CSS animations for toasts
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

// Add level functions from database-api.js if available
if (window.LevelUtils) {
    Utils.getXPForNextLevel = window.LevelUtils.getXPForNextLevel;
    Utils.getXPProgressPercent = window.LevelUtils.getXPProgressPercent;
    Utils.getLevelFromXP = window.LevelUtils.getLevelFromXP;
    Utils.getXPForLevel = window.LevelUtils.getXPForLevel;
}

// Export utils globally
window.Utils = Utils;
