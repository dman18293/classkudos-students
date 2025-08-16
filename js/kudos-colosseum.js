// Kudos Colosseum - Educational Learning Arena
// XP-based learning system with standards-aligned questions

class KudosColosseum {
    constructor() {
        this.currentStudent = null;
        this.currentLevel = 1;
        this.currentXP = 0;
        this.selectedGrade = 6; // Default to 6th grade
        this.selectedSubject = 'math';
        this.questionBank = this.initializeQuestionBank();
        this.standardsProgress = {};
        this.init();
    }

    init() {
        console.log('🏛️ Kudos Colosseum initialized');
        this.loadStudentProgress();
        this.renderColosseum();
    }

    initializeQuestionBank() {
        return {
            math: {
                grade6: {
                    // A. Add and subtract whole numbers
                    'whole-number-operations': [
                        {
                            id: 'wn_add_1',
                            standard: '6.A.1',
                            topic: 'Add and subtract whole numbers',
                            question: 'Calculate: 4,567 + 3,892',
                            type: 'multiple-choice',
                            options: ['8,359', '8,459', '8,559', '8,659'],
                            correct: 0,
                            explanation: 'Add each place value: 7+2=9, 6+9=15 (write 5, carry 1), 5+8+1=14 (write 4, carry 1), 4+3+1=8',
                            difficulty: 'easy',
                            xp: 10
                        },
                        {
                            id: 'wn_add_2',
                            standard: '6.A.2',
                            topic: 'Add and subtract whole numbers: word problems',
                            question: 'Sarah has 2,456 stickers. She buys 1,789 more stickers. How many stickers does she have in total?',
                            type: 'multiple-choice',
                            options: ['4,235', '4,245', '4,255', '4,265'],
                            correct: 1,
                            explanation: 'This is an addition problem: 2,456 + 1,789 = 4,245 stickers',
                            difficulty: 'easy',
                            xp: 15
                        }
                    ],

                    // B. Multiply whole numbers  
                    'multiplication': [
                        {
                            id: 'mult_1',
                            standard: '6.B.1',
                            topic: 'Multiply whole numbers',
                            question: 'Calculate: 47 × 26',
                            type: 'multiple-choice',
                            options: ['1,222', '1,322', '1,422', '1,522'],
                            correct: 0,
                            explanation: 'Using the standard algorithm: 47 × 6 = 282, 47 × 20 = 940, then 282 + 940 = 1,222',
                            difficulty: 'medium',
                            xp: 20
                        },
                        {
                            id: 'mult_2',
                            standard: '6.B.3',
                            topic: 'Multiply numbers ending in zeros',
                            question: 'Calculate: 340 × 50',
                            type: 'input',
                            correct: '17000',
                            explanation: 'Multiply 34 × 5 = 170, then add the three zeros: 17,000',
                            difficulty: 'easy',
                            xp: 15
                        }
                    ],

                    // D. Exponents
                    'exponents': [
                        {
                            id: 'exp_1',
                            standard: '6.D.1',
                            topic: 'Write multiplication expressions using exponents',
                            question: 'Write 5 × 5 × 5 × 5 using exponent notation.',
                            type: 'multiple-choice',
                            options: ['5⁴', '4⁵', '5 × 4', '4 + 5'],
                            correct: 0,
                            explanation: 'When 5 is multiplied by itself 4 times, we write it as 5⁴',
                            difficulty: 'easy',
                            xp: 10
                        },
                        {
                            id: 'exp_2',
                            standard: '6.D.2',
                            topic: 'Evaluate powers with whole number bases',
                            question: 'Calculate: 3⁴',
                            type: 'multiple-choice',
                            options: ['12', '64', '81', '128'],
                            correct: 2,
                            explanation: '3⁴ = 3 × 3 × 3 × 3 = 9 × 9 = 81',
                            difficulty: 'medium',
                            xp: 15
                        }
                    ],

                    // F. Number theory
                    'number-theory': [
                        {
                            id: 'nt_1',
                            standard: '6.F.1',
                            topic: 'Prime or composite',
                            question: 'Is 17 a prime or composite number?',
                            type: 'multiple-choice',
                            options: ['Prime', 'Composite', 'Neither', 'Both'],
                            correct: 0,
                            explanation: '17 is prime because it only has two factors: 1 and 17',
                            difficulty: 'easy',
                            xp: 10
                        },
                        {
                            id: 'nt_2',
                            standard: '6.F.6',
                            topic: 'Greatest common factor',
                            question: 'Find the greatest common factor (GCF) of 24 and 36.',
                            type: 'multiple-choice',
                            options: ['6', '8', '12', '18'],
                            correct: 2,
                            explanation: 'Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. The GCF is 12.',
                            difficulty: 'medium',
                            xp: 20
                        }
                    ],

                    // G. Fractions and decimals
                    'fractions-decimals': [
                        {
                            id: 'fd_1',
                            standard: '6.G.4',
                            topic: 'Convert fractions to decimals',
                            question: 'Convert 3/4 to a decimal.',
                            type: 'multiple-choice',
                            options: ['0.34', '0.75', '0.43', '0.67'],
                            correct: 1,
                            explanation: 'Divide 3 by 4: 3 ÷ 4 = 0.75',
                            difficulty: 'easy',
                            xp: 15
                        },
                        {
                            id: 'fd_2',
                            standard: '6.G.1',
                            topic: 'Write fractions in lowest terms',
                            question: 'Simplify the fraction 12/18 to lowest terms.',
                            type: 'multiple-choice',
                            options: ['2/3', '3/4', '4/6', '6/9'],
                            correct: 0,
                            explanation: 'Find GCF of 12 and 18, which is 6. 12÷6 = 2, 18÷6 = 3, so 12/18 = 2/3',
                            difficulty: 'medium',
                            xp: 20
                        }
                    ],

                    // S. Ratios and rates
                    'ratios-rates': [
                        {
                            id: 'rr_1',
                            standard: '6.S.1',
                            topic: 'Write a part-to-part ratio',
                            question: 'In a bag of 12 marbles, 8 are red and 4 are blue. What is the ratio of red marbles to blue marbles?',
                            type: 'multiple-choice',
                            options: ['8:4', '4:8', '8:12', '12:8'],
                            correct: 0,
                            explanation: 'The ratio of red to blue is 8:4, which can be simplified to 2:1',
                            difficulty: 'easy',
                            xp: 15
                        },
                        {
                            id: 'rr_2',
                            standard: '6.S.11',
                            topic: 'Unit rates',
                            question: 'If 6 apples cost $4.50, what is the unit rate per apple?',
                            type: 'multiple-choice',
                            options: ['$0.65', '$0.75', '$0.85', '$0.95'],
                            correct: 1,
                            explanation: 'Divide total cost by number of apples: $4.50 ÷ 6 = $0.75 per apple',
                            difficulty: 'medium',
                            xp: 20
                        }
                    ],

                    // U. Percents
                    'percents': [
                        {
                            id: 'pct_1',
                            standard: '6.U.5',
                            topic: 'Convert between percents and fractions',
                            question: 'Convert 25% to a fraction in lowest terms.',
                            type: 'multiple-choice',
                            options: ['1/4', '1/3', '2/5', '3/8'],
                            correct: 0,
                            explanation: '25% = 25/100 = 1/4 (dividing both numerator and denominator by 25)',
                            difficulty: 'easy',
                            xp: 15
                        },
                        {
                            id: 'pct_2',
                            standard: '6.V.4',
                            topic: 'Percents of numbers and money amounts',
                            question: 'What is 15% of $80?',
                            type: 'multiple-choice',
                            options: ['$10', '$12', '$14', '$16'],
                            correct: 1,
                            explanation: '15% of $80 = 0.15 × $80 = $12',
                            difficulty: 'medium',
                            xp: 20
                        }
                    ]
                }
            }
        };
    }

