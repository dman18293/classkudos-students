// Dashboard Manager for Student Portal

class DashboardManager {
    constructor() {
        this.currentStudent = null;
        this.init();
    }

    init() {
        // Initialize dashboard when page loads
    }

    async loadDashboard() {
        console.log('🎯 Loading dashboard...');
        this.currentStudent = navigationManager.getCurrentStudent();
        console.log('Current student from navigation:', this.currentStudent);
        
        if (!this.currentStudent) {
            navigationManager.showPage('login');
            return;
        }

        // TEMPORARILY DISABLE refresh to test if the issue is with save vs refresh
        // // Refresh student data from server to get latest avatar changes
        // try {
        //     const storedLoginCode = localStorage.getItem('loginCode');
        //     const storedClassName = localStorage.getItem('className');
            
        //     if (storedLoginCode && storedClassName) {
        //         console.log('Refreshing student data from server...');
        //         const refreshedStudent = await DatabaseAPI.authenticateStudent(storedLoginCode, storedClassName);
        //         if (refreshedStudent) {
        //             console.log('Student data refreshed:', refreshedStudent);
        //             console.log('Refreshed avatar data:', refreshedStudent.avatar);
        //             this.currentStudent = refreshedStudent;
        //             navigationManager.setCurrentStudent(refreshedStudent);
        //         }
        //     }
        // } catch (error) {
        //     console.warn('Failed to refresh student data:', error);
        //     // Continue with cached data if refresh fails
        // }

        console.log('Final student data for dashboard:', JSON.stringify(this.currentStudent, null, 2));
        console.log('Final avatar data:', JSON.stringify(this.currentStudent.avatar, null, 2));
        await this.renderDashboard();
    }

