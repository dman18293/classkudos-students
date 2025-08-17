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

        // Refresh student data from server to get latest avatar changes and points
        try {
            const storedLoginCode = localStorage.getItem('loginCode');
            const storedClassName = localStorage.getItem('className');
            
            if (storedLoginCode && storedClassName) {
                console.log('Refreshing student data from server...');
                const refreshedStudent = await DatabaseAPI.authenticateStudent(storedLoginCode, storedClassName);
                if (refreshedStudent) {
                    console.log('Student data refreshed:', refreshedStudent);
                    console.log('Refreshed avatar data:', refreshedStudent.avatar);
                    this.currentStudent = refreshedStudent;
                    navigationManager.setCurrentStudent(refreshedStudent);
                }
            }
        } catch (error) {
            console.warn('Failed to refresh student data:', error);
            // Continue with cached data if refresh fails
        }

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
        // If we have a captured image, don't use background color as it's part of the image
        if (this.currentStudent.avatar?.imageData) {
            return 'transparent';
        }
        
        // Use the element color from the new Pokemon-style system
        if (this.currentStudent.avatar?.color) {
            return this.currentStudent.avatar.color;
        }
        
        // Fallback to old system
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

        // If we have a captured image, use it for pixel-perfect representation
        if (avatar.imageData) {
            return `<img src="${avatar.imageData}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="${student.name}'s creature" />`;
        }

        // If it's the new avatar gallery format (has emoji property), use it directly
        if (avatar.emoji) {
            return `<span style="font-size: 3rem; line-height: 1;">${avatar.emoji}</span>`;
        }

        // If it's a creature-style avatar (new Pokemon system), try to display the emoji
        if (avatar.creature) {
            const creatureEmoji = this.getCreatureEmoji(avatar.creature);
            return `<span style="font-size: 3rem; line-height: 1;">${creatureEmoji}</span>`;
        }

        // For old creature format, render actual visual creature
        if (avatar.creatureType && avatar.creatureType !== 'robot') {
            return this.renderCreatureAvatar(avatar);
        }
        
        // For robot or old format, show emoji
        if (avatar.creatureType === 'robot' || avatar.body === 'robot') {
            return '🤖';
        }
        
        // Fallback to initials
        return student.name.charAt(0).toUpperCase();
    }

    getCreatureEmoji(creatureType) {
        const creatures = {
            'dragon': '🐉',
            'phoenix': '🔥',
            'unicorn': '🦄',
            'robot': '🤖',
            'cat': '😺',
            'wolf': '🐺',
            'bear': '🐻',
            'tiger': '🐅',
            'lion': '🦁',
            'panda': '🐼',
            'fox': '🦊',
            'raccoon': '🦝',
            'owl': '🦉',
            'eagle': '🦅',
            'shark': '🦈',
            'octopus': '🐙',
            'butterfly': '🦋',
            'bee': '🐝'
        };
        
        return creatures[creatureType] || creatures['dragon'];
    }

    renderCreatureAvatar(avatar) {
        // Use new SVG-based rendering for better visuals
        return this.renderCreatureAvatarSVG(avatar);
    }

    renderCreatureAvatarSVG(avatar) {
        // Create a detailed SVG-based visual representation of the creature
        const bodyColor = avatar.bodyColor || '#FFD700';
        const bodySize = avatar.bodySize || 0.5;
        const creatureType = avatar.creatureType || 'mouse';
        const limbColor = avatar.limbColor || bodyColor;
        const eyeColor = avatar.eyeColor || '#8B4513';
        const eyeSize = avatar.eyeSize || 0.5;
        const earSize = avatar.earSize || 0.7;
        const accessories = avatar.accessories || 'none';
        
        // Calculate sizes (make larger for better visibility)
        const size = 50 + (bodySize * 30); // 50-80px
        const eyeSizeVal = 0.15 + (eyeSize * 0.1); // 0.15-0.25 ratio of body
        const earSizeVal = 0.3 + (earSize * 0.2); // 0.3-0.5 ratio of body
        
        let svgContent = '';
        
        // Generate creature-specific SVG based on type
        switch(creatureType) {
            case 'rock-pup':
                svgContent = `
                    <!-- Dog Body (larger for bodySize=1) -->
                    <ellipse cx="50" cy="65" rx="${size/2}" ry="${size/2.8}" fill="${bodyColor}" stroke="${this.getDarkerColor(bodyColor)}" stroke-width="3"/>
                    
                    <!-- Dog Head -->
                    <ellipse cx="50" cy="45" rx="${size/3}" ry="${size/4}" fill="${bodyColor}" stroke="${this.getDarkerColor(bodyColor)}" stroke-width="2"/>
                    
                    <!-- Rock Texture Pattern -->
                    <g opacity="0.4">
                        <circle cx="45" cy="60" r="4" fill="#8B4513"/>
                        <circle cx="55" cy="70" r="3" fill="#A0522D"/>
                        <circle cx="50" cy="75" r="3.5" fill="#8B4513"/>
                        <circle cx="60" cy="55" r="3" fill="#A0522D"/>
                        <circle cx="40" cy="70" r="2.5" fill="#654321"/>
                    </g>
                    
                    <!-- Dog Ears (floppy, using earColor) -->
                    <ellipse cx="35" cy="35" rx="${size * earSizeVal}" ry="${size * earSizeVal * 1.8}" 
                             fill="${avatar.earColor || bodyColor}" stroke="${this.getDarkerColor(avatar.earColor || bodyColor)}" stroke-width="2" 
                             transform="rotate(-25 35 35)"/>
                    <ellipse cx="65" cy="35" rx="${size * earSizeVal}" ry="${size * earSizeVal * 1.8}" 
                             fill="${avatar.earColor || bodyColor}" stroke="${this.getDarkerColor(avatar.earColor || bodyColor)}" stroke-width="2" 
                             transform="rotate(25 65 35)"/>
                    
                    <!-- Dog Limbs (thick for limbThickness=1) -->
                    <ellipse cx="35" cy="85" rx="8" ry="15" fill="${limbColor}"/>
                    <ellipse cx="65" cy="85" rx="8" ry="15" fill="${limbColor}"/>
                    <ellipse cx="42" cy="90" rx="7" ry="12" fill="${limbColor}"/>
                    <ellipse cx="58" cy="90" rx="7" ry="12" fill="${limbColor}"/>
                    
                    <!-- Dog Tail (long for tailLength=0.7) -->
                    <path d="M 75 60 Q 95 45 85 70" stroke="${avatar.tailColor || bodyColor}" stroke-width="10" fill="none" stroke-linecap="round"/>
                    
                    <!-- Eyes (brown, medium size) -->
                    <circle cx="42" cy="40" r="${size * eyeSizeVal}" fill="${eyeColor}"/>
                    <circle cx="58" cy="40" r="${size * eyeSizeVal}" fill="${eyeColor}"/>
                    <circle cx="42" cy="40" r="${size * eyeSizeVal * 0.6}" fill="white"/>
                    <circle cx="58" cy="40" r="${size * eyeSizeVal * 0.6}" fill="white"/>
                    <circle cx="42" cy="40" r="${size * eyeSizeVal * 0.3}" fill="black"/>
                    <circle cx="58" cy="40" r="${size * eyeSizeVal * 0.3}" fill="black"/>
                    
                    <!-- Dog Nose -->
                    <ellipse cx="50" cy="50" rx="5" ry="4" fill="black"/>
                    
                    <!-- Dog Mouth -->
                    <path d="M 50 54 Q 45 58 40 56 M 50 54 Q 55 58 60 56" stroke="black" stroke-width="2" fill="none"/>
                `;
                break;
                
            case 'mouse':
                svgContent = `
                    <!-- Mouse Body -->
                    <ellipse cx="50" cy="60" rx="${size/2}" ry="${size/2.2}" fill="${bodyColor}" stroke="${this.getDarkerColor(bodyColor)}" stroke-width="2"/>
                    
                    <!-- Mouse Ears -->
                    <circle cx="35" cy="35" r="${size * earSizeVal}" fill="${avatar.earColor || bodyColor}" stroke="${this.getDarkerColor(avatar.earColor || bodyColor)}" stroke-width="1"/>
                    <circle cx="65" cy="35" r="${size * earSizeVal}" fill="${avatar.earColor || bodyColor}" stroke="${this.getDarkerColor(avatar.earColor || bodyColor)}" stroke-width="1"/>
                    <circle cx="35" cy="35" r="${size * earSizeVal * 0.6}" fill="#FFB6C1"/>
                    <circle cx="65" cy="35" r="${size * earSizeVal * 0.6}" fill="#FFB6C1"/>
                    
                    <!-- Mouse Tail -->
                    <path d="M 75 60 Q 95 45 100 65" stroke="${avatar.tailColor || bodyColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
                    
                    <!-- Eyes -->
                    <circle cx="42" cy="50" r="${size * eyeSizeVal}" fill="${eyeColor}"/>
                    <circle cx="58" cy="50" r="${size * eyeSizeVal}" fill="${eyeColor}"/>
                    <circle cx="42" cy="50" r="${size * eyeSizeVal * 0.4}" fill="white"/>
                    <circle cx="58" cy="50" r="${size * eyeSizeVal * 0.4}" fill="white"/>
                    
                    <!-- Mouse Nose -->
                    <ellipse cx="50" cy="60" rx="2" ry="3" fill="#FF69B4"/>
                `;
                break;
                
            case 'fire-cat':
                svgContent = `
                    <!-- Cat Body -->
                    <ellipse cx="50" cy="65" rx="${size/2}" ry="${size/2.5}" fill="${bodyColor}" stroke="${this.getDarkerColor(bodyColor)}" stroke-width="2"/>
                    <circle cx="50" cy="45" r="${size/3}" fill="${bodyColor}" stroke="${this.getDarkerColor(bodyColor)}" stroke-width="2"/>
                    
                    <!-- Cat Ears (pointed) -->
                    <polygon points="35,25 42,45 28,45" fill="${avatar.earColor || bodyColor}" stroke="${this.getDarkerColor(avatar.earColor || bodyColor)}" stroke-width="1"/>
                    <polygon points="65,25 72,45 58,45" fill="${avatar.earColor || bodyColor}" stroke="${this.getDarkerColor(avatar.earColor || bodyColor)}" stroke-width="1"/>
                    
                    <!-- Fire Effect -->
                    <g opacity="0.8">
                        <ellipse cx="50" cy="15" rx="12" ry="18" fill="#FF4500" opacity="0.7"/>
                        <ellipse cx="45" cy="20" rx="8" ry="12" fill="#FF6500" opacity="0.6"/>
                        <ellipse cx="55" cy="20" rx="8" ry="12" fill="#FF6500" opacity="0.6"/>
                    </g>
                    
                    <!-- Cat Tail (curved upward) -->
                    <path d="M 75 65 Q 90 35 75 20" stroke="${avatar.tailColor || bodyColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
                    
                    <!-- Cat Eyes -->
                    <ellipse cx="42" cy="42" rx="${size * eyeSizeVal}" ry="${size * eyeSizeVal * 1.5}" fill="${eyeColor}"/>
                    <ellipse cx="58" cy="42" rx="${size * eyeSizeVal}" ry="${size * eyeSizeVal * 1.5}" fill="${eyeColor}"/>
                    <ellipse cx="42" cy="42" rx="${size * eyeSizeVal * 0.3}" ry="${size * eyeSizeVal * 0.8}" fill="#FFD700"/>
                    <ellipse cx="58" cy="42" rx="${size * eyeSizeVal * 0.3}" ry="${size * eyeSizeVal * 0.8}" fill="#FFD700"/>
                    
                    <!-- Cat Nose -->
                    <polygon points="50,50 47,53 53,53" fill="#FF69B4"/>
                `;
                break;
                
            default:
                // Default creature
                svgContent = `
                    <circle cx="50" cy="60" r="${size/2}" fill="${bodyColor}" stroke="${this.getDarkerColor(bodyColor)}" stroke-width="2"/>
                    <circle cx="42" cy="50" r="${size * eyeSizeVal}" fill="${eyeColor}"/>
                    <circle cx="58" cy="50" r="${size * eyeSizeVal}" fill="${eyeColor}"/>
                `;
                break;
        }
        
        // Add accessories
        if (accessories !== 'none') {
            const accessoryColor = avatar.accessoryColor || '#FF4500';
            switch(accessories) {
                case 'collar':
                    svgContent += `
                        <ellipse cx="50" cy="75" rx="${size/2.2}" ry="6" fill="${accessoryColor}" stroke="${this.getDarkerColor(accessoryColor)}" stroke-width="1"/>
                        <circle cx="50" cy="75" r="3" fill="gold"/>
                    `;
                    break;
                case 'hat':
                    svgContent += `
                        <ellipse cx="50" cy="25" rx="${size/2.5}" ry="12" fill="${accessoryColor}" stroke="${this.getDarkerColor(accessoryColor)}" stroke-width="1"/>
                        <ellipse cx="50" cy="30" rx="${size/3}" ry="4" fill="${accessoryColor}" stroke="${this.getDarkerColor(accessoryColor)}" stroke-width="1"/>
                    `;
                    break;
                case 'bow':
                    svgContent += `
                        <polygon points="70,35 85,30 80,40 85,50 70,45 75,40" fill="${accessoryColor}" stroke="${this.getDarkerColor(accessoryColor)}" stroke-width="1"/>
                        <circle cx="77" cy="40" r="3" fill="${this.getDarkerColor(accessoryColor)}"/>
                    `;
                    break;
            }
        }
        
        return `
            <svg width="100" height="120" viewBox="0 0 100 120" 
                 style="display: block; margin: 0 auto; max-width: 100%; height: auto;">
                ${svgContent}
            </svg>
        `;
    }

    getDarkerColor(hexColor) {
        // Convert hex to RGB and darken for border
        const hex = hexColor.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
        return `rgb(${r}, ${g}, ${b})`;
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

    // Simulate earning Kudos points (for demonstration) - DISABLED FOR SYNC
    // Points should only be awarded by teachers through the main Class Kudos app
    async simulateEarningPoints() {
        console.log('simulateEarningPoints disabled - points should only come from teacher app');
        Utils.showToast('Points are awarded by your teacher through the main Class Kudos app', 'info');
        return;
        
        /* DISABLED TO PREVENT SYNC ISSUES
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
        */ // END DISABLED CODE
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
