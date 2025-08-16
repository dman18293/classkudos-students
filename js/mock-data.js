// Mock Data for Student Portal Development
// This will be replaced with real database calls later

const mockData = {
    teachers: [
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
    ],

    students: {
        1: [ // Ms. Johnson's class
            {
                id: 101,
                name: "Alex Thompson",
                loginCode: "AT2024", // Unique login code for this student
                kudosPoints: 45,
                level: 3,
                xp: 150,
                xpToNext: 200,
                avatar: {
                    body: "default",
                    color: "#FFB6C1",
                    hair: "short",
                    hairColor: "#8B4513",
                    eyes: "happy",
                    clothes: "tshirt",
                    clothesColor: "#4169E1"
                },
                stats: {
                    questionsAnswered: 85,
                    accuracy: 78,
                    assignmentsCompleted: 12,
                    averageScore: 82
                }
            },
            {
                id: 102,
                name: "Emma Rodriguez",
                loginCode: "ER2024", // Unique login code for this student
                kudosPoints: 62,
                level: 4,
                xp: 89,
                xpToNext: 250,
                avatar: {
                    body: "default",
                    color: "#DEB887",
                    hair: "long",
                    hairColor: "#000000",
                    eyes: "sparkle",
                    clothes: "dress",
                    clothesColor: "#FF69B4"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 120,
                    accuracy: 85
                }
            },
            {
                id: 103,
                name: "Jake Martinez",
                loginCode: "JM2024", // Unique login code for this student
                kudosPoints: 38,
                level: 2,
                xp: 175,
                xpToNext: 150,
                avatar: {
                    body: "default",
                    color: "#F4A460",
                    hair: "messy",
                    hairColor: "#FF4500",
                    eyes: "cool",
                    clothes: "hoodie",
                    clothesColor: "#32CD32"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 65,
                    accuracy: 72
                }
            },
            {
                id: 104,
                name: "Sophia Chen",
                loginCode: "SC2024", // Unique login code for this student
                kudosPoints: 71,
                level: 5,
                xp: 45,
                xpToNext: 300,
                avatar: {
                    body: "default",
                    color: "#FFDBAC",
                    hair: "pigtails",
                    hairColor: "#4B0082",
                    eyes: "determined",
                    clothes: "uniform",
                    clothesColor: "#000080"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 145,
                    accuracy: 92
                }
            }
        ],
        2: [ // Mr. Smith's class
            {
                id: 201,
                name: "Michael Brown",
                loginCode: "MB2024", // Unique login code for this student
                kudosPoints: 54,
                level: 3,
                xp: 180,
                xpToNext: 200,
                avatar: {
                    body: "default",
                    color: "#DEB887",
                    hair: "buzz",
                    hairColor: "#8B4513",
                    eyes: "friendly",
                    clothes: "polo",
                    clothesColor: "#FF6347"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 95,
                    accuracy: 81
                }
            },
            {
                id: 202,
                name: "Isabella Wilson",
                kudosPoints: 43,
                level: 3,
                xp: 95,
                xpToNext: 200,
                avatar: {
                    body: "default",
                    color: "#FFB6C1",
                    hair: "curly",
                    hairColor: "#DAA520",
                    eyes: "bright",
                    clothes: "sweater",
                    clothesColor: "#9370DB"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 78,
                    accuracy: 75
                }
            }
        ],
        3: [ // Mrs. Davis's class
            {
                id: 301,
                name: "Ethan Taylor",
                kudosPoints: 89,
                level: 6,
                xp: 123,
                xpToNext: 350,
                avatar: {
                    body: "default",
                    color: "#F4A460",
                    hair: "spiky",
                    hairColor: "#000000",
                    eyes: "confident",
                    clothes: "jacket",
                    clothesColor: "#2F4F4F"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 175,
                    accuracy: 89
                }
            },
            {
                id: 302,
                name: "Olivia Johnson",
                kudosPoints: 67,
                level: 4,
                xp: 234,
                xpToNext: 250,
                avatar: {
                    body: "default",
                    color: "#FFDBAC",
                    hair: "braids",
                    hairColor: "#8B0000",
                    eyes: "kind",
                    clothes: "cardigan",
                    clothesColor: "#20B2AA"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 134,
                    accuracy: 86
                }
            }
        ],

        6: [ // Mrs. Chen's 6th Grade class
            {
                id: 601,
                name: "Maya Johnson",
                kudosPoints: 85,
                level: 6,
                xp: 245,
                xpToNext: 500,
                avatar: {
                    body: "default",
                    color: "#DEB887",
                    hair: "long",
                    hairColor: "#654321",
                    eyes: "determined",
                    clothes: "hoodie",
                    clothesColor: "#9932CC"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 198,
                    accuracy: 91
                }
            },
            {
                id: 602,
                name: "Ethan Kim",
                kudosPoints: 72,
                level: 5,
                xp: 156,
                xpToNext: 400,
                avatar: {
                    body: "default",
                    color: "#F4A460",
                    hair: "short",
                    hairColor: "#000000",
                    eyes: "focused",
                    clothes: "tshirt",
                    clothesColor: "#FF6347"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 145,
                    accuracy: 88
                }
            },
            {
                id: 603,
                name: "Sophia Williams",
                kudosPoints: 98,
                level: 7,
                xp: 89,
                xpToNext: 600,
                avatar: {
                    body: "default",
                    color: "#FFB6C1",
                    hair: "curly",
                    hairColor: "#8B4513",
                    eyes: "bright",
                    clothes: "dress",
                    clothesColor: "#40E0D0"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 224,
                    accuracy: 94
                }
            },
            {
                id: 604,
                name: "Jackson Davis",
                kudosPoints: 67,
                level: 5,
                xp: 234,
                xpToNext: 400,
                avatar: {
                    body: "default",
                    color: "#D2B48C",
                    hair: "buzz",
                    hairColor: "#8B4513",
                    eyes: "curious",
                    clothes: "jacket",
                    clothesColor: "#4169E1"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 167,
                    accuracy: 83
                }
            },
            {
                id: 605,
                name: "Isabella Lopez",
                kudosPoints: 91,
                level: 6,
                xp: 378,
                xpToNext: 500,
                avatar: {
                    body: "default",
                    color: "#F5DEB3",
                    hair: "braids",
                    hairColor: "#2F4F4F",
                    eyes: "confident",
                    clothes: "blouse",
                    clothesColor: "#FF69B4"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 189,
                    accuracy: 92
                }
            },
            {
                id: 606,
                name: "Noah Thompson",
                kudosPoints: 58,
                level: 4,
                xp: 123,
                xpToNext: 300,
                avatar: {
                    body: "default",
                    color: "#FFE4E1",
                    hair: "messy",
                    hairColor: "#B8860B",
                    eyes: "thoughtful",
                    clothes: "sweater",
                    clothesColor: "#32CD32"
                },
                stats: {
                    assignmentsCompleted: 12,
                    averageScore: 85,
                    questionsAnswered: 132,
                    accuracy: 79
                }
            }
        ]
    },

    // Sample battle questions by grade level
    battleQuestions: {
        grade1: [
            {
                question: "What is 3 + 2?",
                answers: ["4", "5", "6", "7"],
                correct: 1,
                subject: "Math"
            },
            {
                question: "Which letter comes after 'B'?",
                answers: ["A", "C", "D", "E"],
                correct: 1,
                subject: "Language Arts"
            }
        ],
        grade2: [
            {
                question: "What is 8 - 3?",
                answers: ["4", "5", "6", "7"],
                correct: 1,
                subject: "Math"
            },
            {
                question: "How many legs does a spider have?",
                answers: ["6", "8", "10", "12"],
                correct: 1,
                subject: "Science"
            }
        ],
        grade3: [
            {
                question: "What is 7 × 4?",
                answers: ["24", "28", "32", "35"],
                correct: 1,
                subject: "Math"
            },
            {
                question: "What do plants need to make food?",
                answers: ["Water only", "Sunlight only", "Sunlight and water", "Soil only"],
                correct: 2,
                subject: "Science"
            }
        ],
        grade4: [
            {
                question: "What is 144 ÷ 12?",
                answers: ["11", "12", "13", "14"],
                correct: 1,
                subject: "Math"
            },
            {
                question: "Which continent is Egypt in?",
                answers: ["Asia", "Africa", "Europe", "South America"],
                correct: 1,
                subject: "Social Studies"
            }
        ],
        grade5: [
            {
                question: "What is 15% of 200?",
                answers: ["25", "30", "35", "40"],
                correct: 1,
                subject: "Math"
            },
            {
                question: "What is the process by which plants make food called?",
                answers: ["Respiration", "Photosynthesis", "Digestion", "Circulation"],
                correct: 1,
                subject: "Science"
            }
        ]
    },

    // XP requirements for each level
    levelRequirements: {
        1: 100,
        2: 150,
        3: 200,
        4: 250,
        5: 300,
        6: 350,
        7: 400,
        8: 450,
        9: 500,
        10: 600
    }
};

