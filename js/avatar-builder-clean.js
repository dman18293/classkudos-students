// Creature Avatar Builder Manager for Student Portal - Full Creature Customization

class AvatarBuilderManager {
    constructor() {
        this.currentStudent = null;
        this.currentAvatar = {};
        this.presetCreatures = this.generatePresetCreatures();
        this.creatureCategories = this.getCreatureCategories();
        this.currentCategory = 'creature-type';
        this.init();
    }

    init() {
        // Initialize creature builder with default values
        this.defaultCreature = {
            // Creature Base
            creatureType: 'mouse', // mouse, cat, dog, snake, dolphin
            
            // Body Characteristics
            bodySize: 0.5, // 0 = skinny, 1 = chubby (slider)
            bodyColor: '#FFD700', // Primary body color
            bodyPattern: 'solid', // solid, striped, spotted, gradient
            
            // Limbs
            limbLength: 0.5, // 0 = short, 1 = long (slider)
            limbThickness: 0.5, // 0 = thin, 1 = thick (slider)
            limbColor: '#FFD700', // Can be different from body
            
            // Face Features
            eyeColor: '#8B4513',
            eyeSize: 0.5, // 0 = small, 1 = large (slider)
            eyeExpression: 'happy', // happy, sleepy, surprised, angry, cute
            mouthExpression: 'smile', // smile, open, neutral, tongue
            
            // Ears
            earType: 'pointed', // pointed, round, floppy, long
            earSize: 0.7, // 0 = tiny, 1 = huge (slider)
            earColor: '#FFD700',
            
            // Special Features
            tailType: 'lightning', // depends on creature type
            tailColor: '#FFD700',
            markingsType: 'cheeks', // cheeks, stripes, spots, none
            markingsColor: '#FF6B6B',
            accessories: null, // collar, bow, hat, etc.
            
            // Environment & Effects
            background: 'forest',
            aura: null,
            particles: null
        };
        
        this.currentAvatar = { ...this.defaultCreature };
        this.stylePoints = 100; // Starting style points
    }

    getCreatureCategories() {
        return [
            { id: 'creature-type', name: 'Creature', icon: '🐭' },
            { id: 'body', name: 'Body', icon: '🔍' },
            { id: 'limbs', name: 'Limbs', icon: '🦵' },
            { id: 'face', name: 'Face', icon: '👁️' },
            { id: 'ears', name: 'Ears', icon: '👂' },
            { id: 'features', name: 'Features', icon: '⭐' },
            { id: 'effects', name: 'Effects', icon: '✨' }
        ];
    }

    async loadAvatarBuilder() {
        try {
            console.log('Loading creature builder...');
            
            // Get current student from navigation manager
            this.currentStudent = window.navigationManager?.getCurrentStudent();
            
            if (!this.currentStudent) {
                console.error('No current student found');
                return;
            }
            
            // Initialize creature with default values and any saved creature data
            this.currentAvatar = {
                ...this.defaultCreature,
                ...(this.currentStudent.creature || {})
            };
            
            console.log('Creature data initialized:', this.currentAvatar);
            
            await this.renderCreatureBuilder();
            console.log('Creature builder rendered successfully');
            
        } catch (error) {
            console.error('Error loading creature builder:', error);
            // Show a user-friendly error message without infinite retry
            const container = document.querySelector('.avatar-builder-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: white;">
                        <h2>🐾 Creature Builder</h2>
                        <p>There was an issue loading the creature builder.</p>
                        <p style="font-size: 0.9rem; opacity: 0.8; margin: 1rem 0;">Error: ${error.message}</p>
                        <div style="margin-top: 2rem;">
                            <button onclick="location.reload()" style="padding: 1rem 2rem; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
                                🔄 Refresh Page
                            </button>
                            <button onclick="navigationManager.showPage('dashboard')" style="padding: 1rem 2rem; background: #28a745; color: white; border: none; border-radius: 10px; cursor: pointer;">
                                🏠 Back to Dashboard
                            </button>
                        </div>
                    </div>
                `;
            }
        }
    }

    generatePresetCreatures() {
        return [
            { 
                name: 'Lightning Mouse', 
                creatureType: 'mouse', bodySize: 0.4, bodyColor: '#FFD700', limbLength: 0.3, limbThickness: 0.4,
                eyeColor: '#8B4513', eyeSize: 0.6, eyeExpression: 'happy', earType: 'pointed', earSize: 0.8,
                tailType: 'lightning', markingsType: 'cheeks', markingsColor: '#FF6B6B', background: 'forest'
            },
            { 
                name: 'Fire Cat', 
                creatureType: 'cat', bodySize: 0.6, bodyColor: '#FF4500', limbLength: 0.5, limbThickness: 0.5,
                eyeColor: '#00CED1', eyeSize: 0.5, eyeExpression: 'sleepy', earType: 'pointed', earSize: 0.6,
                tailType: 'fluffy', markingsType: 'stripes', markingsColor: '#8B0000', background: 'volcano'
            },
            { 
                name: 'Water Dog', 
                creatureType: 'dog', bodySize: 0.7, bodyColor: '#1E90FF', limbLength: 0.6, limbThickness: 0.6,
                eyeColor: '#228B22', eyeSize: 0.4, eyeExpression: 'happy', earType: 'floppy', earSize: 0.9,
                tailType: 'wagging', markingsType: 'spots', markingsColor: '#00008B', background: 'ocean'
            },
            { 
                name: 'Earth Snake', 
                creatureType: 'snake', bodySize: 0.3, bodyColor: '#228B22', limbLength: 0.1, limbThickness: 0.8,
                eyeColor: '#FFD700', eyeSize: 0.3, eyeExpression: 'sleepy', earType: 'none', earSize: 0,
                tailType: 'long', markingsType: 'diamond', markingsColor: '#8B4513', background: 'forest'
            },
            { 
                name: 'Sky Dolphin', 
                creatureType: 'dolphin', bodySize: 0.8, bodyColor: '#87CEEB', limbLength: 0.4, limbThickness: 0.3,
                eyeColor: '#4169E1', eyeSize: 0.7, eyeExpression: 'cute', earType: 'none', earSize: 0,
                tailType: 'fin', markingsType: 'gradient', markingsColor: '#B0E0E6', background: 'sky'
            },
            { 
                name: 'Magic Unicorn', 
                creatureType: 'mouse', bodySize: 0.5, bodyColor: '#FFB6C1', limbLength: 0.6, limbThickness: 0.3,
                eyeColor: '#9370DB', eyeSize: 0.8, eyeExpression: 'cute', earType: 'pointed', earSize: 0.5,
                tailType: 'rainbow', markingsType: 'sparkles', markingsColor: '#FFD700', background: 'rainbow'
            }
        ];
    }

    async renderCreatureBuilder() {
        try {
            const container = document.querySelector('.avatar-builder-container');
            if (!container) {
                console.error('Creature builder container not found');
                return;
            }

            // Make sure container is visible
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';

            // Create simple avatar gallery instead of complex customization
            container.innerHTML = `
                <div class="avatar-builder-header">
                    <h2>🎨 Choose Your Avatar</h2>
                    <p>Select from our collection of friendly creatures!</p>
                </div>

                <div class="avatar-builder-content">
                    <div class="avatar-preview-section">
                        <div class="avatar-display" id="avatar-display">
                            ${this.renderCurrentAvatar()}
                        </div>
                        <div class="avatar-preview-info">
                            <h3 class="preview-name">${this.currentStudent.name}'s Avatar</h3>
                            <div class="preview-stats">
                                <div class="stat-row">
                                    <span>Level:</span>
                                    <span>${this.currentStudent.level}</span>
                                </div>
                                <div class="stat-row">
                                    <span>Kudos Points:</span>
                                    <span>${this.currentStudent.kudosPoints}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="avatar-gallery-grid">
                        ${this.renderAvatarGallery()}
                    </div>

                    <div class="avatar-actions">
                        <button class="save-creature-btn" onclick="avatarBuilderManager.saveSelectedAvatar()">
                            💾 Save Avatar
                        </button>
                        <button class="back-to-dashboard-btn" onclick="navigationManager.showPage('dashboard')">
                            🏠 Back to Dashboard
                        </button>
                    </div>
                </div>

                <style>
                .avatar-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 1rem;
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    margin: 1rem 0;
                }

                .avatar-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .avatar-option:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }

                .avatar-option.selected {
                    border-color: #4CAF50;
                    background: rgba(76, 175, 80, 0.2);
                }

                .avatar-emoji {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }

                .avatar-name {
                    font-size: 0.8rem;
                    text-align: center;
                    color: white;
                }

                .avatar-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 2rem;
                }

