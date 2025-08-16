// Real Database API for Student Portal
// Replaces mock data with actual Netlify function calls

const DatabaseAPI = {
    // Base URL for Netlify functions - points to main Class Kudos site
    baseURL: 'https://classkudos.org/.netlify/functions',

    // Authenticate student with login code
    async authenticateStudent(loginCode, className) {
        try {
            console.log('DatabaseAPI: Sending authentication request:', {
                loginCode: loginCode,
                className: className,
                url: `${this.baseURL}/studentAuth`
            });

            const response = await fetch(`${this.baseURL}/studentAuth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loginCode, className })
            });

            console.log('DatabaseAPI: Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('DatabaseAPI: Error response:', errorText);
                
                let errorObj;
                try {
                    errorObj = JSON.parse(errorText);
                } catch (e) {
                    errorObj = { error: errorText || 'Authentication failed' };
                }
                throw new Error(errorObj.error || 'Authentication failed');
            }

            const result = await response.json();
            console.log('DatabaseAPI: Success response:', result);
            return result.student;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    },

    // Get leaderboard for a class
    async getLeaderboard(className, teacherEmail = null) {
        try {
            let url = `${this.baseURL}/getLeaderboard?className=${encodeURIComponent(className)}`;
            if (teacherEmail) {
                url += `&teacherEmail=${encodeURIComponent(teacherEmail)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get leaderboard');
            }

            const result = await response.json();
            return result.leaderboard;
        } catch (error) {
            console.error('Leaderboard error:', error);
            throw error;
        }
    },

    // Update student avatar
    async updateStudentAvatar(studentId, avatarData) {
        try {
            console.log('updateStudentAvatar called with:', { studentId, avatarData });
            
            const response = await fetch(`${this.baseURL}/updateStudentPortal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    avatar: avatarData
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update avatar');
            }

            const result = await response.json();
            console.log('updateStudentAvatar response:', result);
            return result.student;
        } catch (error) {
            console.error('Update avatar error:', error);
            throw error;
        }
    },

    // Test function to read avatar data directly
    async testReadAvatar(studentId) {
        try {
            console.log('🧪 Testing direct avatar read for student:', studentId);
            
            const response = await fetch(`${this.baseURL}/testAvatarRead?studentId=${studentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to test read avatar');
            }

            const result = await response.json();
            console.log('🧪 Test read response:', result);
            return result;
        } catch (error) {
            console.error('🧪 Test read error:', error);
            throw error;
        }
    },

    // Update student XP and level
    async updateStudentProgress(studentId, newXP, newLevel) {
        try {
            const response = await fetch(`${this.baseURL}/updateStudentPortal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    xp: newXP,
                    level: newLevel
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update progress');
            }

            const result = await response.json();
            return result.student;
        } catch (error) {
            console.error('Update progress error:', error);
            throw error;
        }
    },

    // Update student stats
    async updateStudentStats(studentId, statsData) {
        try {
            const response = await fetch(`${this.baseURL}/updateStudentPortal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    stats: statsData
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update stats');
            }

            const result = await response.json();
            return result.student;
        } catch (error) {
            console.error('Update stats error:', error);
            throw error;
        }
    },

    // Award kudos points and update XP (this triggers main app sync)
    async awardKudosPoints(studentName, className, pointsToAdd, teacherEmail) {
        // Note: This will need to be called from the main app when points are awarded
        // The student portal itself doesn't award points, it just displays them
        console.log('Points are awarded from the main Class Kudos app, not the student portal');
        return { success: true, message: 'Points are managed by the main app' };
    }
};

// Utility functions for level calculations (matching main app)
const LevelUtils = {
    calculateLevel(xp) {
        if (xp < 100) return 1;
        if (xp < 250) return 2;
        if (xp < 450) return 3;
        if (xp < 700) return 4;
        if (xp < 1000) return 5;
        if (xp < 1350) return 6;
        if (xp < 1750) return 7;
        if (xp < 2200) return 8;
        if (xp < 2700) return 9;
        return 10; // Max level
    },

    getXPForNextLevel(level) {
        const thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];
        return thresholds[Math.min(level, 10)] || 3250;
    },

    getXPProgressPercent(currentXP, level) {
        const currentLevelXP = this.getXPForNextLevel(level - 1);
        const nextLevelXP = this.getXPForNextLevel(level);
        const progressXP = currentXP - currentLevelXP;
        const totalNeeded = nextLevelXP - currentLevelXP;
        return Math.max(0, Math.min(100, (progressXP / totalNeeded) * 100));
    },

    // Generate consistent login code (matching main app)
    generateLoginCode(studentName, className) {
        const nameParts = studentName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts[nameParts.length - 1] || '';
        
        const firstPart = firstName.length >= 2 ? firstName.slice(0, 2).toUpperCase() : firstName.toUpperCase().padEnd(2, 'X');
        const lastPart = lastName.length >= 2 ? lastName.slice(-2).toUpperCase() : lastName.toUpperCase().padEnd(2, 'X');
        
        return `${firstPart}${lastPart}2024`;
    }
};

// Maintain backward compatibility with existing code
const MockDataAPI = DatabaseAPI;

// Export for use in other files
window.DatabaseAPI = DatabaseAPI;
window.MockDataAPI = MockDataAPI; // For backward compatibility
window.LevelUtils = LevelUtils; // Export LevelUtils for use in utils.js

// Mock data for teachers (can be static since it's just for the demo)
const mockTeachers = [
    {
        id: 1,
        name: "Ms. Johnson",
        className: "3rd Grade - Room 101",
        subject: "Math & Science",
        avatar: "👩‍🏫"
    },
    {
        id: 2,
        name: "Mr. Smith",
        className: "4th Grade - Room 205",
        subject: "English & Social Studies",
        avatar: "👨‍🏫"
    },
    {
        id: 3,
        name: "Mrs. Davis",
        className: "5th Grade - Room 312",
        subject: "All Subjects",
        avatar: "👩‍🏫"
    },
    {
        id: 4,
        name: "Mr. Wilson",
        className: "2nd Grade - Room 150",
        subject: "Reading & Art",
        avatar: "👨‍🏫"
    },
    {
        id: 5,
        name: "Ms. Garcia",
        className: "1st Grade - Room 102",
        subject: "Fundamentals",
        avatar: "👩‍🏫"
    },
    {
        id: 6,
        name: "Mrs. Chen",
        className: "6th Grade - Room 401",
        subject: "Advanced Math & Science",
        avatar: "👩‍🏫"
    }
];

window.mockTeachers = mockTeachers;