// Utility functions for mock data
const MockDataAPI = {
    // Get all teachers
    getTeachers() {
        return Promise.resolve(mockData.teachers);
    },

    // Get students for a specific teacher
    getStudentsForTeacher(teacherId) {
        return Promise.resolve(mockData.students[teacherId] || []);
    },

    // Get specific student data
    getStudent(studentId) {
        for (let teacherId in mockData.students) {
            const student = mockData.students[teacherId].find(s => s.id === studentId);
            if (student) {
                return Promise.resolve(student);
            }
        }
        return Promise.resolve(null);
    },

    // Update student avatar
    updateStudentAvatar(studentId, avatarData) {
        for (let teacherId in mockData.students) {
            const student = mockData.students[teacherId].find(s => s.id === studentId);
            if (student) {
                student.avatar = { ...student.avatar, ...avatarData };
                return Promise.resolve(student);
            }
        }
        return Promise.resolve(null);
    },

    // Update student XP and level
    updateStudentProgress(studentId, xpGained) {
        for (let teacherId in mockData.students) {
            const student = mockData.students[teacherId].find(s => s.id === studentId);
            if (student) {
                student.xp += xpGained;
                
                // Check for level up
                const currentLevelReq = mockData.levelRequirements[student.level];
                if (student.xp >= currentLevelReq) {
                    student.level++;
                    student.xp = 0;
                    student.kudosPoints += 10; // Bonus kudos for leveling up
                    student.xpToNext = mockData.levelRequirements[student.level] || 1000;
                }
                
                return Promise.resolve(student);
            }
        }
        return Promise.resolve(null);
    }
};

// Export for use in other files
window.MockDataAPI = MockDataAPI;
window.mockData = mockData;