    renderColosseum() {
        const container = document.querySelector('.content-area');
        if (!container) return;

        container.innerHTML = `
            <div class="colosseum-container">
                <div class="colosseum-header">
                    <h1>🏛️ Kudos Colosseum</h1>
                    <p>Master academic standards and earn XP through learning!</p>
                    
                    <div class="student-stats">
                        <div class="stat-card">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-info">
                                <div class="stat-label">Current XP</div>
                                <div class="stat-value">${this.currentXP}</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-info">
                                <div class="stat-label">Level</div>
                                <div class="stat-value">${this.currentLevel}</div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">📚</div>
                            <div class="stat-info">
                                <div class="stat-label">Standards Mastered</div>
                                <div class="stat-value">${this.getMasteredStandardsCount()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="colosseum-content">
                    <div class="subject-selection">
                        <h3>📖 Choose Your Subject</h3>
                        <div class="subject-grid">
                            <div class="subject-card active" onclick="colosseumManager.selectSubject('math')">
                                <div class="subject-icon">🔢</div>
                                <div class="subject-name">Mathematics</div>
                                <div class="subject-desc">Numbers, operations, algebra & more</div>
                            </div>
                            
                            <div class="subject-card coming-soon">
                                <div class="subject-icon">📝</div>
                                <div class="subject-name">English Language Arts</div>
                                <div class="subject-desc">Coming Soon!</div>
                            </div>
                            
                            <div class="subject-card coming-soon">
                                <div class="subject-icon">🔬</div>
                                <div class="subject-name">Science</div>
                                <div class="subject-desc">Coming Soon!</div>
                            </div>
                            
                            <div class="subject-card coming-soon">
                                <div class="subject-icon">🌍</div>
                                <div class="subject-name">Social Studies</div>
                                <div class="subject-desc">Coming Soon!</div>
                            </div>
                        </div>
                    </div>

                    <div class="grade-selection">
                        <h3>🎓 Select Grade Level</h3>
                        <div class="grade-buttons">
                            ${[3,4,5,6,7,8].map(grade => `
                                <button class="grade-btn ${grade === this.selectedGrade ? 'active' : ''}" 
                                        onclick="colosseumManager.selectGrade(${grade})" 
                                        ${grade !== 6 ? 'disabled title="Coming Soon!"' : ''}>
                                    Grade ${grade}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="math-topics">
                        <h3>🧮 6th Grade Math Topics</h3>
                        <div class="topics-grid">
                            ${this.renderMathTopics()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addColosseumStyles();
    }

    renderMathTopics() {
        const topics = [
            { id: 'whole-number-operations', name: 'Whole Number Operations', icon: '➕', desc: 'Addition, subtraction & word problems' },
            { id: 'multiplication', name: 'Multiplication', icon: '✖️', desc: 'Multiply whole numbers & zeros' },
            { id: 'exponents', name: 'Exponents', icon: '📈', desc: 'Powers and exponent notation' },
            { id: 'number-theory', name: 'Number Theory', icon: '🔍', desc: 'Prime numbers, factors & multiples' },
            { id: 'fractions-decimals', name: 'Fractions & Decimals', icon: '🔢', desc: 'Converting & simplifying' },
            { id: 'ratios-rates', name: 'Ratios & Rates', icon: '⚖️', desc: 'Proportions & unit rates' },
            { id: 'percents', name: 'Percents', icon: '💯', desc: 'Converting & calculating' }
        ];

        return topics.map(topic => {
            const progress = this.getTopicProgress(topic.id);
            const questionsTotal = this.getTopicQuestionCount(topic.id);
            const questionsCompleted = progress.completed || 0;
            
            return `
                <div class="topic-card" onclick="colosseumManager.startTopic('${topic.id}')">
                    <div class="topic-icon">${topic.icon}</div>
                    <div class="topic-info">
                        <div class="topic-name">${topic.name}</div>
                        <div class="topic-desc">${topic.desc}</div>
                        <div class="topic-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(questionsCompleted/questionsTotal)*100}%"></div>
                            </div>
                            <div class="progress-text">${questionsCompleted}/${questionsTotal} completed</div>
                        </div>
                    </div>
                    <div class="topic-xp">+${this.getTopicXP(topic.id)} XP</div>
                </div>
            `;
        }).join('');
    }

    startTopic(topicId) {
        console.log(`🎯 Starting topic: ${topicId}`);
        const questions = this.questionBank.math.grade6[topicId] || [];
        
        if (questions.length === 0) {
            alert('No questions available for this topic yet!');
            return;
        }

        // Get next unanswered question
        const progress = this.getTopicProgress(topicId);
        const answeredQuestions = progress.answered || [];
        const nextQuestion = questions.find(q => !answeredQuestions.includes(q.id));
        
        if (!nextQuestion) {
            alert('🎉 Congratulations! You\'ve completed all questions in this topic!');
            return;
        }

        this.renderQuestion(nextQuestion, topicId);
    }

    renderQuestion(question, topicId) {
        const container = document.querySelector('.colosseum-content');
        
        container.innerHTML = `
            <div class="question-container">
                <div class="question-header">
                    <button class="back-btn" onclick="colosseumManager.renderColosseum()">← Back to Topics</button>
                    <div class="question-info">
                        <div class="standard-tag">Standard ${question.standard}</div>
                        <div class="topic-tag">${question.topic}</div>
                    </div>
                </div>

                <div class="question-card">
                    <div class="question-text">${question.question}</div>
                    
                    <div class="answer-section">
                        ${this.renderAnswerInput(question)}
                    </div>

                    <div class="question-actions">
                        <button class="submit-btn" onclick="colosseumManager.submitAnswer('${question.id}', '${topicId}')">
                            Submit Answer
                        </button>
                    </div>

                    <div class="question-rewards">
                        <div class="xp-reward">🌟 ${question.xp} XP</div>
                        <div class="difficulty">${question.difficulty}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAnswerInput(question) {
        if (question.type === 'multiple-choice') {
            return `
                <div class="multiple-choice">
                    ${question.options.map((option, index) => `
                        <label class="choice-option">
                            <input type="radio" name="answer" value="${index}">
                            <span class="choice-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'input') {
            return `
                <div class="text-input">
                    <input type="text" id="answer-input" placeholder="Enter your answer..." autocomplete="off">
                </div>
            `;
        }
    }

    submitAnswer(questionId, topicId) {
        const question = this.findQuestion(questionId);
        if (!question) return;

        let userAnswer = null;
        let isCorrect = false;

        if (question.type === 'multiple-choice') {
            const selected = document.querySelector('input[name="answer"]:checked');
            if (!selected) {
                alert('Please select an answer!');
                return;
            }
            userAnswer = parseInt(selected.value);
            isCorrect = userAnswer === question.correct;
        } else if (question.type === 'input') {
            userAnswer = document.getElementById('answer-input').value.trim();
            isCorrect = userAnswer.toLowerCase() === question.correct.toLowerCase();
        }

        this.processAnswer(questionId, topicId, isCorrect, question);
    }

    processAnswer(questionId, topicId, isCorrect, question) {
        // Update progress
        const progress = this.getTopicProgress(topicId);
        if (!progress.answered) progress.answered = [];
        if (!progress.answered.includes(questionId)) {
            progress.answered.push(questionId);
        }

        if (isCorrect) {
            if (!progress.correct) progress.correct = [];
            if (!progress.correct.includes(questionId)) {
                progress.correct.push(questionId);
                this.awardXP(question.xp);
            }
        }

        this.saveTopicProgress(topicId, progress);
        this.showAnswerFeedback(isCorrect, question);
    }

    showAnswerFeedback(isCorrect, question) {
        const container = document.querySelector('.question-card');
        
        const feedbackHtml = `
            <div class="answer-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="feedback-message">
                    <h3>${isCorrect ? 'Correct!' : 'Not quite right'}</h3>
                    <p>${question.explanation}</p>
                </div>
                ${isCorrect ? `<div class="xp-earned">+${question.xp} XP Earned!</div>` : ''}
            </div>
            
            <div class="feedback-actions">
                <button class="continue-btn" onclick="colosseumManager.renderColosseum()">
                    Continue Learning
                </button>
            </div>
        `;

        container.innerHTML += feedbackHtml;
    }

    awardXP(amount) {
        this.currentXP += amount;
        const newLevel = Math.floor(this.currentXP / 100) + 1;
        
        if (newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            this.showLevelUpNotification();
        }
        
        this.saveStudentProgress();
    }

    showLevelUpNotification() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <div class="level-up-text">
                    <h3>Level Up!</h3>
                    <p>You reached Level ${this.currentLevel}!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Helper methods
    findQuestion(questionId) {
        for (const subject in this.questionBank) {
            for (const grade in this.questionBank[subject]) {
                for (const topic in this.questionBank[subject][grade]) {
                    const question = this.questionBank[subject][grade][topic].find(q => q.id === questionId);
                    if (question) return question;
                }
            }
        }
        return null;
    }

    getTopicProgress(topicId) {
        if (!this.standardsProgress[topicId]) {
            this.standardsProgress[topicId] = {
                answered: [],
                correct: [],
                completed: 0
            };
        }
        return this.standardsProgress[topicId];
    }

    saveTopicProgress(topicId, progress) {
        this.standardsProgress[topicId] = progress;
        this.saveStudentProgress();
    }

    getTopicQuestionCount(topicId) {
        return this.questionBank.math.grade6[topicId]?.length || 0;
    }

    getTopicXP(topicId) {
        const questions = this.questionBank.math.grade6[topicId] || [];
        return questions.reduce((total, q) => total + q.xp, 0);
    }

    getMasteredStandardsCount() {
        let mastered = 0;
        for (const topicId in this.standardsProgress) {
            const progress = this.standardsProgress[topicId];
            const totalQuestions = this.getTopicQuestionCount(topicId);
            const correctAnswers = progress.correct?.length || 0;
            
            if (totalQuestions > 0 && correctAnswers === totalQuestions) {
                mastered++;
            }
        }
        return mastered;
    }

    selectSubject(subject) {
        this.selectedSubject = subject;
        // Update visual selection
        document.querySelectorAll('.subject-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[onclick="colosseumManager.selectSubject('${subject}')"]`).classList.add('active');
    }

    selectGrade(grade) {
        this.selectedGrade = grade;
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="colosseumManager.selectGrade(${grade})"]`).classList.add('active');
    }

    loadStudentProgress() {
        const saved = localStorage.getItem('kudos_colosseum_progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentXP = data.currentXP || 0;
            this.currentLevel = data.currentLevel || 1;
            this.standardsProgress = data.standardsProgress || {};
        }
    }

    saveStudentProgress() {
        const data = {
            currentXP: this.currentXP,
            currentLevel: this.currentLevel,
            standardsProgress: this.standardsProgress
        };
        localStorage.setItem('kudos_colosseum_progress', JSON.stringify(data));
    }

    addColosseumStyles() {
        if (document.getElementById('colosseum-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'colosseum-styles';
        styles.textContent = `
            .colosseum-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .colosseum-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .colosseum-header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .student-stats {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 20px;
                flex-wrap: wrap;
            }

            .stat-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                min-width: 150px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }

            .stat-icon {
                font-size: 2rem;
            }

            .stat-label {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: bold;
            }

            .subject-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }

