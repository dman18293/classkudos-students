// Student Dashboard Manager
class DashboardManager {
    constructor() {
        this.currentStudent = null;
        this.init();
    }

    async init() {
        console.log('Initializing dashboard...');
        
        // Get student data from localStorage
        const studentData = localStorage.getItem('classkudos_student');
        if (!studentData) {
            console.error('No student data found, redirecting to login');
            window.location.href = '/';
            return;
        }

        try {
            this.currentStudent = JSON.parse(studentData);
            console.log('Student data loaded:', this.currentStudent);
            await this.loadDashboard();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard. Please try logging in again.');
        }
    }

    async loadDashboard() {
        const container = document.querySelector('.dashboard-container');
        if (!container) return;

        // Show loading
        container.innerHTML = '<div class="loading">Loading your dashboard...</div>';

        try {
            // Get updated student data and leaderboard
            const [studentData, leaderboardData] = await Promise.all([
                this.getStudentData(),
                this.getLeaderboard()
            ]);

            // Render dashboard
            this.renderDashboard(container, studentData, leaderboardData);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data.');
        }
    }

    async getStudentData() {
        try {
            const response = await fetch(`/.netlify/functions/getKudos?studentId=${this.currentStudent.id}`);
            const data = await response.json();
            return data[0]; // getKudos returns an array
        } catch (error) {
            console.error('Error fetching student data:', error);
            return this.currentStudent; // Fall back to cached data
        }
    }

    async getLeaderboard() {
        try {
            const response = await fetch(`/.netlify/functions/getLeaderboard?classCode=${this.currentStudent.classCode}`);
            const data = await response.json();
            return data.leaderboard || [];
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }

    renderDashboard(container, studentData, leaderboard) {
        const student = studentData || this.currentStudent;
        const points = student.points || 0;
        const className = student.class || student.classCode;
        
        // Find student's rank in leaderboard
        const studentRank = leaderboard.findIndex(s => s.studentId == student.id) + 1;
        const totalStudents = leaderboard.length;

        container.innerHTML = `
            <div class="dashboard-header">
                <div class="student-info">
                    <div class="student-avatar">
                        <img src="${this.getAvatarUrl(student)}" alt="${student.name}" />
                    </div>
                    <div class="student-details">
                        <h1>Welcome back, ${student.name}!</h1>
                        <p class="class-name">${className}</p>
                        <div class="points-display">
                            <span class="points-value">${points}</span>
                            <span class="points-label">Kudos Points</span>
                        </div>
                        ${studentRank > 0 ? `
                            <div class="rank-display">
                                <span class="rank-value">#${studentRank}</span>
                                <span class="rank-label">of ${totalStudents} students</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="dashboard-content">
                <div class="dashboard-section">
                    <h2>🏆 Class Leaderboard</h2>
                    <div class="leaderboard">
                        ${this.renderLeaderboard(leaderboard, student.id)}
                    </div>
                </div>

                <div class="dashboard-section">
                    <h2>🎯 Your Progress</h2>
                    <div class="progress-cards">
                        <div class="progress-card">
                            <div class="progress-icon">📊</div>
                            <div class="progress-info">
                                <h3>${points}</h3>
                                <p>Total Points</p>
                            </div>
                        </div>
                        <div class="progress-card">
                            <div class="progress-icon">🏅</div>
                            <div class="progress-info">
                                <h3>${studentRank > 0 ? `#${studentRank}` : 'N/A'}</h3>
                                <p>Class Rank</p>
                            </div>
                        </div>
                        <div class="progress-card">
                            <div class="progress-icon">👥</div>
                            <div class="progress-info">
                                <h3>${totalStudents}</h3>
                                <p>Classmates</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-section">
                    <h2>🎨 Customize</h2>
                    <div class="action-buttons">
                        <button class="action-button" onclick="showAvatarBuilder()">
                            <span class="button-icon">🎨</span>
                            <span class="button-text">Edit Avatar</span>
                        </button>
                        <button class="action-button" onclick="dashboardManager.refreshData()">
                            <span class="button-icon">🔄</span>
                            <span class="button-text">Refresh</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderLeaderboard(leaderboard, currentStudentId) {
        if (!leaderboard || leaderboard.length === 0) {
            return '<div class="no-data">No leaderboard data available</div>';
        }

        // Show top 10 students
        const topStudents = leaderboard.slice(0, 10);
        
        return topStudents.map(student => {
            const isCurrentStudent = student.studentId == currentStudentId;
            const rankClass = student.rank <= 3 ? `rank-${student.rank}` : '';
            
            return `
                <div class="leaderboard-item ${isCurrentStudent ? 'current-student' : ''} ${rankClass}">
                    <div class="leaderboard-rank">
                        ${student.rank <= 3 ? this.getRankEmoji(student.rank) : `#${student.rank}`}
                    </div>
                    <div class="leaderboard-avatar">
                        <img src="${this.getAvatarUrl(student)}" alt="${student.name}" />
                    </div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-name">${student.name}${isCurrentStudent ? ' (You)' : ''}</div>
                        <div class="leaderboard-points">${student.points} points</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getRankEmoji(rank) {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    }

    getAvatarUrl(student) {
        // Default avatar if none exists
        return student.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM2NjdlZWEiLz4KPGV5ZXMgY3g9IjIyIiBjeT0iMjQiIHI9IjMiIGZpbGw9IndoaXRlIi8+CjxleWVzIGN4PSI0MiIgY3k9IjI0IiByPSIzIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAgNDBxMTIgOCAyNCAwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+';
    }

    async refreshData() {
        console.log('Refreshing dashboard data...');
        await this.loadDashboard();
    }

    showError(message) {
        const container = document.querySelector('.dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the dashboard page
    if (document.getElementById('dashboard-page')) {
        window.dashboardManager = new DashboardManager();
    }
});

// Also make it available immediately for login redirects
window.DashboardManager = DashboardManager;

// Global function for navigation
function initDashboard() {
    if (!window.dashboardManager) {
        window.dashboardManager = new DashboardManager();
    } else {
        window.dashboardManager.loadDashboard();
    }
}
