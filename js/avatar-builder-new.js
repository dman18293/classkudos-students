// Avatar Builder Manager for Student Portal - Pokemon Style Creatures

class AvatarBuilderManager {
    constructor() {
        this.currentStudent = null;
        this.currentAvatar = {};
        this.presetAvatars = this.generatePresetAvatars();
        this.init();
    }

    init() {
        // Initialize avatar builder
    }

    async loadAvatarBuilder() {
        this.currentStudent = navigationManager.getCurrentStudent();
        if (!this.currentStudent) {
            navigationManager.showPage('login');
            return;
        }

        this.currentAvatar = { 
            ...this.currentStudent.avatar,
            creature: this.currentStudent.avatar.creature || 'dragon',
            element: this.currentStudent.avatar.element || 'fire'
        };
        await this.renderAvatarBuilder();
    }

    generatePresetAvatars() {
        return [
            { name: 'Fire Dragon', color: '#FF4500', creature: 'dragon', element: 'fire' },
            { name: 'Ice Phoenix', color: '#87CEEB', creature: 'phoenix', element: 'ice' },
            { name: 'Magic Unicorn', color: '#DA70D6', creature: 'unicorn', element: 'magic' },
            { name: 'Cyber Robot', color: '#00CED1', creature: 'robot', element: 'tech' },
            { name: 'Shadow Wolf', color: '#483D8B', creature: 'wolf', element: 'dark' },
            { name: 'Forest Bear', color: '#228B22', creature: 'bear', element: 'earth' }
        ];
    }

    async renderAvatarBuilder() {
        const container = document.querySelector('.avatar-builder-container');
        if (!container) return;

        container.innerHTML = `
            <div class="avatar-builder-header">
                <h2>🎨 Create Your Battle Creature</h2>
                <p>Design your Pokemon-style companion for the Kudos Colosseum!</p>
            </div>

            <div class="avatar-builder-content">
                <div class="avatar-preview-section">
                    <div class="avatar-display" id="avatar-display">
                        ${this.renderAvatarDisplay()}
                    </div>
                    <div class="avatar-preview-info">
                        <h3 class="preview-name">${this.currentStudent.name}'s Creature</h3>
                        <div class="preview-stats">
                            <div class="stat-row">
                                <span>Trainer Level:</span>
                                <span>${this.currentStudent.level}</span>
                            </div>
                            <div class="stat-row">
                                <span>Kudos Points:</span>
                                <span>${this.currentStudent.kudosPoints}</span>
                            </div>
                            <div class="stat-row">
                                <span>Battle Wins:</span>
                                <span>${this.currentStudent.stats.battlesWon}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="customization-options">
                    ${this.renderPresetSection()}
                    ${this.renderRandomizeSection()}
                    ${this.renderCreatureOptions()}
                    ${this.renderElementOptions()}
                    ${this.renderSaveSection()}
                </div>
            </div>
        `;

        this.updateAvatarPreview();
    }

    renderAvatarDisplay() {
        const creatureEmoji = this.getCreatureEmoji(this.currentAvatar.creature);
        return `<span style="font-size: 5rem; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));">${creatureEmoji}</span>`;
    }

