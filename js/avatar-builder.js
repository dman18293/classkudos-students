// Avatar Builder Manager
class AvatarBuilderManager {
    constructor() {
        this.currentStudent = null;
        this.avatarData = {
            body: 'robot',
            color: '#667eea',
            hair: 'short',
            hairColor: '#8B4513',
            eyes: 'happy',
            clothes: 'tshirt',
            clothesColor: '#4169E1'
        };
        this.init();
    }

    async init() {
        console.log('Initializing avatar builder...');
        
        // Get student data from localStorage
        const studentData = localStorage.getItem('classkudos_student');
        if (!studentData) {
            console.error('No student data found');
            return;
        }

        try {
            this.currentStudent = JSON.parse(studentData);
            
            // Load existing avatar if available
            if (this.currentStudent.avatar) {
                try {
                    this.avatarData = JSON.parse(this.currentStudent.avatar) || this.avatarData;
                } catch (e) {
                    console.log('Using default avatar data');
                }
            }
            
            this.loadAvatarBuilder();
        } catch (error) {
            console.error('Error loading avatar builder:', error);
        }
    }

    loadAvatarBuilder() {
        const container = document.querySelector('.avatar-container');
        if (!container) return;

        container.innerHTML = `
            <div class="avatar-builder-header">
                <h1>🎨 Customize Your Avatar</h1>
                <p>Make your avatar unique! Changes will be saved automatically.</p>
            </div>

            <div class="avatar-builder-content">
                <div class="avatar-preview">
                    <div class="avatar-display" id="avatar-display">
                        ${this.generateAvatarSVG()}
                    </div>
                    <button class="save-button" onclick="avatarBuilderManager.saveAvatar()">
                        💾 Save Avatar
                    </button>
                </div>

                <div class="avatar-controls">
                    <div class="control-group">
                        <h3>👤 Character</h3>
                        <div class="control-options">
                            ${this.renderBodyOptions()}
                        </div>
                    </div>

                    <div class="control-group">
                        <h3>🎨 Body Color</h3>
                        <div class="control-options">
                            ${this.renderColorOptions('color')}
                        </div>
                    </div>

                    <div class="control-group">
                        <h3>💇 Hair Style</h3>
                        <div class="control-options">
                            ${this.renderHairOptions()}
                        </div>
                    </div>

                    <div class="control-group">
                        <h3>🎨 Hair Color</h3>
                        <div class="control-options">
                            ${this.renderColorOptions('hairColor')}
                        </div>
                    </div>

                    <div class="control-group">
                        <h3>👀 Eyes</h3>
                        <div class="control-options">
                            ${this.renderEyeOptions()}
                        </div>
                    </div>

                    <div class="control-group">
                        <h3>👕 Clothing</h3>
                        <div class="control-options">
                            ${this.renderClothesOptions()}
                        </div>
                    </div>

                    <div class="control-group">
                        <h3>🎨 Clothing Color</h3>
                        <div class="control-options">
                            ${this.renderColorOptions('clothesColor')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBodyOptions() {
        const bodies = ['robot', 'human', 'cat', 'dog', 'bear'];
        return bodies.map(body => `
            <button class="option-button ${this.avatarData.body === body ? 'active' : ''}" 
                    onclick="avatarBuilderManager.updateAvatar('body', '${body}')">
                ${this.getBodyEmoji(body)}
            </button>
        `).join('');
    }

    renderColorOptions(type) {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f'];
        return colors.map(color => `
            <button class="color-option ${this.avatarData[type] === color ? 'active' : ''}" 
                    style="background: ${color}"
                    onclick="avatarBuilderManager.updateAvatar('${type}', '${color}')">
            </button>
        `).join('');
    }

    renderHairOptions() {
        const hair = ['short', 'long', 'curly', 'bald', 'ponytail'];
        return hair.map(style => `
            <button class="option-button ${this.avatarData.hair === style ? 'active' : ''}" 
                    onclick="avatarBuilderManager.updateAvatar('hair', '${style}')">
                ${this.getHairEmoji(style)}
            </button>
        `).join('');
    }

    renderEyeOptions() {
        const eyes = ['happy', 'sleepy', 'wink', 'cool', 'surprised'];
        return eyes.map(eye => `
            <button class="option-button ${this.avatarData.eyes === eye ? 'active' : ''}" 
                    onclick="avatarBuilderManager.updateAvatar('eyes', '${eye}')">
                ${this.getEyeEmoji(eye)}
            </button>
        `).join('');
    }

    renderClothesOptions() {
        const clothes = ['tshirt', 'hoodie', 'dress', 'jacket', 'tank'];
        return clothes.map(item => `
            <button class="option-button ${this.avatarData.clothes === item ? 'active' : ''}" 
                    onclick="avatarBuilderManager.updateAvatar('clothes', '${item}')">
                ${this.getClothesEmoji(item)}
            </button>
        `).join('');
    }

    getBodyEmoji(body) {
        const emojis = { robot: '🤖', human: '👤', cat: '🐱', dog: '🐶', bear: '🐻' };
        return emojis[body] || '👤';
    }

    getHairEmoji(hair) {
        const emojis = { short: '✂️', long: '💇', curly: '🌀', bald: '👨‍🦲', ponytail: '🎀' };
        return emojis[hair] || '✂️';
    }

    getEyeEmoji(eye) {
        const emojis = { happy: '😊', sleepy: '😴', wink: '😉', cool: '😎', surprised: '😮' };
        return emojis[eye] || '😊';
    }

    getClothesEmoji(clothes) {
        const emojis = { tshirt: '👕', hoodie: '🧥', dress: '👗', jacket: '🧥', tank: '🎽' };
        return emojis[clothes] || '👕';
    }

    updateAvatar(property, value) {
        this.avatarData[property] = value;
        this.updatePreview();
        this.updateActiveStates();
    }

    updatePreview() {
        const display = document.getElementById('avatar-display');
        if (display) {
            display.innerHTML = this.generateAvatarSVG();
        }
    }

    updateActiveStates() {
        // Remove all active states
        document.querySelectorAll('.option-button, .color-option').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active states for current selections
        Object.entries(this.avatarData).forEach(([key, value]) => {
            const selector = key.includes('Color') ? '.color-option' : '.option-button';
            const button = document.querySelector(`${selector}[onclick*="${value}"]`);
            if (button) {
                button.classList.add('active');
            }
        });
    }

    generateAvatarSVG() {
        // Simple SVG avatar generator
        return `
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <!-- Background circle -->
                <circle cx="60" cy="60" r="60" fill="${this.avatarData.color}"/>
                
                <!-- Hair -->
                ${this.generateHair()}
                
                <!-- Eyes -->
                ${this.generateEyes()}
                
                <!-- Mouth -->
                <path d="M45 75 Q60 85 75 75" stroke="white" stroke-width="3" fill="none"/>
                
                <!-- Clothes indicator -->
                <rect x="40" y="90" width="40" height="30" fill="${this.avatarData.clothesColor}" rx="5"/>
            </svg>
        `;
    }

    generateHair() {
        if (this.avatarData.hair === 'bald') return '';
        
        const hairPaths = {
            short: '<path d="M30 40 Q60 20 90 40 L90 60 Q60 30 30 60 Z" fill="' + this.avatarData.hairColor + '"/>',
            long: '<path d="M25 35 Q60 15 95 35 L95 80 Q60 25 25 80 Z" fill="' + this.avatarData.hairColor + '"/>',
            curly: '<circle cx="40" cy="35" r="8" fill="' + this.avatarData.hairColor + '"/><circle cx="60" cy="30" r="8" fill="' + this.avatarData.hairColor + '"/><circle cx="80" cy="35" r="8" fill="' + this.avatarData.hairColor + '"/>',
            ponytail: '<path d="M30 40 Q60 20 90 40 L90 50 Q60 30 30 50 Z" fill="' + this.avatarData.hairColor + '"/><circle cx="90" cy="55" r="6" fill="' + this.avatarData.hairColor + '"/>'
        };
        
        return hairPaths[this.avatarData.hair] || hairPaths.short;
    }

    generateEyes() {
        const eyeStyles = {
            happy: '<circle cx="45" cy="50" r="3" fill="white"/><circle cx="75" cy="50" r="3" fill="white"/>',
            sleepy: '<path d="M42 50 L48 50" stroke="white" stroke-width="2"/><path d="M72 50 L78 50" stroke="white" stroke-width="2"/>',
            wink: '<circle cx="45" cy="50" r="3" fill="white"/><path d="M72 50 L78 50" stroke="white" stroke-width="2"/>',
            cool: '<rect x="35" y="47" width="50" height="6" fill="black" rx="3"/>',
            surprised: '<circle cx="45" cy="50" r="4" fill="white"/><circle cx="75" cy="50" r="4" fill="white"/>'
        };
        
        return eyeStyles[this.avatarData.eyes] || eyeStyles.happy;
    }

    async saveAvatar() {
        try {
            const saveButton = document.querySelector('.save-button');
            if (saveButton) {
                saveButton.textContent = '💾 Saving...';
                saveButton.disabled = true;
            }

            // Update local storage
            this.currentStudent.avatar = JSON.stringify(this.avatarData);
            localStorage.setItem('classkudos_student', JSON.stringify(this.currentStudent));

            // Here you could add an API call to save to the database
            // For now, we'll just simulate a save
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (saveButton) {
                saveButton.textContent = '✅ Saved!';
                setTimeout(() => {
                    saveButton.textContent = '💾 Save Avatar';
                    saveButton.disabled = false;
                }, 2000);
            }

            console.log('Avatar saved successfully!');
            
        } catch (error) {
            console.error('Error saving avatar:', error);
            const saveButton = document.querySelector('.save-button');
            if (saveButton) {
                saveButton.textContent = '❌ Error';
                setTimeout(() => {
                    saveButton.textContent = '💾 Save Avatar';
                    saveButton.disabled = false;
                }, 2000);
            }
        }
    }
}

// Initialize avatar builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the avatar page
    if (document.getElementById('avatar-page')) {
        window.avatarBuilderManager = new AvatarBuilderManager();
    }
});

// Also make it available immediately
window.AvatarBuilderManager = AvatarBuilderManager;

// Global function for navigation
function initAvatarBuilder() {
    if (!window.avatarBuilderManager) {
        window.avatarBuilderManager = new AvatarBuilderManager();
    } else {
        window.avatarBuilderManager.loadAvatarBuilder();
    }
}