            .subject-card {
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .subject-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            }

            .subject-card.active {
                border-color: #667eea;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .subject-card.coming-soon {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .subject-card.coming-soon::after {
                content: 'Coming Soon!';
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff6b6b;
                color: white;
                padding: 4px 8px;
                border-radius: 10px;
                font-size: 0.7rem;
            }

            .subject-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }

            .subject-name {
                font-size: 1.2rem;
                font-weight: bold;
                margin-bottom: 8px;
            }

            .subject-desc {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .grade-buttons {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 20px 0;
                flex-wrap: wrap;
            }

            .grade-btn {
                background: #f5f5f5;
                border: 2px solid #e0e0e0;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: bold;
            }

            .grade-btn:hover:not(:disabled) {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .grade-btn.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: #667eea;
            }

            .grade-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .topics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }

            .topic-card {
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 15px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .topic-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                border-color: #667eea;
            }

            .topic-icon {
                font-size: 2.5rem;
                flex-shrink: 0;
            }

            .topic-info {
                flex: 1;
            }

            .topic-name {
                font-size: 1.1rem;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .topic-desc {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 10px;
            }

            .topic-progress {
                margin-top: 10px;
            }

            .progress-bar {
                background: #e0e0e0;
                border-radius: 10px;
                height: 6px;
                overflow: hidden;
                margin-bottom: 5px;
            }

            .progress-fill {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                height: 100%;
                transition: width 0.3s ease;
            }

            .progress-text {
                font-size: 0.8rem;
                color: #666;
            }

            .topic-xp {
                background: #4ecdc4;
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
                flex-shrink: 0;
            }

            .question-container {
                max-width: 800px;
                margin: 0 auto;
            }

            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 15px;
            }

            .back-btn {
                background: #f5f5f5;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .back-btn:hover {
                background: #667eea;
                color: white;
            }

            .question-info {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .standard-tag, .topic-tag {
                background: #667eea;
                color: white;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
            }

            .topic-tag {
                background: #4ecdc4;
            }

            .question-card {
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .question-text {
                font-size: 1.2rem;
                font-weight: bold;
                margin-bottom: 25px;
                line-height: 1.6;
            }

            .multiple-choice {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 25px;
            }

            .choice-option {
                background: #f8f9fa;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .choice-option:hover {
                background: #e3f2fd;
                border-color: #667eea;
            }

            .choice-option input[type="radio"] {
                margin: 0;
                transform: scale(1.2);
            }

            .choice-text {
                font-size: 1rem;
                flex: 1;
            }

            .text-input input {
                width: 100%;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 1.1rem;
                margin-bottom: 25px;
            }

            .text-input input:focus {
                outline: none;
                border-color: #667eea;
            }

            .question-actions {
                text-align: center;
                margin-bottom: 20px;
            }

            .submit-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
            }

            .question-rewards {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }

            .xp-reward {
                background: #4ecdc4;
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
            }

            .difficulty {
                background: #ff6b6b;
                color: white;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 0.9rem;
                text-transform: capitalize;
            }

            .answer-feedback {
                margin: 20px 0;
                padding: 20px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .answer-feedback.correct {
                background: #e8f5e8;
                border: 2px solid #4caf50;
            }

            .answer-feedback.incorrect {
                background: #fff3e0;
                border: 2px solid #ff9800;
            }

            .feedback-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }

            .feedback-message h3 {
                margin: 0 0 10px 0;
                font-size: 1.2rem;
            }

            .feedback-message p {
                margin: 0;
                line-height: 1.5;
            }

            .xp-earned {
                background: #4ecdc4;
                color: white;
                padding: 10px 15px;
                border-radius: 20px;
                font-weight: bold;
                margin-left: auto;
            }

            .feedback-actions {
                text-align: center;
                margin-top: 20px;
            }

            .continue-btn {
                background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .continue-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(78, 205, 196, 0.3);
            }

            .level-up-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 1000;
                animation: levelUpPulse 0.5s ease-out;
            }

            .level-up-content {
                display: flex;
                align-items: center;
                gap: 20px;
                text-align: center;
            }

            .level-up-icon {
                font-size: 3rem;
            }

            .level-up-text h3 {
                margin: 0 0 10px 0;
                font-size: 1.5rem;
            }

            .level-up-text p {
                margin: 0;
                font-size: 1.1rem;
                opacity: 0.9;
            }

            @keyframes levelUpPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }

            @media (max-width: 768px) {
                .colosseum-container {
                    padding: 15px;
                }
                
                .student-stats {
                    flex-direction: column;
                    align-items: center;
                }
                
                .question-header {
                    flex-direction: column;
                    align-items: stretch;
                    text-align: center;
                }
                
                .question-info {
                    justify-content: center;
                }
                
                .question-rewards {
                    flex-direction: column;
                    gap: 10px;
                    text-align: center;
                }
            }
        `;

        document.head.appendChild(styles);
    }
}

// Initialize the Kudos Colosseum
let colosseumManager;

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure other systems are loaded
    setTimeout(() => {
        if (typeof colosseumManager === 'undefined') {
            colosseumManager = new KudosColosseum();
        }
    }, 1000);
});

// Export for global access
window.colosseumManager = colosseumManager;