    renderPresetSection() {
        return `
            <div class="preset-section">
                <h4 class="option-title">🌟 Legendary Presets</h4>
                <p style="text-align: center; color: #666; margin-bottom: 1rem;">Try these epic creature combinations!</p>
                <div class="preset-grid">
                    ${this.presetAvatars.map((preset, index) => `
                        <div class="preset-avatar" 
                             style="background: linear-gradient(135deg, ${preset.color} 0%, ${this.adjustColor(preset.color, -20)} 100%);" 
                             onclick="avatarBuilderManager.applyPreset(${index})"
                             title="${preset.name}">
                            ${this.getCreatureEmoji(preset.creature)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderRandomizeSection() {
        return `
            <div class="randomize-section">
                <button class="randomize-btn" onclick="avatarBuilderManager.randomizeAvatar()">
                    🎲 Surprise Me!
                </button>
                <button class="randomize-btn" onclick="avatarBuilderManager.resetToDefault()" style="background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);">
                    ↺ Reset
                </button>
            </div>
        `;
    }

    renderCreatureOptions() {
        const creatures = [
            { name: 'dragon', emoji: '🐉', label: 'Fire Dragon' },
            { name: 'phoenix', emoji: '🔥', label: 'Phoenix' },
            { name: 'unicorn', emoji: '🦄', label: 'Unicorn' },
            { name: 'robot', emoji: '🤖', label: 'Cyber Robot' },
            { name: 'cat', emoji: '😺', label: 'Battle Cat' },
            { name: 'wolf', emoji: '🐺', label: 'Shadow Wolf' },
            { name: 'bear', emoji: '🐻', label: 'Forest Bear' },
            { name: 'tiger', emoji: '🐅', label: 'Storm Tiger' },
            { name: 'lion', emoji: '🦁', label: 'Lion King' },
            { name: 'panda', emoji: '🐼', label: 'Zen Panda' },
            { name: 'fox', emoji: '🦊', label: 'Clever Fox' },
            { name: 'raccoon', emoji: '🦝', label: 'Ninja Raccoon' },
            { name: 'owl', emoji: '🦉', label: 'Wise Owl' },
            { name: 'eagle', emoji: '🦅', label: 'Sky Eagle' },
            { name: 'shark', emoji: '🦈', label: 'Ocean Shark' },
            { name: 'octopus', emoji: '🐙', label: 'Deep Octopus' },
            { name: 'butterfly', emoji: '🦋', label: 'Magic Butterfly' },
            { name: 'bee', emoji: '🐝', label: 'Buzzing Bee' }
        ];

        return `
            <div class="option-group">
                <h4 class="option-title">🎮 Choose Your Battle Creature</h4>
                <p style="text-align: center; color: #666; margin-bottom: 1rem;">Pick your Pokemon-style companion!</p>
                <div class="option-grid">
                    ${creatures.map(creature => `
                        <div class="option-item creature-option ${this.currentAvatar.creature === creature.name ? 'active' : ''}" 
                             onclick="avatarBuilderManager.updateAvatar('creature', '${creature.name}')"
                             title="${creature.label}">
                            ${creature.emoji}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderElementOptions() {
        const elements = [
            { name: 'fire', emoji: '🔥', color: '#FF4500', label: 'Fire Element' },
            { name: 'water', emoji: '💧', color: '#4169E1', label: 'Water Element' },
            { name: 'earth', emoji: '🌿', color: '#228B22', label: 'Earth Element' },
            { name: 'air', emoji: '💨', color: '#87CEEB', label: 'Air Element' },
            { name: 'lightning', emoji: '⚡', color: '#FFD700', label: 'Lightning Element' },
            { name: 'ice', emoji: '❄️', color: '#B0E0E6', label: 'Ice Element' },
            { name: 'magic', emoji: '✨', color: '#DA70D6', label: 'Magic Element' },
            { name: 'dark', emoji: '🌙', color: '#483D8B', label: 'Dark Element' },
            { name: 'light', emoji: '☀️', color: '#FFA500', label: 'Light Element' },
            { name: 'tech', emoji: '⚙️', color: '#708090', label: 'Tech Element' }
        ];

        return `
            <div class="option-group">
                <h4 class="option-title">⚡ Element Power</h4>
                <p style="text-align: center; color: #666; margin-bottom: 1rem;">Choose your creature's elemental power!</p>
                <div class="option-grid">
                    ${elements.map(element => `
                        <div class="option-item element-option ${this.currentAvatar.element === element.name ? 'active' : ''}" 
                             onclick="avatarBuilderManager.updateElement('${element.name}', '${element.color}')"
                             title="${element.label}"
                             style="background: linear-gradient(135deg, ${element.color}20 0%, ${element.color}40 100%);">
                            ${element.emoji}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSaveSection() {
        return `
            <button class="save-avatar-btn" onclick="avatarBuilderManager.saveAvatar()">
                💾 Save My Epic Creature
            </button>
        `;
    }

    updateAvatar(property, value) {
        this.currentAvatar[property] = value;
        this.updateAvatarPreview();
        this.updateActiveStates();
        
        // Add some visual feedback
        Utils.showToast(`${property.charAt(0).toUpperCase() + property.slice(1)} updated!`, 'success');
    }

    updateElement(element, color) {
        this.currentAvatar.element = element;
        this.currentAvatar.color = color;
        this.updateAvatarPreview();
        this.updateActiveStates();
        Utils.showToast(`${element.charAt(0).toUpperCase() + element.slice(1)} element selected!`, 'success');
    }

    updateActiveStates() {
        // Remove all active classes first
        document.querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current selections
        document.querySelectorAll('.option-item').forEach(item => {
            const onclick = item.getAttribute('onclick');
            if (onclick) {
                // Check creature selection
                if (onclick.includes(`'creature', '${this.currentAvatar.creature}'`) && this.currentAvatar.creature) {
                    item.classList.add('active');
                }
                // Check element selection
                if (onclick.includes(`'${this.currentAvatar.element}', '${this.currentAvatar.color}'`) && this.currentAvatar.element) {
                    item.classList.add('active');
                }
            }
        });
    }

    updateAvatarPreview() {
        const display = document.getElementById('avatar-display');
        if (display) {
            // Get the creature emoji and color
            const creatureEmoji = this.getCreatureEmoji(this.currentAvatar.creature);
            const backgroundColor = this.currentAvatar.color || '#667eea';
            
            // Update the display with creature
            display.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${this.adjustColor(backgroundColor, -20)} 100%)`;
            display.innerHTML = `<span style="font-size: 5rem; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));">${creatureEmoji}</span>`;
            
            // Add some visual flair with a subtle animation
            display.style.transform = 'scale(1.05)';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
            }, 200);
            
            console.log('Avatar updated:', this.currentAvatar);
        }
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

    adjustColor(color, percent) {
        // Helper function to darken/lighten colors
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    applyPreset(presetIndex) {
        const preset = this.presetAvatars[presetIndex];
        this.currentAvatar = { ...this.currentAvatar, ...preset };
        this.updateAvatarPreview();
        this.updateActiveStates();
        Utils.showToast(`Applied ${preset.name} preset!`, 'success');
    }

    randomizeAvatar() {
        const creatures = ['dragon', 'phoenix', 'unicorn', 'robot', 'cat', 'wolf', 'bear', 'tiger', 'lion', 'panda', 'fox', 'raccoon', 'owl', 'eagle', 'shark', 'octopus', 'butterfly', 'bee'];
        const elements = [
            { name: 'fire', color: '#FF4500' },
            { name: 'water', color: '#4169E1' },
            { name: 'earth', color: '#228B22' },
            { name: 'air', color: '#87CEEB' },
            { name: 'lightning', color: '#FFD700' },
            { name: 'ice', color: '#B0E0E6' },
            { name: 'magic', color: '#DA70D6' },
            { name: 'dark', color: '#483D8B' },
            { name: 'light', color: '#FFA500' },
            { name: 'tech', color: '#708090' }
        ];
        
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        this.currentAvatar = {
            ...this.currentAvatar,
            creature: creatures[Math.floor(Math.random() * creatures.length)],
            element: randomElement.name,
            color: randomElement.color
        };
        
        this.updateAvatarPreview();
        this.updateActiveStates();
        Utils.showToast('🎲 Random creature generated!', 'success');
    }

    resetToDefault() {
        this.currentAvatar = { 
            ...this.currentStudent.avatar,
            creature: this.currentStudent.avatar.creature || 'dragon',
            element: this.currentStudent.avatar.element || 'fire'
        };
        this.updateAvatarPreview();
        this.updateActiveStates();
        Utils.showToast('Creature reset to saved version', 'info');
    }

    async saveAvatar() {
        try {
            Utils.showToast('Saving your epic creature...', 'info');
            
            // Add loading state to save button
            const saveBtn = document.querySelector('.save-avatar-btn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '⏳ Saving...';
            saveBtn.disabled = true;
            
            // Update student avatar data
            const updatedStudent = await MockDataAPI.updateStudentAvatar(
                this.currentStudent.id, 
                this.currentAvatar
            );

            if (updatedStudent) {
                // Update current student in navigation
                navigationManager.setCurrentStudent(updatedStudent);
                this.currentStudent = updatedStudent;
                
                Utils.showToast('🎉 Epic creature saved successfully!', 'success');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    navigationManager.showPage('dashboard');
                    if (window.dashboardManager) {
                        window.dashboardManager.loadDashboard();
                    }
                }, 1500);
            } else {
                throw new Error('Failed to save creature data');
            }
            
        } catch (error) {
            console.error('Error saving creature:', error);
            Utils.showToast('❌ Failed to save creature. Please try again.', 'error');
            
            // Reset button state
            const saveBtn = document.querySelector('.save-avatar-btn');
            if (saveBtn) {
                saveBtn.innerHTML = '💾 Save My Epic Creature';
                saveBtn.disabled = false;
            }
        }
    }
}

// Initialize avatar builder manager
let avatarBuilderManager;

document.addEventListener('DOMContentLoaded', () => {
    avatarBuilderManager = new AvatarBuilderManager();
    window.avatarBuilderManager = avatarBuilderManager;
});