    async renderDashboard() {
        const container = document.querySelector('.dashboard-container');
        if (!container) return;

        // Calculate XP values
        const currentXP = this.currentStudent.xp || 0;
        const currentLevel = this.currentStudent.level || 1;
        const xpForNextLevel = window.Utils ? Utils.getXPForNextLevel(currentLevel) : 100;
        const xpNeeded = Math.max(0, xpForNextLevel - currentXP);

        container.innerHTML = `
            <div class="dashboard-header">
                <div class="dashboard-avatar" style="background: ${this.getAvatarColor()};">
                    ${this.getCustomizedAvatarDisplay()}
                </div>
                <div class="dashboard-info">
                    <h1 class="dashboard-name">${this.currentStudent.name}</h1>
                    <div>
                        <span class="dashboard-points">${this.currentStudent.kudosPoints} Kudos Points</span>
                        <span class="dashboard-level">Level ${currentLevel}</span>
                    </div>
                    <div class="level-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.calculateLevelProgress()}%">
                                <span class="progress-text">${currentXP}/${xpForNextLevel} XP</span>
                            </div>
                        </div>
                        <div class="level-info">
                            <small>Next level: ${xpNeeded} XP needed</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                ${this.renderStatsCard()}
                ${this.renderQuickActionsCard()}
                ${this.renderRecentActivityCard()}
            </div>
        `;

        // Animate progress bar
        setTimeout(() => {
            const progressFill = container.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${this.calculateLevelProgress()}%`;
            }
        }, 500);
    }

    calculateLevelProgress() {
        if (!window.Utils) return 0;
        return Math.round(Utils.getXPProgressPercent(this.currentStudent.xp, this.currentStudent.level));
    }

    getAvatarColor() {
        return this.currentStudent.avatar?.bodyColor || '#667eea';
    }

    getCustomizedAvatarDisplay() {
        // Create a visual representation that reflects actual customizations
        return this.getCustomizedAvatarForStudent(this.currentStudent);
    }

    getCustomizedAvatarForStudent(student) {
        const avatar = student.avatar;
        
        if (!avatar) {
            return student.name.charAt(0).toUpperCase();
        }

        // For new creature format, show creature type with customization indicators
        if (avatar.creatureType && avatar.creatureType !== 'robot') {
            const creatureEmoji = this.getCreatureEmoji(avatar.creatureType);
            const size = avatar.bodySize || 0.5;
            const sizeIndicator = size > 0.7 ? ' 🔺' : size < 0.3 ? ' 🔻' : '';
            
            // Add accessories indicator if present
            const accessoryIndicator = avatar.accessories && avatar.accessories !== 'none' ? ' ✨' : '';
            
            return creatureEmoji + sizeIndicator + accessoryIndicator;
        }
        
        // For robot or old format, show emoji
        if (avatar.creatureType === 'robot' || avatar.body === 'robot') {
            return '🤖';
        }
        
        // Fallback to initials
        return student.name.charAt(0).toUpperCase();
    }

    getCreatureEmoji(creatureType) {
        switch(creatureType) {
            case 'robot':
                return '🤖';
            case 'mouse':
                return '🐭';
            case 'fire-cat':
                return '🔥🐱';
            case 'rock-pup':
                return '🪨🐶';
            case 'poison-snake':
                return '☠️🐍';
            case 'dolphin':
                return '🐬';
            default:
                return null;
        }
    }

    getAvatarDisplay() {
        // Show appropriate emoji based on creature type
        const creatureType = this.currentStudent.avatar?.creatureType;
        
        switch(creatureType) {
            case 'robot':
                return '🤖';
            case 'mouse':
                return '🐭';
            case 'fire-cat':
                return '🔥🐱';
            case 'rock-pup':
                return '�🐶';
            case 'poison-snake':
                return '☠️🐍';
            case 'dolphin':
                return '🐬';
            default:
                // For old format or unknown types, show first letter
                return this.currentStudent.name.charAt(0).toUpperCase();
        }
    }

    renderStatsCard() {
        const stats = this.currentStudent.stats;

        return `
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);">
                        📊
                    </div>
                    <h3 class="card-title">Kudos Stats</h3>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">${this.currentStudent.kudosPoints}</span>
                        <span class="stat-label">Total Kudos Points</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.currentStudent.level}</span>
                        <span class="stat-label">Current Level</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.assignmentsCompleted || 0}</span>
                        <span class="stat-label">Kudos Earned</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.currentStudent.xp}</span>
                        <span class="stat-label">Experience Points</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderQuickActionsCard() {
        return `
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        ⚡
                    </div>
                    <h3 class="card-title">Quick Actions</h3>
                </div>
                <div class="quick-actions">
                    <button class="action-btn action-btn-primary" onclick="showAvatarBuilder()">
                        <span class="action-icon">🎨</span>
                        <span>Customize Avatar</span>
                    </button>
                    <button class="action-btn action-btn-warning" onclick="dashboardManager.showLeaderboard()">
                        <span class="action-icon">🏆</span>
                        <span>Leaderboard</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderRecentActivityCard() {
        return `
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
                        📅
                    </div>
                    <h3 class="card-title">Recent Activity</h3>
                </div>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon" style="background: #4caf50;">+5</div>
                        <div class="activity-content">
                            <div class="activity-title">Won battle against Emma</div>
                            <div class="activity-time">2 hours ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon" style="background: #2196F3;">⬆️</div>
                        <div class="activity-content">
                            <div class="activity-title">Leveled up to Level ${this.currentStudent.level}</div>
                            <div class="activity-time">1 day ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon" style="background: #ff9800;">🎨</div>
                        <div class="activity-content">
                            <div class="activity-title">Updated avatar appearance</div>
                            <div class="activity-time">3 days ago</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async showLeaderboard() {
        try {
            // Show loading state
            Utils.showToast('Loading leaderboard...', 'info');
            
            // Get leaderboard from database
            const classmates = await DatabaseAPI.getLeaderboard(
                this.currentStudent.className,
                this.currentStudent.teacherEmail
            );
            
            if (!classmates.length) {
                Utils.showToast('No classmates found', 'info');
                return;
            }
            
            // Create leaderboard HTML
            const leaderboardHTML = `
                <div class="leaderboard-overlay" onclick="dashboardManager.closeLeaderboard()">
                    <div class="leaderboard-modal" onclick="event.stopPropagation()">
                        <div class="leaderboard-header">
                            <h2>📊 Class Leaderboard</h2>
                            <button class="close-btn" onclick="dashboardManager.closeLeaderboard()">×</button>
                        </div>
                        <div class="leaderboard-content">
                            ${classmates.map((student, index) => `
                                <div class="leaderboard-item ${student.id === this.currentStudent.id ? 'current-student' : ''}">
                                    <div class="rank">${index + 1}</div>
                                    <div class="student-info">
                                        <div class="student-avatar" style="background: ${student.avatar?.bodyColor || '#667eea'};">
                                            ${this.getCustomizedAvatarForStudent(student)}
                                        </div>
                                        <div class="student-details">
                                            <div class="student-name">${student.name}</div>
                                            <div class="student-level">Level ${student.level}</div>
                                        </div>
                                    </div>
                                    <div class="student-points">${student.points} points</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            // Add to page
            document.body.insertAdjacentHTML('beforeend', leaderboardHTML);
            
            // Add CSS if not already added
            if (!document.getElementById('leaderboard-styles')) {
                const styles = document.createElement('style');
                styles.id = 'leaderboard-styles';
                styles.textContent = `
                    .leaderboard-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .leaderboard-modal {
                        background: white;
                        border-radius: 12px;
                        max-width: 500px;
                        width: 90%;
                        max-height: 80vh;
                        overflow: hidden;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    }
                    .leaderboard-header {
                        padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .leaderboard-header h2 {
                        margin: 0;
                        font-size: 1.5rem;
                    }
                    .close-btn {
                        background: none;
                        border: none;
                        color: white;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .close-btn:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    .leaderboard-content {
                        max-height: 400px;
                        overflow-y: auto;
                        padding: 10px 0;
                    }
                    .leaderboard-item {
                        display: flex;
                        align-items: center;
                        padding: 15px 20px;
                        border-bottom: 1px solid #f0f0f0;
                        transition: background-color 0.2s;
                    }
                    .leaderboard-item:hover {
                        background-color: #f8f9fa;
                    }
                    .leaderboard-item.current-student {
                        background-color: #e3f2fd;
                        border-left: 4px solid #2196F3;
                    }
                    .rank {
                        font-weight: bold;
                        font-size: 1.2rem;
                        color: #666;
                        width: 40px;
                        text-align: center;
                    }
                    .rank:first-child {
                        color: #FFD700;
                    }
                    .student-info {
                        display: flex;
                        align-items: center;
                        flex: 1;
                        margin-left: 15px;
                    }
                    .student-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        margin-right: 12px;
                    }
                    .student-details {
                        flex: 1;
                    }
                    .student-name {
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 2px;
                    }
                    .student-level {
                        font-size: 0.85rem;
                        color: #666;
                    }
                    .student-points {
                        font-weight: bold;
                        color: #4caf50;
                        font-size: 1.1rem;
                    }
                `;
                document.head.appendChild(styles);
            }
            
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            Utils.showToast('Error loading leaderboard', 'error');
        }
    }
    
    closeLeaderboard() {
        const overlay = document.querySelector('.leaderboard-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Simulate earning Kudos points (for demonstration)
    async simulateEarningPoints() {
        const pointsToAward = Math.floor(Math.random() * 15) + 5; // 5-20 points
        const reasons = [
            'Math homework completed!',
            'Perfect quiz score!',
            'Helped a classmate!',
            'Great participation!',
            'Assignment submitted early!',
            'Creative project work!',
            'Reading comprehension!',
            'Science experiment success!'
        ];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];

        try {
            const result = await MockDataAPI.awardKudosPoints(this.currentStudent.id, pointsToAward, reason);
            
            if (result) {
                // Update the current student object
                this.currentStudent = result.student;
                navigationManager.setCurrentStudent(this.currentStudent);
                
                // Show success message
                let message = `🎉 ${reason}\n+${pointsToAward} Kudos Points\n+${result.xpGained} XP`;
                
                if (result.leveledUp) {
                    message += `\n\n🆙 LEVEL UP! Welcome to Level ${result.newLevel}!\n+5 Bonus Kudos Points`;
                }
                
                Utils.showToast(message, 'success');
                
                // Refresh the dashboard to show updated stats
                await this.renderDashboard();
                
                // Add some visual feedback
                this.animatePointsGain(pointsToAward, result.leveledUp);
            }
        } catch (error) {
            console.error('Error awarding points:', error);
            Utils.showToast('Error awarding points', 'error');
        }
    }

    // Animate points gain for visual feedback
    animatePointsGain(points, leveledUp) {
        const dashboardPoints = document.querySelector('.dashboard-points');
        if (dashboardPoints) {
            // Create floating animation
            const floatingPoints = document.createElement('div');
            floatingPoints.style.cssText = `
                position: absolute;
                color: #4caf50;
                font-weight: bold;
                font-size: 1.2rem;
                pointer-events: none;
                z-index: 1000;
                animation: floatUp 2s ease-out forwards;
            `;
            floatingPoints.textContent = `+${points}`;
            
            // Add CSS animation if not already added
            if (!document.getElementById('float-animation')) {
                const style = document.createElement('style');
                style.id = 'float-animation';
                style.textContent = `
                    @keyframes floatUp {
                        0% { opacity: 1; transform: translateY(0px); }
                        100% { opacity: 0; transform: translateY(-50px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Position relative to dashboard points
            const rect = dashboardPoints.getBoundingClientRect();
            floatingPoints.style.left = rect.right + 'px';
            floatingPoints.style.top = rect.top + 'px';
            
            document.body.appendChild(floatingPoints);
            
            // Remove after animation
            setTimeout(() => {
                floatingPoints.remove();
            }, 2000);
            
            // Add level up effects
            if (leveledUp) {
                this.showLevelUpAnimation();
            }
        }
    }

    // Show level up animation
    showLevelUpAnimation() {
        const levelUpDiv = document.createElement('div');
        levelUpDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            z-index: 1001;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
            animation: levelUpPulse 3s ease-out forwards;
        `;
        levelUpDiv.innerHTML = '🆙 LEVEL UP! 🎉';
        
        // Add level up animation CSS
        if (!document.getElementById('levelup-animation')) {
            const style = document.createElement('style');
            style.id = 'levelup-animation';
            style.textContent = `
                @keyframes levelUpPulse {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                    40% { transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(levelUpDiv);
        
        // Remove after animation
        setTimeout(() => {
            levelUpDiv.remove();
        }, 3000);
    }
}

// Initialize dashboard manager
let dashboardManager;

document.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
    window.dashboardManager = dashboardManager;
});