                .save-creature-btn, .back-to-dashboard-btn {
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .save-creature-btn {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                }

                .back-to-dashboard-btn {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .save-creature-btn:hover, .back-to-dashboard-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                </style>
            `;

            console.log('Avatar gallery rendered successfully');

        } catch (error) {
            console.error('Error rendering avatar gallery:', error);
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: white;">
                    <h2>🎨 Avatar Gallery</h2>
                    <p>There was an issue loading the avatar gallery.</p>
                    <button onclick="location.reload()" style="padding: 1rem 2rem; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
        }
    }

    renderCurrentAvatar() {
        // Render the current student's selected avatar
        const avatar = this.currentStudent.avatar || this.getDefaultAvatar();
        return `
            <div style="font-size: 4rem; padding: 2rem; background: linear-gradient(135deg, ${avatar.color || '#4CAF50'}, ${this.adjustColor(avatar.color || '#4CAF50', -20)}); border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 120px; height: 120px; margin: 0 auto;">
                ${avatar.emoji || '🤖'}
            </div>
        `;
    }

    renderAvatarGallery() {
        const avatars = this.getPresetAvatars();
        const currentAvatarId = this.currentStudent.avatar?.id || 'robot';
        
        return avatars.map(avatar => `
            <div class="avatar-option ${currentAvatarId === avatar.id ? 'selected' : ''}" 
                 onclick="avatarBuilderManager.selectAvatar('${avatar.id}')">
                <div class="avatar-emoji" style="background: linear-gradient(135deg, ${avatar.color}, ${this.adjustColor(avatar.color, -20)}); border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                    ${avatar.emoji}
                </div>
                <div class="avatar-name">${avatar.name}</div>
            </div>
        `).join('');
    }

    getPresetAvatars() {
        return [
            { id: 'robot', emoji: '🤖', color: '#4CAF50', name: 'Friendly Robot' },
            { id: 'cat', emoji: '🐱', color: '#FF9800', name: 'Happy Cat' },
            { id: 'dog', emoji: '🐶', color: '#8BC34A', name: 'Loyal Dog' },
            { id: 'panda', emoji: '🐼', color: '#9C27B0', name: 'Cute Panda' },
            { id: 'lion', emoji: '🦁', color: '#FF5722', name: 'Brave Lion' },
            { id: 'tiger', emoji: '🐯', color: '#FF6F00', name: 'Strong Tiger' },
            { id: 'elephant', emoji: '🐘', color: '#607D8B', name: 'Wise Elephant' },
            { id: 'monkey', emoji: '🐵', color: '#795548', name: 'Playful Monkey' },
            { id: 'rabbit', emoji: '🐰', color: '#E91E63', name: 'Swift Rabbit' },
            { id: 'bear', emoji: '🐻', color: '#3F51B5', name: 'Kind Bear' },
            { id: 'fox', emoji: '🦊', color: '#F44336', name: 'Clever Fox' },
            { id: 'penguin', emoji: '🐧', color: '#00BCD4', name: 'Cool Penguin' },
            { id: 'owl', emoji: '🦉', color: '#6D4C41', name: 'Smart Owl' },
            { id: 'dolphin', emoji: '🐬', color: '#2196F3', name: 'Ocean Dolphin' },
            { id: 'turtle', emoji: '🐢', color: '#4CAF50', name: 'Steady Turtle' },
            { id: 'bee', emoji: '🐝', color: '#FFC107', name: 'Busy Bee' },
            { id: 'butterfly', emoji: '🦋', color: '#9C27B0', name: 'Pretty Butterfly' },
            { id: 'dragon', emoji: '🐉', color: '#F44336', name: 'Fire Dragon' },
            { id: 'unicorn', emoji: '🦄', color: '#E91E63', name: 'Magic Unicorn' },
            { id: 'koala', emoji: '🐨', color: '#8BC34A', name: 'Sleepy Koala' },
            { id: 'pig', emoji: '🐷', color: '#E91E63', name: 'Happy Pig' },
            { id: 'cow', emoji: '🐮', color: '#795548', name: 'Moo Cow' },
            { id: 'horse', emoji: '🐴', color: '#6D4C41', name: 'Fast Horse' },
            { id: 'sheep', emoji: '🐑', color: '#FFF', name: 'Fluffy Sheep' },
            { id: 'chicken', emoji: '🐔', color: '#FF9800', name: 'Clucky Chicken' },
            { id: 'frog', emoji: '🐸', color: '#4CAF50', name: 'Jumping Frog' },
            { id: 'fish', emoji: '🐠', color: '#00BCD4', name: 'Colorful Fish' },
            { id: 'octopus', emoji: '🐙', color: '#9C27B0', name: 'Smart Octopus' },
            { id: 'whale', emoji: '🐳', color: '#2196F3', name: 'Big Whale' },
            { id: 'shark', emoji: '🦈', color: '#607D8B', name: 'Cool Shark' }
        ];
    }

    getDefaultAvatar() {
        return { id: 'robot', emoji: '🤖', color: '#4CAF50', name: 'Friendly Robot' };
    }

    adjustColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    selectAvatar(avatarId) {
        const avatars = this.getPresetAvatars();
        const selectedAvatar = avatars.find(a => a.id === avatarId);
        
        if (selectedAvatar) {
            this.currentStudent.avatar = selectedAvatar;
            
            // Update the UI
            document.querySelectorAll('.avatar-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            event.target.closest('.avatar-option').classList.add('selected');
            
            // Update the preview
            const display = document.getElementById('avatar-display');
            if (display) {
                display.innerHTML = this.renderCurrentAvatar();
            }
        }
    }

    async saveSelectedAvatar() {
        try {
            if (!this.currentStudent.avatar) {
                alert('Please select an avatar first!');
                return;
            }

            // Save to the database
            const updatedStudent = await DatabaseAPI.updateStudentAvatar(
                this.currentStudent.id,
                this.currentStudent.avatar
            );

            if (updatedStudent) {
                Utils.showToast('Avatar saved successfully!', 'success');
                // Update navigation manager with the new student data
                navigationManager.setCurrentStudent(updatedStudent);
                // Go back to dashboard using the proper function that refreshes data
                if (typeof showDashboard === 'function') {
                    showDashboard();
                } else {
                    navigationManager.showPage('dashboard');
                }
            } else {
                Utils.showToast('Failed to save avatar. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error saving avatar:', error);
            Utils.showToast('Error saving avatar. Please try again.', 'error');
        }
    }

    // Keep the rest of the original methods for compatibility

    renderCreature() {
        const creature = this.currentAvatar;
        
        // Base SVG dimensions and positioning
        const svgWidth = 300;
        const svgHeight = 400;
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        
        // Calculate body dimensions based on creature type and size
        const bodyWidth = 60 + (creature.bodySize * 40); // 60-100px width
        const bodyHeight = 80 + (creature.bodySize * 30); // 80-110px height
        
        // Generate creature based on type
        let creatureElements = '';
        
        switch(creature.creatureType) {
            case 'mouse':
                creatureElements = this.renderMouseCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'cat':
                creatureElements = this.renderCatCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'dog':
                creatureElements = this.renderDogCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'snake':
                creatureElements = this.renderSnakeCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'dolphin':
                creatureElements = this.renderDolphinCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            default:
                creatureElements = this.renderMouseCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
        }
        
        // Generate background
        const background = this.renderBackground(creature.background);
        
        return `
            <div class="creature-display" style="position: relative; width: ${svgWidth}px; height: ${svgHeight}px; margin: 0 auto;">
                ${background}
                <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="position: absolute; top: 0; left: 0; z-index: 2;">
                    ${creatureElements}
                </svg>
                ${this.renderEffects(creature)}
            </div>
        `;
    }

    renderMouseCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        const limbLength = 20 + (creature.limbLength * 25);
        const limbThickness = 8 + (creature.limbThickness * 8);
        const eyeSize = 8 + (creature.eyeSize * 12);
        const earSize = 15 + (creature.earSize * 20);
        
        return `
            <!-- Body -->
            <ellipse cx="${centerX}" cy="${centerY}" rx="${bodyWidth/2}" ry="${bodyHeight/2}" 
                     fill="${creature.bodyColor}" stroke="#000" stroke-width="2"/>
            
            <!-- Arms -->
            <ellipse cx="${centerX - bodyWidth/2 - limbLength/2}" cy="${centerY - 10}" 
                     rx="${limbLength/2}" ry="${limbThickness/2}" 
                     fill="${creature.limbColor || creature.bodyColor}" stroke="#000" stroke-width="1"/>
            <ellipse cx="${centerX + bodyWidth/2 + limbLength/2}" cy="${centerY - 10}" 
                     rx="${limbLength/2}" ry="${limbThickness/2}" 
                     fill="${creature.limbColor || creature.bodyColor}" stroke="#000" stroke-width="1"/>
            
            <!-- Legs -->
            <ellipse cx="${centerX - bodyWidth/4}" cy="${centerY + bodyHeight/2 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${creature.limbColor || creature.bodyColor}" stroke="#000" stroke-width="1"/>
            <ellipse cx="${centerX + bodyWidth/4}" cy="${centerY + bodyHeight/2 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${creature.limbColor || creature.bodyColor}" stroke="#000" stroke-width="1"/>
            
            <!-- Ears -->
            ${this.renderEars(centerX, centerY - bodyHeight/2 - 10, creature.earType, earSize, creature.earColor || creature.bodyColor)}
            
            <!-- Eyes -->
            <circle cx="${centerX - 15}" cy="${centerY - 15}" r="${eyeSize/2}" 
                    fill="white" stroke="#000" stroke-width="1"/>
            <circle cx="${centerX + 15}" cy="${centerY - 15}" r="${eyeSize/2}" 
                    fill="white" stroke="#000" stroke-width="1"/>
            <circle cx="${centerX - 15}" cy="${centerY - 15}" r="${eyeSize/3}" 
                    fill="${creature.eyeColor}"/>
            <circle cx="${centerX + 15}" cy="${centerY - 15}" r="${eyeSize/3}" 
                    fill="${creature.eyeColor}"/>
            
            <!-- Mouth -->
            ${this.renderMouth(centerX, centerY + 5, creature.mouthExpression)}
            
            <!-- Tail -->
            ${this.renderTail(centerX + bodyWidth/2, centerY, creature.tailType, creature.tailColor || creature.bodyColor)}
            
            <!-- Markings -->
            ${this.renderMarkings(centerX, centerY, bodyWidth, bodyHeight, creature.markingsType, creature.markingsColor)}
        `;
    }

    renderCatCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        // Similar to mouse but with cat-specific features
        return this.renderMouseCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
    }

    renderDogCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        // Similar to mouse but with dog-specific features
        return this.renderMouseCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
    }

    renderSnakeCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        // Long body, no limbs
        return `
            <!-- Snake Body -->
            <ellipse cx="${centerX}" cy="${centerY}" rx="${bodyWidth/4}" ry="${bodyHeight*1.5}" 
                     fill="${creature.bodyColor}" stroke="#000" stroke-width="2"/>
            
            <!-- Eyes -->
            <circle cx="${centerX - 8}" cy="${centerY - bodyHeight}" r="4" 
                    fill="white" stroke="#000" stroke-width="1"/>
            <circle cx="${centerX + 8}" cy="${centerY - bodyHeight}" r="4" 
                    fill="white" stroke="#000" stroke-width="1"/>
            <circle cx="${centerX - 8}" cy="${centerY - bodyHeight}" r="2" 
                    fill="${creature.eyeColor}"/>
            <circle cx="${centerX + 8}" cy="${centerY - bodyHeight}" r="2" 
                    fill="${creature.eyeColor}"/>
            
            <!-- Mouth -->
            ${this.renderMouth(centerX, centerY - bodyHeight + 15, creature.mouthExpression)}
            
            <!-- Markings -->
            ${this.renderMarkings(centerX, centerY, bodyWidth/4, bodyHeight*1.5, creature.markingsType, creature.markingsColor)}
        `;
    }

    renderDolphinCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        // Streamlined body
        return `
            <!-- Dolphin Body -->
            <ellipse cx="${centerX}" cy="${centerY}" rx="${bodyWidth/2}" ry="${bodyHeight/3}" 
                     fill="${creature.bodyColor}" stroke="#000" stroke-width="2"/>
            
            <!-- Fins -->
            <ellipse cx="${centerX - bodyWidth/3}" cy="${centerY + 10}" 
                     rx="15" ry="8" 
                     fill="${creature.limbColor || creature.bodyColor}" stroke="#000" stroke-width="1"/>
            <ellipse cx="${centerX + bodyWidth/3}" cy="${centerY + 10}" 
                     rx="15" ry="8" 
                     fill="${creature.limbColor || creature.bodyColor}" stroke="#000" stroke-width="1"/>
            
            <!-- Eyes -->
            <circle cx="${centerX - 10}" cy="${centerY - 5}" r="6" 
                    fill="white" stroke="#000" stroke-width="1"/>
            <circle cx="${centerX + 10}" cy="${centerY - 5}" r="6" 
                    fill="white" stroke="#000" stroke-width="1"/>
            <circle cx="${centerX - 10}" cy="${centerY - 5}" r="3" 
                    fill="${creature.eyeColor}"/>
            <circle cx="${centerX + 10}" cy="${centerY - 5}" r="3" 
                    fill="${creature.eyeColor}"/>
            
            <!-- Mouth -->
            ${this.renderMouth(centerX, centerY + 8, creature.mouthExpression)}
            
            <!-- Tail -->
            ${this.renderTail(centerX + bodyWidth/2, centerY, creature.tailType, creature.tailColor || creature.bodyColor)}
            
            <!-- Markings -->
            ${this.renderMarkings(centerX, centerY, bodyWidth, bodyHeight/3, creature.markingsType, creature.markingsColor)}
        `;
    }

    renderEars(x, y, earType, size, color) {
        switch(earType) {
            case 'pointed':
                return `
                    <polygon points="${x-size/2},${y} ${x-size/4},${y-size} ${x},${y-size/3}" 
                             fill="${color}" stroke="#000" stroke-width="1"/>
                    <polygon points="${x+size/2},${y} ${x+size/4},${y-size} ${x},${y-size/3}" 
                             fill="${color}" stroke="#000" stroke-width="1"/>
                `;
            case 'round':
                return `
                    <circle cx="${x-size/3}" cy="${y-size/2}" r="${size/3}" 
                            fill="${color}" stroke="#000" stroke-width="1"/>
                    <circle cx="${x+size/3}" cy="${y-size/2}" r="${size/3}" 
                            fill="${color}" stroke="#000" stroke-width="1"/>
                `;
            case 'floppy':
                return `
                    <ellipse cx="${x-size/3}" cy="${y+size/4}" rx="${size/4}" ry="${size/2}" 
                             fill="${color}" stroke="#000" stroke-width="1"/>
                    <ellipse cx="${x+size/3}" cy="${y+size/4}" rx="${size/4}" ry="${size/2}" 
                             fill="${color}" stroke="#000" stroke-width="1"/>
                `;
            case 'long':
                return `
                    <ellipse cx="${x-size/4}" cy="${y-size/2}" rx="${size/8}" ry="${size}" 
                             fill="${color}" stroke="#000" stroke-width="1"/>
                    <ellipse cx="${x+size/4}" cy="${y-size/2}" rx="${size/8}" ry="${size}" 
                             fill="${color}" stroke="#000" stroke-width="1"/>
                `;
            default:
                return '';
        }
    }

    renderMouth(x, y, expression) {
        switch(expression) {
            case 'smile':
                return `<path d="M ${x-10} ${y} Q ${x} ${y+8} ${x+10} ${y}" 
                              stroke="#000" stroke-width="2" fill="none"/>`;
            case 'open':
                return `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" 
                                fill="#FF69B4" stroke="#000" stroke-width="1"/>`;
            case 'tongue':
                return `
                    <path d="M ${x-8} ${y} Q ${x} ${y+6} ${x+8} ${y}" 
                          stroke="#000" stroke-width="2" fill="none"/>
                    <ellipse cx="${x}" cy="${y+3}" rx="4" ry="2" fill="#FF69B4"/>
                `;
            default:
                return `<line x1="${x-6}" y1="${y}" x2="${x+6}" y2="${y}" 
                              stroke="#000" stroke-width="2"/>`;
        }
    }

    renderTail(x, y, tailType, color) {
        switch(tailType) {
            case 'lightning':
                return `
                    <path d="M ${x} ${y} L ${x+15} ${y-20} L ${x+10} ${y-10} L ${x+20} ${y-30}" 
                          stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
                `;
            case 'fluffy':
                return `
                    <circle cx="${x+15}" cy="${y}" r="12" fill="${color}" stroke="#000" stroke-width="1"/>
                    <circle cx="${x+20}" cy="${y-8}" r="8" fill="${color}" stroke="#000" stroke-width="1"/>
                    <circle cx="${x+18}" cy="${y+8}" r="6" fill="${color}" stroke="#000" stroke-width="1"/>
                `;
            case 'long':
                return `
                    <path d="M ${x} ${y} Q ${x+30} ${y+20} ${x+40} ${y+5}" 
                          stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
                `;
            case 'wagging':
                return `
                    <path d="M ${x} ${y} Q ${x+20} ${y-15} ${x+25} ${y+5}" 
                          stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
                `;
            case 'fin':
                return `
                    <polygon points="${x},${y} ${x+20},${y-15} ${x+25},${y} ${x+20},${y+15}" 
                             fill="${color}" stroke="#000" stroke-width="1"/>
                `;
            default:
                return '';
        }
    }

    renderMarkings(x, y, bodyWidth, bodyHeight, markingsType, color) {
        switch(markingsType) {
            case 'cheeks':
                return `
                    <circle cx="${x-bodyWidth/3}" cy="${y-5}" r="8" fill="${color}"/>
                    <circle cx="${x+bodyWidth/3}" cy="${y-5}" r="8" fill="${color}"/>
                `;
            case 'stripes':
                return `
                    <rect x="${x-bodyWidth/3}" y="${y-bodyHeight/4}" width="${bodyWidth/1.5}" height="4" fill="${color}"/>
                    <rect x="${x-bodyWidth/3}" y="${y}" width="${bodyWidth/1.5}" height="4" fill="${color}"/>
                    <rect x="${x-bodyWidth/3}" y="${y+bodyHeight/4}" width="${bodyWidth/1.5}" height="4" fill="${color}"/>
                `;
            case 'spots':
                return `
                    <circle cx="${x-15}" cy="${y-10}" r="5" fill="${color}"/>
                    <circle cx="${x+10}" cy="${y-20}" r="4" fill="${color}"/>
                    <circle cx="${x-5}" cy="${y+15}" r="6" fill="${color}"/>
                    <circle cx="${x+20}" cy="${y+5}" r="3" fill="${color}"/>
                `;
            default:
                return '';
        }
    }

    renderBackground(backgroundType) {
        const backgrounds = {
            forest: 'linear-gradient(180deg, #87CEEB 0%, #228B22 100%)',
            ocean: 'linear-gradient(180deg, #87CEEB 0%, #1E90FF 100%)',
            volcano: 'linear-gradient(180deg, #FF4500 0%, #8B0000 100%)',
            sky: 'linear-gradient(180deg, #87CEEB 0%, #FFB6C1 100%)',
            rainbow: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)',
            default: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
        };
        
        const bg = backgrounds[backgroundType] || backgrounds.default;
        return `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${bg}; border-radius: 15px; z-index: 1;"></div>`;
    }

    renderEffects(creature) {
        let effects = '';
        
        if (creature.aura) {
            effects += `<div class="aura-effect ${creature.aura}" style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border-radius: 25px; z-index: 0;"></div>`;
        }
        
        if (creature.particles) {
            effects += `<div class="particle-effect ${creature.particles}" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 3; pointer-events: none;"></div>`;
        }
        
        return effects;
    }

    renderCategoryTabs() {
        return `
            <div class="category-tabs">
                ${this.creatureCategories.map(category => `
                    <button class="category-tab ${this.currentCategory === category.id ? 'active' : ''}" 
                            onclick="avatarBuilderManager.switchCategory('${category.id}', this)">
                        ${category.icon} ${category.name}
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderCustomizationPanel() {
        switch (this.currentCategory) {
            case 'creature-type': return this.renderCreatureTypeOptions();
            case 'body': return this.renderBodyOptions();
            case 'limbs': return this.renderLimbOptions(); 
            case 'face': return this.renderFaceOptions();
            case 'ears': return this.renderEarOptions();
            case 'features': return this.renderFeatureOptions();
            case 'effects': return this.renderEffectsOptions();
            default: return this.renderCreatureTypeOptions();
        }
    }

    renderCreatureTypeOptions() {
        return `
            <div class="customization-section">
                <h4 class="section-title">🐾 Choose Your Creature</h4>
                
                <div class="option-group">
                    <label>Creature Type:</label>
                    <div class="creature-type-grid">
                        ${[
                            { id: 'mouse', name: 'Mouse', icon: '🐭', desc: 'Small, quick, and electric!' },
                            { id: 'cat', name: 'Cat', icon: '🐱', desc: 'Graceful and mysterious' },
                            { id: 'dog', name: 'Dog', icon: '🐶', desc: 'Loyal and energetic' },
                            { id: 'snake', name: 'Snake', icon: '🐍', desc: 'Sleek and powerful' },
                            { id: 'dolphin', name: 'Dolphin', icon: '🐬', desc: 'Intelligent and aquatic' }
                        ].map(creature => `
                            <div class="creature-type-option ${this.currentAvatar.creatureType === creature.id ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('creatureType', '${creature.id}')">
                                <div class="creature-icon">${creature.icon}</div>
                                <div class="creature-name">${creature.name}</div>
                                <div class="creature-desc">${creature.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderBodyOptions() {
        return `
            <div class="customization-section">
                <h4 class="section-title">🔍 Body Customization</h4>
                
                <div class="option-group">
                    <label>Body Size (Skinny to Chubby):</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="1" step="0.1" value="${this.currentAvatar.bodySize}" 
                               onchange="avatarBuilderManager.updateAvatar('bodySize', parseFloat(this.value))"
                               class="creature-slider"/>
                        <div class="slider-labels">
                            <span>Skinny</span>
                            <span>Chubby</span>
                        </div>
                    </div>
                </div>

                <div class="option-group">
                    <label>Body Color:</label>
                    <div class="color-grid">
                        ${['#FFD700', '#FF4500', '#1E90FF', '#228B22', '#87CEEB', '#FFB6C1', '#DDA0DD', '#F0E68C', '#CD853F', '#FF69B4', '#00CED1', '#9370DB'].map(color => `
                            <div class="color-option ${this.currentAvatar.bodyColor === color ? 'active' : ''}" 
                                 style="background-color: ${color};"
                                 onclick="avatarBuilderManager.updateAvatar('bodyColor', '${color}')">
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Body Pattern:</label>
                    <div class="option-grid">
                        ${['solid', 'striped', 'spotted', 'gradient'].map(pattern => `
                            <div class="option-item ${this.currentAvatar.bodyPattern === pattern ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('bodyPattern', '${pattern}')">
                                ${pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderLimbOptions() {
        return `
            <div class="customization-section">
                <h4 class="section-title">🦵 Limb Customization</h4>
                
                <div class="option-group">
                    <label>Limb Length (Short to Long):</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="1" step="0.1" value="${this.currentAvatar.limbLength}" 
                               onchange="avatarBuilderManager.updateAvatar('limbLength', parseFloat(this.value))"
                               class="creature-slider"/>
                        <div class="slider-labels">
                            <span>Short</span>
                            <span>Long</span>
                        </div>
                    </div>
                </div>

                <div class="option-group">
                    <label>Limb Thickness (Thin to Thick):</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="1" step="0.1" value="${this.currentAvatar.limbThickness}" 
                               onchange="avatarBuilderManager.updateAvatar('limbThickness', parseFloat(this.value))"
                               class="creature-slider"/>
                        <div class="slider-labels">
                            <span>Thin</span>
                            <span>Thick</span>
                        </div>
                    </div>
                </div>

                <div class="option-group">
                    <label>Limb Color:</label>
                    <div class="color-grid">
                        ${['#FFD700', '#FF4500', '#1E90FF', '#228B22', '#87CEEB', '#FFB6C1', '#DDA0DD', '#F0E68C', '#CD853F', '#FF69B4', '#00CED1', '#9370DB'].map(color => `
                            <div class="color-option ${this.currentAvatar.limbColor === color ? 'active' : ''}" 
                                 style="background-color: ${color};"
                                 onclick="avatarBuilderManager.updateAvatar('limbColor', '${color}')">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderFaceOptions() {
        return `
            <div class="customization-section">
                <h4 class="section-title">👁️ Face Customization</h4>
                
                <div class="option-group">
                    <label>Eye Size (Small to Large):</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="1" step="0.1" value="${this.currentAvatar.eyeSize}" 
                               onchange="avatarBuilderManager.updateAvatar('eyeSize', parseFloat(this.value))"
                               class="creature-slider"/>
                        <div class="slider-labels">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>
                </div>

                <div class="option-group">
                    <label>Eye Color:</label>
                    <div class="color-grid">
                        ${['#8B4513', '#4A90E2', '#228B22', '#FF6B6B', '#9370DB', '#FFD700', '#FF4500', '#00CED1', '#F0E68C', '#DDA0DD'].map(color => `
                            <div class="color-option ${this.currentAvatar.eyeColor === color ? 'active' : ''}" 
                                 style="background-color: ${color};"
                                 onclick="avatarBuilderManager.updateAvatar('eyeColor', '${color}')">
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Eye Expression:</label>
                    <div class="option-grid">
                        ${['happy', 'sleepy', 'surprised', 'angry', 'cute'].map(expression => `
                            <div class="option-item ${this.currentAvatar.eyeExpression === expression ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('eyeExpression', '${expression}')">
                                ${expression.charAt(0).toUpperCase() + expression.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Mouth Expression:</label>
                    <div class="option-grid">
                        ${['smile', 'open', 'neutral', 'tongue'].map(mouth => `
                            <div class="option-item ${this.currentAvatar.mouthExpression === mouth ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('mouthExpression', '${mouth}')">
                                ${mouth.charAt(0).toUpperCase() + mouth.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderEarOptions() {
        return `
            <div class="customization-section">
                <h4 class="section-title">👂 Ear Customization</h4>
                
                <div class="option-group">
                    <label>Ear Type:</label>
                    <div class="option-grid">
                        ${['pointed', 'round', 'floppy', 'long', 'none'].map(type => `
                            <div class="option-item ${this.currentAvatar.earType === type ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('earType', '${type}')">
                                ${type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Ear Size (Tiny to Huge):</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="1" step="0.1" value="${this.currentAvatar.earSize}" 
                               onchange="avatarBuilderManager.updateAvatar('earSize', parseFloat(this.value))"
                               class="creature-slider"/>
                        <div class="slider-labels">
                            <span>Tiny</span>
                            <span>Huge</span>
                        </div>
                    </div>
                </div>

                <div class="option-group">
                    <label>Ear Color:</label>
                    <div class="color-grid">
                        ${['#FFD700', '#FF4500', '#1E90FF', '#228B22', '#87CEEB', '#FFB6C1', '#DDA0DD', '#F0E68C', '#CD853F', '#FF69B4', '#00CED1', '#9370DB'].map(color => `
                            <div class="color-option ${this.currentAvatar.earColor === color ? 'active' : ''}" 
                                 style="background-color: ${color};"
                                 onclick="avatarBuilderManager.updateAvatar('earColor', '${color}')">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderFeatureOptions() {
        return `
            <div class="customization-section">
                <h4 class="section-title">⭐ Special Features</h4>
                
                <div class="option-group">
                    <label>Tail Type:</label>
                    <div class="option-grid">
                        ${['lightning', 'fluffy', 'long', 'wagging', 'fin', 'none'].map(tail => `
                            <div class="option-item ${this.currentAvatar.tailType === tail ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('tailType', '${tail}')">
                                ${tail.charAt(0).toUpperCase() + tail.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Tail Color:</label>
                    <div class="color-grid">
                        ${['#FFD700', '#FF4500', '#1E90FF', '#228B22', '#87CEEB', '#FFB6C1', '#DDA0DD', '#F0E68C', '#CD853F', '#FF69B4', '#00CED1', '#9370DB'].map(color => `
                            <div class="color-option ${this.currentAvatar.tailColor === color ? 'active' : ''}" 
                                 style="background-color: ${color};"
                                 onclick="avatarBuilderManager.updateAvatar('tailColor', '${color}')">
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Markings Type:</label>
                    <div class="option-grid">
                        ${['cheeks', 'stripes', 'spots', 'diamond', 'gradient', 'sparkles', 'none'].map(marking => `
                            <div class="option-item ${this.currentAvatar.markingsType === marking ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('markingsType', '${marking}')">
                                ${marking.charAt(0).toUpperCase() + marking.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Markings Color:</label>
                    <div class="color-grid">
                        ${['#FF6B6B', '#8B0000', '#00008B', '#8B4513', '#B0E0E6', '#FFD700', '#FF69B4', '#9370DB', '#00CED1', '#32CD32'].map(color => `
                            <div class="color-option ${this.currentAvatar.markingsColor === color ? 'active' : ''}" 
                                 style="background-color: ${color};"
                                 onclick="avatarBuilderManager.updateAvatar('markingsColor', '${color}')">
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Accessories:</label>
                    <div class="option-grid">
                        ${['collar', 'bow', 'hat', 'bandana', 'crown', 'none'].map(accessory => `
                            <div class="option-item ${this.currentAvatar.accessories === accessory ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('accessories', '${accessory}')">
                                ${accessory.charAt(0).toUpperCase() + accessory.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderEffectsOptions() {
        return `
            <div class="customization-section">
                <h4 class="section-title">✨ Effects & Environment</h4>
                
                <div class="option-group">
                    <label>Background:</label>
                    <div class="option-grid">
                        ${['forest', 'ocean', 'volcano', 'sky', 'rainbow', 'default'].map(bg => `
                            <div class="option-item ${this.currentAvatar.background === bg ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('background', '${bg}')">
                                ${bg.charAt(0).toUpperCase() + bg.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Aura Effect:</label>
                    <div class="option-grid">
                        ${['none', 'spark', 'energy', 'magic'].map(aura => `
                            <div class="option-item ${this.currentAvatar.aura === aura ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('aura', '${aura}')">
                                ${aura === 'none' ? 'None' : aura.charAt(0).toUpperCase() + aura.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="option-group">
                    <label>Particle Effects:</label>
                    <div class="option-grid">
                        ${['none', 'sparkles', 'hearts', 'stars'].map(particles => `
                            <div class="option-item ${this.currentAvatar.particles === particles ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('particles', '${particles}')">
                                ${particles === 'none' ? 'None' : particles.charAt(0).toUpperCase() + particles.slice(1)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderPresetSection() {
        return `
            <div class="preset-section">
                <h4 class="option-title">🌟 Creature Presets</h4>
                <p style="text-align: center; color: #666; margin-bottom: 1rem;">Try these amazing creature combinations!</p>
                <div class="preset-grid">
                    ${this.presetCreatures.map((preset, index) => `
                        <div class="preset-avatar" 
                             onclick="avatarBuilderManager.applyPreset(${index})"
                             title="${preset.name}">
                            <div class="preset-preview">${this.getCreatureIcon(preset.creatureType)}</div>
                            <div class="preset-name">${preset.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderRandomizeSection() {
        return `
            <div class="randomize-section">
                <button class="randomize-btn" onclick="avatarBuilderManager.randomizeCreature()">
                    🎲 Surprise Me!
                </button>
                <button class="randomize-btn" onclick="avatarBuilderManager.resetToDefault()" style="background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);">
                    ↺ Reset
                </button>
            </div>
        `;
    }

    renderSaveSection() {
        return `
            <div class="save-section">
                <button class="save-btn" onclick="avatarBuilderManager.saveCreature()">
                    💾 Save My Creature
                </button>
            </div>
        `;
    }

    switchCategory(categoryId, clickedElement) {
        this.currentCategory = categoryId;
        
        // Update tab appearance
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        if (clickedElement) {
            clickedElement.classList.add('active');
        }
        
        // Re-render customization panel
        const customizationPanel = document.querySelector('.customization-options');
        if (customizationPanel) {
            const newPanel = this.renderCustomizationPanel();
            // Find and replace just the customization section
            const sections = customizationPanel.querySelectorAll('.customization-section');
            if (sections.length > 0) {
                sections[sections.length - 1].outerHTML = newPanel;
            }
        }
    }

    updateAvatar(property, value) {
        this.currentAvatar[property] = value;
        this.updateAvatarPreview();
        this.updateActiveStates();
        
        this.showFeedback(`${property.replace(/([A-Z])/g, ' $1').toLowerCase()} updated!`, 'success');
    }

    updateActiveStates() {
        // Remove all active classes first
        document.querySelectorAll('.option-item, .color-option, .creature-type-option').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class based on current values
        Object.entries(this.currentAvatar).forEach(([key, value]) => {
            const targetElements = document.querySelectorAll(`[onclick*="'${key}', '${value}'"]`);
            targetElements.forEach(el => el.classList.add('active'));
        });
    }

    updateAvatarPreview() {
        const display = document.getElementById('avatar-display');
        if (display) {
            display.innerHTML = this.renderCreature();
            
            // Add visual feedback animation
            display.style.transform = 'scale(1.05)';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
            }, 200);
        }
    }

    getCreatureIcon(creatureType) {
        const icons = {
            mouse: '🐭',
            cat: '🐱', 
            dog: '🐶',
            snake: '🐍',
            dolphin: '🐬'
        };
        return icons[creatureType] || '🐭';
    }

    calculateStylePoints() {
        let points = 0;
        if (this.currentAvatar.accessories && this.currentAvatar.accessories !== 'none') points += 10;
        if (this.currentAvatar.markingsType !== 'none') points += 15;
        if (this.currentAvatar.aura) points += 20;
        if (this.currentAvatar.particles) points += 15;
        return points;
    }

    showFeedback(message, type = 'info') {
        try {
            if (window.Utils && Utils.showToast) {
                Utils.showToast(message, type);
            } else {
                console.log(`Creature Builder: ${message}`);
            }
        } catch (error) {
            console.log(`Creature Builder: ${message}`);
        }
    }

    applyPreset(presetIndex) {
        const preset = this.presetCreatures[presetIndex];
        this.currentAvatar = { ...this.defaultCreature, ...preset };
        this.updateAvatarPreview();
        this.updateActiveStates();
        this.showFeedback(`Applied ${preset.name} preset!`, 'success');
    }

    randomizeCreature() {
        const creatureTypes = ['mouse', 'cat', 'dog', 'snake', 'dolphin'];
        const colors = ['#FFD700', '#FF4500', '#1E90FF', '#228B22', '#87CEEB', '#FFB6C1', '#DDA0DD', '#F0E68C'];
        const expressions = ['happy', 'sleepy', 'surprised', 'cute'];
        const earTypes = ['pointed', 'round', 'floppy', 'long'];
        const tailTypes = ['lightning', 'fluffy', 'long', 'wagging', 'fin'];
        const markingTypes = ['cheeks', 'stripes', 'spots', 'none'];
        
        this.currentAvatar = {
            ...this.currentAvatar,
            creatureType: creatureTypes[Math.floor(Math.random() * creatureTypes.length)],
            bodySize: Math.random(),
            bodyColor: colors[Math.floor(Math.random() * colors.length)],
            limbLength: Math.random(),
            limbThickness: Math.random(),
            eyeSize: Math.random(),
            eyeColor: colors[Math.floor(Math.random() * colors.length)],
            eyeExpression: expressions[Math.floor(Math.random() * expressions.length)],
            earType: earTypes[Math.floor(Math.random() * earTypes.length)],
            earSize: Math.random(),
            tailType: tailTypes[Math.floor(Math.random() * tailTypes.length)],
            markingsType: markingTypes[Math.floor(Math.random() * markingTypes.length)]
        };
        
        this.updateAvatarPreview();
        this.updateActiveStates();
        this.showFeedback('Randomized your creature!', 'success');
    }

    resetToDefault() {
        this.currentAvatar = { ...this.defaultCreature };
        this.updateAvatarPreview();
        this.updateActiveStates();
        this.showFeedback('Reset to default creature!', 'info');
    }

    saveCreature() {
        try {
            if (this.currentStudent) {
                this.currentStudent.creature = { ...this.currentAvatar };
                this.showFeedback('Creature saved successfully!', 'success');
            }
        } catch (error) {
            console.error('Error saving creature:', error);
            this.showFeedback('Error saving creature', 'error');
        }
    }
}

// Initialize the avatar builder when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.avatarBuilderManager = new AvatarBuilderManager();
    console.log('✅ Avatar Builder Manager initialized and attached to window');
});
