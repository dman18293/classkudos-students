// Creature Avatar Builder Manager for Student Portal - Full Creature Customization

class AvatarBuilderManager {
    constructor() {
        this.currentStudent = null;
        this.currentAvatar = {};
        this.presetCreatures = this.generatePresetCreatures();
        this.creatureCategories = this.getCreatureCategories();
        this.currentCategory = 'creature-type';
        this.robotAvatarAPI = 'https://api.dicebear.com/7.x/avataaars/svg'; // Professional robot avatars
        this.init();
    }

    init() {
        // Initialize creature builder with default values
        this.defaultCreature = {
            // Creature Base
            creatureType: 'robot', // robot (default), mouse, fire-cat, rock-pup, poison-snake, dolphin
            
            // Body Characteristics
            bodySize: 0.5, // 0 = small, 1 = large (slider)
            bodyColor: '#FFD700', // Primary body color
            bodyPattern: 'solid', // solid, striped, spotted, gradient
            
            // Limbs
            limbLength: 0.5, // 0 = short, 1 = long (slider)
            limbThickness: 0.5, // 0 = small, 1 = large (slider)
            limbColor: '#FFD700', // Can be different from body
            
            // Face Features
            eyeColor: '#8B4513',
            eyeSize: 0.5, // 0 = small, 1 = large (slider)
            eyeExpression: 'normal', // normal, happy, surprised, sleepy
            mouthExpression: 'smile', // smile, open, neutral, tongue
            
            // Ears
            earType: 'pointed', // pointed, round, floppy, none
            earSize: 0.7, // 0 = tiny, 1 = huge (slider)
            earColor: '#FFD700',
            
            // Special Features
            tailLength: 0.7, // 0 = short, 1 = long (slider)
            tailThickness: 0.5, // 0 = small, 1 = large (slider)
            tailColor: '#FFD700',
            accessories: 'none', // collar, bow, hat, glasses, etc.
            accessoryColor: '#FF4500',
            
            // Environment & Effects
            background: 'forest',
            aura: 'none',
            particles: 'none'
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
            
            // Debug: Check navigation manager availability
            console.log('Navigation manager available:', !!window.navigationManager);
            console.log('Navigation manager type:', typeof window.navigationManager);
            
            // Get current student from navigation manager
            this.currentStudent = window.navigationManager?.getCurrentStudent();
            console.log('Current student from avatar builder:', this.currentStudent);
            
            if (!this.currentStudent) {
                console.log('No current student found, checking for demo mode or redirecting to login...');
                
                // Check if we're in demo mode (for testing)
                if (window.location.hash.includes('demo') || localStorage.getItem('demoMode') === 'true') {
                    // Create a demo student for testing
                    this.currentStudent = {
                        id: 999,
                        name: "Demo Student",
                        kudosPoints: 0,
                        level: 1,
                        xp: 0,
                        creature: null // Will use default creature
                    };
                    console.log('Using demo student for testing');
                } else {
                    // Redirect to login page
                    console.log('Redirecting to login...');
                    window.navigationManager?.showPage('login');
                    Utils.showToast('Please log in to access the Creature Builder', 'info');
                    return;
                }
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
                creatureType: 'fire-cat', bodySize: 0.6, bodyColor: '#3B3F54', limbLength: 0.5, limbThickness: 0.5,
                eyeColor: '#FFD54F', eyeSize: 0.6, eyeExpression: 'normal', earType: 'pointed', earSize: 0.8,
                tailLength: 1.2, tailThickness: 1.0, bodyPattern: 'solid', accessories: 'none', background: 'volcano'
            },
            { 
                name: 'Rock Pup', 
                creatureType: 'rock-pup', bodySize: 0.6, bodyColor: '#D4A574', limbLength: 0.5, limbThickness: 0.6,
                eyeColor: '#4169E1', eyeSize: 0.7, eyeExpression: 'normal', earType: 'pointed', earSize: 0.8,
                tailLength: 1.0, tailThickness: 1.2, bodyPattern: 'solid', accessories: 'none', background: 'forest'
            },
            { 
                name: 'Purple Snake', 
                creatureType: 'poison-snake', bodySize: 0.4, bodyColor: '#8B77C7', limbLength: 0.1, limbThickness: 0.7,
                eyeColor: '#FFD700', eyeSize: 0.5, eyeExpression: 'normal', earType: 'none', earSize: 0,
                tailLength: 1.0, tailThickness: 1.0, bodyPattern: 'solid', accessories: 'none', background: 'volcano'
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

            container.innerHTML = `
                <div class="avatar-builder-header">
                    <h2>🐾 Create Your Perfect Study Buddy</h2>
                    <p>Choose your professional robot avatar or customize your own creature companion!</p>
                </div>

                <div class="avatar-builder-content">
                    <div class="avatar-preview-section">
                        <div class="avatar-display" id="avatar-display">
                            ${this.renderCreature()}
                        </div>
                        
                        <!-- Robot Preview Area -->
                        <div id="robot-preview" class="robot-preview-area" style="display: ${this.currentAvatar.creatureType === 'robot' ? 'block' : 'none'}; text-align: center; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 15px; margin-top: 20px;">
                            <h4 style="color: #667eea; margin-bottom: 15px;">🤖 Your Professional Robot Avatar</h4>
                            <div style="color: #888; font-size: 14px;">Loading professional avatar...</div>
                        </div>
                        
                        <div class="avatar-preview-info">
                            <h3 class="preview-name">${this.currentStudent.name}'s Study Buddy</h3>
                            <div class="preview-stats">
                                <div class="stat-row">
                                    <span>Level:</span>
                                    <span>${this.currentStudent.level}</span>
                                </div>
                                <div class="stat-row">
                                    <span>Kudos Points:</span>
                                    <span>${this.currentStudent.kudosPoints}</span>
                                </div>
                                <div class="stat-row">
                                    <span>Style Points:</span>
                                    <span>${this.calculateStylePoints()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="customization-options">
                        ${this.renderCategoryTabs()}
                        ${this.renderRandomizeSection()}
                        ${this.renderCustomizationPanel()}
                        ${this.renderSaveSection()}
                    </div>
                </div>
            `;

            this.updateAvatarPreview();
            
            // Force a repaint
            container.offsetHeight;
            
            console.log('Creature builder container visibility:', {
                display: container.style.display,
                visibility: container.style.visibility,
                opacity: container.style.opacity,
                offsetHeight: container.offsetHeight,
                scrollHeight: container.scrollHeight
            });
            
        } catch (error) {
            console.error('Error rendering creature builder:', error);
            const container = document.querySelector('.avatar-builder-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: white; background: #667eea; min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
                        <h2>🐾 Creature Builder</h2>
                        <p>Loading your amazing creature customization tools...</p>
                        <div style="margin-top: 2rem;">
                            <button onclick="location.reload()" style="padding: 1rem 2rem; background: #28a745; color: white; border: none; border-radius: 10px; cursor: pointer;">
                                🔄 Refresh Page
                            </button>
                        </div>
                    </div>
                `;
            }
        }
    }

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
            case 'robot':
                creatureElements = this.renderRobotAvatar(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'mouse':
                creatureElements = this.renderMouseCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'fire-cat':
                creatureElements = this.renderFireCatCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'rock-pup':
                creatureElements = this.renderRockPupCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'poison-snake':
                creatureElements = this.renderPoisonSnakeCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            case 'dolphin':
                creatureElements = this.renderDolphinCreature(centerX, centerY, bodyWidth, bodyHeight, creature);
                break;
            default:
                creatureElements = this.renderRobotAvatar(centerX, centerY, bodyWidth, bodyHeight, creature);
        }
        
        // Generate background
        const background = this.renderBackground(creature.background);
        
        return `
            <div class="creature-display" style="position: relative; width: ${svgWidth}px; height: ${svgHeight}px; margin: 0 auto;">
                ${background}
                <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="position: absolute; top: 0; left: 0; z-index: 2;">
                    ${this.renderSVGEffects(creature, svgWidth, svgHeight)}
                    ${creatureElements}
                </svg>
            </div>
        `;
    }

    // Professional Robot Avatar - integrates with the Class Kudos avatar system
    renderRobotAvatar(centerX, centerY, bodyWidth, bodyHeight, creature) {
        // Generate a unique robot avatar using the professional system
        const studentName = window.currentStudentName || 'Student';
        const seed = creature.robotSeed || studentName + '-' + Math.floor(Math.random() * 1000);
        
        // Build professional avatar URL with customization
        const params = new URLSearchParams({
            seed: seed,
            backgroundColor: 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
            radius: '20',
            clothingGraphic: 'resist,selfish,bear',
            clothingColor: '262e33,65c9ff,f88c49,96ceb4,ffeaa7',
            accessories: 'round,prescription01,prescription02',
            accessoriesColor: '262e33,65c9ff',
            hair: 'bob,caesar,curly,dreads,longButNotTooLong,miaBun,straight02,straightAndStrand',
            hairColor: '2c1b18,724133,b58143,a55728,d6b370,4a312c',
            facialHair: 'blank,mustacheEnglish,goatee',
            facialHairColor: '2c1b18,724133,b58143',
            skin: 'tanned,yellow,pale,light,brown,darkBrown,black',
            mouth: 'default,smile,twinkle',
            eyes: 'default,happy,squint,surprised',
            eyebrow: 'default,flatNatural,raisedExcited'
        });
        
        const avatarUrl = `${this.robotAvatarAPI}?${params.toString()}`;
        
        // Store the URL for display outside SVG
        this.currentRobotUrl = avatarUrl;
        
        return `
            <!-- Robot Avatar Placeholder Circle -->
            <circle cx="${centerX}" cy="${centerY}" r="${bodyWidth/2.2}" 
                    fill="url(#robotGradient)" stroke="#667eea" stroke-width="3"/>
            
            <!-- Robot gradient definition -->
            <defs>
                <radialGradient id="robotGradient" cx="0.3" cy="0.3" r="0.7">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#f0f0f0" />
                </radialGradient>
            </defs>
            
            <!-- Robot icon placeholder -->
            <text x="${centerX}" y="${centerY + 8}" text-anchor="middle" 
                  font-size="48" fill="#667eea">🤖</text>
            
            <!-- Professional enhancement ring -->
            <circle cx="${centerX}" cy="${centerY}" r="${bodyWidth/2.1}" fill="none" 
                    stroke="rgba(102, 126, 234, 0.3)" stroke-width="2" stroke-dasharray="5,5">
                <animateTransform attributeName="transform" type="rotate" 
                                values="0 ${centerX} ${centerY};360 ${centerX} ${centerY}" 
                                dur="10s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Avatar URL display -->
            <text x="${centerX}" y="${centerY + bodyHeight/2 + 40}" text-anchor="middle" 
                  font-size="10" fill="#667eea">Professional Avatar Active</text>
        `;
    }

    generateNewRobot() {
        // Generate a new robot with random seed
        const newSeed = 'robot-' + Math.floor(Math.random() * 100000);
        this.currentAvatar.robotSeed = newSeed;
        this.updateAvatarPreview();
        
        // Show the actual robot avatar in a modal or separate display
        this.showRobotPreview();
    }

    showRobotPreview() {
        if (this.currentRobotUrl) {
            // Create a preview modal or update a preview area
            const previewArea = document.getElementById('robot-preview');
            if (previewArea) {
                previewArea.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h4>Your Professional Robot Avatar</h4>
                        <img src="${this.currentRobotUrl}" 
                             style="width: 150px; height: 150px; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.2);" 
                             alt="Professional Robot Avatar"/>
                        <p style="margin-top: 15px; color: #667eea;">This is your professional avatar that teachers see!</p>
                        <button onclick="avatarBuilderManager.generateNewRobot()" 
                                style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 10px;">
                            Generate New Robot
                        </button>
                    </div>
                `;
            }
        }
    }

    renderMouseCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        const limbLength = 20 + (creature.limbLength * 25);
        const limbThickness = 8 + (creature.limbThickness * 8);
        const eyeSize = 8 + (creature.eyeSize * 12);
        const earSize = 15 + (creature.earSize * 20);
        
        // Enhanced Pikachu-inspired proportions
        const bodyMainColor = creature.bodyColor || '#FFDE00'; // Pikachu yellow
        const bodyShadeColor = this.darkenColor(bodyMainColor, 0.15);
        const earTipColor = '#2B1810'; // Dark brown/black ear tips
        const cheekColor = '#FF6B6B'; // Red cheek pouches
        const eyeColor = creature.eyeColor || '#2B1810';
        
        return `
            <!-- Body with gradient and shading -->
            <defs>
                <radialGradient id="bodyGradient" cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stop-color="${bodyMainColor}" />
                    <stop offset="100%" stop-color="${bodyShadeColor}" />
                </radialGradient>
                <radialGradient id="cheekGradient" cx="0.3" cy="0.3" r="0.7">
                    <stop offset="0%" stop-color="${cheekColor}" />
                    <stop offset="100%" stop-color="${this.darkenColor(cheekColor, 0.2)}" />
                </radialGradient>
            </defs>
            
            <!-- Main body (rounder, more Pikachu-like) -->
            <ellipse cx="${centerX}" cy="${centerY + 5}" rx="${bodyWidth/2.2}" ry="${bodyHeight/2.1}" 
                     fill="url(#bodyGradient)" stroke="#2B1810" stroke-width="2"/>
            
            <!-- Head (slightly larger and rounder) -->
            <circle cx="${centerX}" cy="${centerY - bodyHeight/3}" r="${bodyWidth/2.5}" 
                    fill="url(#bodyGradient)" stroke="#2B1810" stroke-width="2"/>
            
            <!-- Enhanced Pikachu ears with customization -->
            ${this.renderPikachuEars(centerX, centerY - bodyHeight/2 - 15, creature.earType, earSize, creature.earColor || bodyMainColor, earTipColor)}
            
            <!-- Enhanced eyes with expression-based shapes -->
            ${this.renderPikachuEyes(centerX, centerY - bodyHeight/3 - 8, eyeSize, creature.eyeExpression, eyeColor)}
            
            <!-- Iconic red cheek pouches -->
            <circle cx="${centerX - 22}" cy="${centerY - bodyHeight/3 + 2}" r="8" 
                    fill="url(#cheekGradient)" opacity="0.8"/>
            <circle cx="${centerX + 22}" cy="${centerY - bodyHeight/3 + 2}" r="8" 
                    fill="url(#cheekGradient)" opacity="0.8"/>
            
            <!-- Small triangular nose -->
            <polygon points="${centerX},${centerY - bodyHeight/3 + 5} ${centerX - 2},${centerY - bodyHeight/3 + 8} ${centerX + 2},${centerY - bodyHeight/3 + 8}" 
                     fill="#2B1810"/>
            
            <!-- Mouth with expression -->
            ${this.renderPikachuMouth(centerX, centerY - bodyHeight/3 + 12, creature.mouthExpression)}
            
            <!-- Arms/front paws (more detailed) -->
            <ellipse cx="${centerX - bodyWidth/2.5}" cy="${centerY + 5}" 
                     rx="${limbThickness/1.5}" ry="${limbLength/1.8}" 
                     fill="${creature.limbColor || bodyMainColor}" stroke="#2B1810" stroke-width="1.5"/>
            <ellipse cx="${centerX + bodyWidth/2.5}" cy="${centerY + 5}" 
                     rx="${limbThickness/1.5}" ry="${limbLength/1.8}" 
                     fill="${creature.limbColor || bodyMainColor}" stroke="#2B1810" stroke-width="1.5"/>
            
            <!-- Paw details -->
            <circle cx="${centerX - bodyWidth/2.5}" cy="${centerY + 15}" r="4" 
                    fill="${creature.limbColor ? this.darkenColor(creature.limbColor, 0.15) : bodyShadeColor}" stroke="#2B1810" stroke-width="1"/>
            <circle cx="${centerX + bodyWidth/2.5}" cy="${centerY + 15}" r="4" 
                    fill="${creature.limbColor ? this.darkenColor(creature.limbColor, 0.15) : bodyShadeColor}" stroke="#2B1810" stroke-width="1"/>
            
            <!-- Legs/back paws -->
            <ellipse cx="${centerX - bodyWidth/4}" cy="${centerY + bodyHeight/2 + 15}" 
                     rx="${limbThickness/1.2}" ry="${limbLength/1.5}" 
                     fill="${creature.limbColor || bodyMainColor}" stroke="#2B1810" stroke-width="1.5"/>
            <ellipse cx="${centerX + bodyWidth/4}" cy="${centerY + bodyHeight/2 + 15}" 
                     rx="${limbThickness/1.2}" ry="${limbLength/1.5}" 
                     fill="${creature.limbColor || bodyMainColor}" stroke="#2B1810" stroke-width="1.5"/>
            
            <!-- Back paw details -->
            <ellipse cx="${centerX - bodyWidth/4}" cy="${centerY + bodyHeight/2 + 25}" 
                     rx="6" ry="4" 
                     fill="${creature.limbColor ? this.darkenColor(creature.limbColor, 0.15) : bodyShadeColor}" stroke="#2B1810" stroke-width="1"/>
            <ellipse cx="${centerX + bodyWidth/4}" cy="${centerY + bodyHeight/2 + 25}" 
                     rx="6" ry="4" 
                     fill="${creature.limbColor ? this.darkenColor(creature.limbColor, 0.15) : bodyShadeColor}" stroke="#2B1810" stroke-width="1"/>
            
            <!-- Body patterns (content-aware) -->
            ${this.renderPikachuBodyPattern(centerX, centerY, bodyWidth, bodyHeight, creature.bodyPattern, creature.bodyPatternColor)}
            
            <!-- Dynamic tail based on sliders -->
            ${this.renderSliderTail(centerX + bodyWidth/2.2, centerY - 10, creature.tailLength, creature.tailThickness, creature.tailColor || bodyMainColor)}
            
            <!-- Accessories -->
            ${creature.accessories !== 'none' ? this.renderAccessories(centerX, centerY, bodyWidth, bodyHeight, creature.accessories, creature.accessoryColor) : ''}
        `;
    }

    renderFireCatCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        const limbLength = 20 + (creature.limbLength * 25);
        const limbThickness = 8 + (creature.limbThickness * 8);
        const eyeSize = 8 + (creature.eyeSize * 12);
        const earSize = 15 + (creature.earSize * 20);
        
        // Fire cat specific colors
        const bodyMainColor = '#3B3F54'; // Dark navy blue body
        const faceColor = '#E85A4F'; // Red/orange face
        const stripeColor = '#E85A4F'; // Red stripes on legs
        const bellyColor = '#D7CCC8'; // Light belly
        const eyeColor = creature.eyeColor || '#FFD54F'; // Golden yellow eyes
        
        const bodyX = centerX;
        const bodyY = centerY + 5;
        const headY = centerY - bodyHeight/3;
        
        return `
            <!-- Fire Cat Body (navy blue) -->
            <ellipse cx="${bodyX}" cy="${bodyY}" rx="${bodyWidth/2.2}" ry="${bodyHeight/2.2}" 
                     fill="${bodyMainColor}" stroke="#2B1810" stroke-width="2"/>
            
            <!-- Fire Cat Head/Face (red/orange) -->
            <circle cx="${centerX}" cy="${headY}" r="${bodyWidth/2.5}" 
                    fill="${faceColor}" stroke="#2B1810" stroke-width="2"/>
            
            <!-- Belly (light color) -->
            <ellipse cx="${bodyX}" cy="${bodyY + 8}" rx="${bodyWidth/3.5}" ry="${bodyHeight/4}" 
                     fill="${bellyColor}" stroke="none"/>
            
            <!-- Front legs with stripes -->
            <ellipse cx="${centerX - bodyWidth/3}" cy="${bodyY + bodyHeight/2.5 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#2B1810" stroke-width="2"/>
            <ellipse cx="${centerX + bodyWidth/3}" cy="${bodyY + bodyHeight/2.5 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#2B1810" stroke-width="2"/>
            
            <!-- Leg stripes (red) -->
            <rect x="${centerX - bodyWidth/3 - limbThickness/4}" y="${bodyY + bodyHeight/2.5 + limbLength/4}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            <rect x="${centerX - bodyWidth/3 - limbThickness/4}" y="${bodyY + bodyHeight/2.5 + limbLength/2}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            <rect x="${centerX + bodyWidth/3 - limbThickness/4}" y="${bodyY + bodyHeight/2.5 + limbLength/4}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            <rect x="${centerX + bodyWidth/3 - limbThickness/4}" y="${bodyY + bodyHeight/2.5 + limbLength/2}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            
            <!-- Back legs with stripes -->
            <ellipse cx="${centerX - bodyWidth/4}" cy="${bodyY + bodyHeight/2.2 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#2B1810" stroke-width="2"/>
            <ellipse cx="${centerX + bodyWidth/4}" cy="${bodyY + bodyHeight/2.2 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#2B1810" stroke-width="2"/>
            
            <!-- Back leg stripes -->
            <rect x="${centerX - bodyWidth/4 - limbThickness/4}" y="${bodyY + bodyHeight/2.2 + limbLength/4}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            <rect x="${centerX - bodyWidth/4 - limbThickness/4}" y="${bodyY + bodyHeight/2.2 + limbLength/2}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            <rect x="${centerX + bodyWidth/4 - limbThickness/4}" y="${bodyY + bodyHeight/2.2 + limbLength/4}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            <rect x="${centerX + bodyWidth/4 - limbThickness/4}" y="${bodyY + bodyHeight/2.2 + limbLength/2}" 
                  width="${limbThickness/2}" height="3" fill="${stripeColor}"/>
            
            <!-- Fire cat eyes (golden) -->
            ${this.renderFireCatEyes(centerX, headY - 8, eyeSize, creature.eyeExpression, eyeColor)}
            
            <!-- Fire cat nose -->
            <ellipse cx="${centerX}" cy="${headY + 5}" rx="2" ry="1.5" fill="#2B1810"/>
            
            <!-- Fire cat mouth -->
            <path d="M ${centerX} ${headY + 8} Q ${centerX - 5} ${headY + 12} ${centerX - 8} ${headY + 10}" 
                  stroke="#2B1810" stroke-width="2" fill="none"/>
            <path d="M ${centerX} ${headY + 8} Q ${centerX + 5} ${headY + 12} ${centerX + 8} ${headY + 10}" 
                  stroke="#2B1810" stroke-width="2" fill="none"/>
            
            <!-- Fire cat curved tail -->
            ${this.renderFireCatTail(centerX, centerY, creature.tailLength, creature.tailThickness, bodyMainColor)}
            
            <!-- Body patterns if any -->
            ${this.renderPikachuBodyPattern(centerX, centerY, bodyWidth, bodyHeight, creature.bodyPattern, creature.bodyPatternColor)}
            
            <!-- Accessories -->
            ${this.renderAccessories(centerX, centerY - bodyHeight/3, bodyWidth, bodyHeight, creature.accessories, creature.accessoryColor)}
            
            <!-- Pointed cat ears on head (render last so they appear on top) -->
            ${this.renderFireCatEars(centerX, headY, earSize, creature.earType, bodyMainColor)}
        `;
    }

    renderRockPupCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        const limbLength = 20 + (creature.limbLength * 25);
        const limbThickness = 8 + (creature.limbThickness * 8);
        const eyeSize = 8 + (creature.eyeSize * 12);
        const earSize = 15 + (creature.earSize * 20);
        
        // Rock pup specific colors based on the image
        const bodyMainColor = '#D4A574'; // Light brown/tan body
        const chestColor = '#F5F5DC'; // White/cream chest ruff
        const noseColor = '#8B4513'; // Brown nose
        const eyeColor = creature.eyeColor || '#4169E1'; // Blue eyes
        
        const bodyX = centerX;
        const bodyY = centerY + 5;
        const headY = centerY - bodyHeight/3;
        
        return `
            <!-- Rock pup ears (render first) -->
            ${this.renderRockPupEars(centerX, headY, earSize, creature.earType, bodyMainColor)}
            
            <!-- Rock Pup Body (tan/brown) -->
            <ellipse cx="${bodyX}" cy="${bodyY}" rx="${bodyWidth/2.2}" ry="${bodyHeight/2.2}" 
                     fill="${bodyMainColor}" stroke="#8B4513" stroke-width="2"/>
            
            <!-- Rock Pup Head -->
            <circle cx="${centerX}" cy="${headY}" r="${bodyWidth/2.5}" 
                    fill="${bodyMainColor}" stroke="#8B4513" stroke-width="2"/>
            
            <!-- White chest ruff -->
            <ellipse cx="${bodyX}" cy="${bodyY - 5}" rx="${bodyWidth/3}" ry="${bodyHeight/3.5}" 
                     fill="${chestColor}" stroke="#8B4513" stroke-width="1"/>
            
            <!-- Front legs -->
            <ellipse cx="${centerX - bodyWidth/3}" cy="${bodyY + bodyHeight/2.5 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#8B4513" stroke-width="2"/>
            <ellipse cx="${centerX + bodyWidth/3}" cy="${bodyY + bodyHeight/2.5 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#8B4513" stroke-width="2"/>
            
            <!-- Back legs -->
            <ellipse cx="${centerX - bodyWidth/4}" cy="${bodyY + bodyHeight/2.2 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#8B4513" stroke-width="2"/>
            <ellipse cx="${centerX + bodyWidth/4}" cy="${bodyY + bodyHeight/2.2 + limbLength/2}" 
                     rx="${limbThickness/2}" ry="${limbLength/2}" 
                     fill="${bodyMainColor}" stroke="#8B4513" stroke-width="2"/>
            
            <!-- Rock pup eyes (blue) -->
            ${this.renderRockPupEyes(centerX, headY - 8, eyeSize, creature.eyeExpression, eyeColor)}
            
            <!-- Rock pup nose -->
            <ellipse cx="${centerX}" cy="${headY + 5}" rx="3" ry="2" fill="${noseColor}"/>
            
            <!-- Rock pup mouth -->
            <path d="M ${centerX} ${headY + 8} Q ${centerX - 6} ${headY + 12} ${centerX - 8} ${headY + 10}" 
                  stroke="#8B4513" stroke-width="2" fill="none"/>
            <path d="M ${centerX} ${headY + 8} Q ${centerX + 6} ${headY + 12} ${centerX + 8} ${headY + 10}" 
                  stroke="#8B4513" stroke-width="2" fill="none"/>
            
            <!-- Rock pup fluffy tail -->
            ${this.renderRockPupTail(centerX, centerY, creature.tailLength, creature.tailThickness, chestColor)}
            
            <!-- Body patterns if any -->
            ${this.renderPikachuBodyPattern(centerX, centerY, bodyWidth, bodyHeight, creature.bodyPattern, creature.bodyPatternColor)}
            
            <!-- Accessories -->
            ${this.renderAccessories(centerX, centerY - bodyHeight/3, bodyWidth, bodyHeight, creature.accessories, creature.accessoryColor)}
        `;
    }

    renderPoisonSnakeCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        const eyeSize = 8 + (creature.eyeSize * 12);
        
        // Poison snake specific colors based on Ekans
        const bodyMainColor = '#8B77C7'; // Purple body
        const bellyColor = '#E6D7FF'; // Light purple/pink belly
        const collarColor = '#FFD700'; // Golden yellow collar
        const eyeColor = creature.eyeColor || '#FFD700'; // Golden yellow eyes
        
        const segmentHeight = bodyHeight * 0.3;
        const numSegments = 4;
        
        return `
            <!-- Poison snake segmented body -->
            ${this.renderPoisonSnakeSegments(centerX, centerY, bodyWidth, bodyHeight, bodyMainColor, bellyColor)}
            
            <!-- Golden collar around neck -->
            <ellipse cx="${centerX}" cy="${centerY - bodyHeight + 20}" rx="${bodyWidth/3}" ry="8" 
                     fill="${collarColor}" stroke="#B8860B" stroke-width="2"/>
            
            <!-- Snake head -->
            <ellipse cx="${centerX}" cy="${centerY - bodyHeight}" rx="${bodyWidth/3.5}" ry="${bodyWidth/3}" 
                     fill="${bodyMainColor}" stroke="#6B5B95" stroke-width="2"/>
            
            <!-- Poison snake eyes (golden) -->
            ${this.renderPoisonSnakeEyes(centerX, centerY - bodyHeight, eyeSize, creature.eyeExpression, eyeColor)}
            
            <!-- Snake mouth/tongue -->
            <ellipse cx="${centerX}" cy="${centerY - bodyHeight + 15}" rx="3" ry="2" fill="#2B1810"/>
            <path d="M ${centerX} ${centerY - bodyHeight + 17} Q ${centerX - 2} ${centerY - bodyHeight + 22} ${centerX - 4} ${centerY - bodyHeight + 20}" 
                  stroke="#FF1493" stroke-width="2" fill="none"/>
            <path d="M ${centerX} ${centerY - bodyHeight + 17} Q ${centerX + 2} ${centerY - bodyHeight + 22} ${centerX + 4} ${centerY - bodyHeight + 20}" 
                  stroke="#FF1493" stroke-width="2" fill="none"/>
            
            <!-- Rattle tail -->
            ${this.renderPoisonSnakeTail(centerX, centerY, bodyHeight, creature.tailLength, creature.tailThickness, collarColor)}
            
            <!-- Body patterns if any -->
            ${this.renderPikachuBodyPattern(centerX, centerY, bodyWidth, bodyHeight, creature.bodyPattern, creature.bodyPatternColor)}
            
            <!-- Accessories -->
            ${this.renderAccessories(centerX, centerY - bodyHeight + 10, bodyWidth, bodyHeight, creature.accessories, creature.accessoryColor)}
        `;
    }

    renderDolphinCreature(centerX, centerY, bodyWidth, bodyHeight, creature) {
        const limbLength = 20 + (creature.limbLength * 25);
        const limbThickness = 8 + (creature.limbThickness * 8);
        const eyeSize = 8 + (creature.eyeSize * 12);
        
        // Dolphin specific colors
        const bodyMainColor = creature.bodyColor || '#87CEEB'; // Sky blue
        const bellyColor = '#F0F8FF'; // Alice blue (lighter)
        const eyeColor = creature.eyeColor || '#4169E1'; // Royal blue
        const finColor = creature.limbColor || bodyMainColor;
        
        return `
            <!-- Dolphin Body (streamlined) -->
            <ellipse cx="${centerX}" cy="${centerY}" rx="${bodyWidth/2}" ry="${bodyHeight/3}" 
                     fill="${bodyMainColor}" stroke="#4682B4" stroke-width="2"/>
            
            <!-- Belly -->
            <ellipse cx="${centerX}" cy="${centerY + 5}" rx="${bodyWidth/3}" ry="${bodyHeight/4}" 
                     fill="${bellyColor}" stroke="none"/>
            
            <!-- Dorsal fin -->
            <path d="M ${centerX} ${centerY - bodyHeight/3} Q ${centerX + 15} ${centerY - bodyHeight/2} ${centerX + 10} ${centerY - bodyHeight/4}" 
                  fill="${finColor}" stroke="#4682B4" stroke-width="1.5"/>
            
            <!-- Side fins -->
            <ellipse cx="${centerX - bodyWidth/3}" cy="${centerY + 10}" 
                     rx="${limbThickness}" ry="${limbLength/2}" 
                     fill="${finColor}" stroke="#4682B4" stroke-width="1"/>
            <ellipse cx="${centerX + bodyWidth/3}" cy="${centerY + 10}" 
                     rx="${limbThickness}" ry="${limbLength/2}" 
                     fill="${finColor}" stroke="#4682B4" stroke-width="1"/>
            
            <!-- Tail fluke -->
            <path d="M ${centerX + bodyWidth/2} ${centerY} Q ${centerX + bodyWidth/2 + 20} ${centerY - 15} ${centerX + bodyWidth/2 + 25} ${centerY} Q ${centerX + bodyWidth/2 + 20} ${centerY + 15} ${centerX + bodyWidth/2} ${centerY}" 
                  fill="${finColor}" stroke="#4682B4" stroke-width="1.5"/>
            
            <!-- Eyes -->
            <circle cx="${centerX - 15}" cy="${centerY - 8}" r="${eyeSize/2}" 
                    fill="white" stroke="#4682B4" stroke-width="1"/>
            <circle cx="${centerX + 15}" cy="${centerY - 8}" r="${eyeSize/2}" 
                    fill="white" stroke="#4682B4" stroke-width="1"/>
            <circle cx="${centerX - 15}" cy="${centerY - 8}" r="${eyeSize/3}" 
                    fill="${eyeColor}"/>
            <circle cx="${centerX + 15}" cy="${centerY - 8}" r="${eyeSize/3}" 
                    fill="${eyeColor}"/>
            
            <!-- Friendly smile -->
            <path d="M ${centerX - 20} ${centerY + 8} Q ${centerX} ${centerY + 15} ${centerX + 20} ${centerY + 8}" 
                  stroke="#4682B4" stroke-width="2" fill="none"/>
            
            <!-- Rostrum (beak-like snout) -->
            <ellipse cx="${centerX - 25}" cy="${centerY}" rx="8" ry="5" 
                     fill="${bodyMainColor}" stroke="#4682B4" stroke-width="1.5"/>
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
                // Use the enhanced Pikachu tail
                return this.renderPikachuTail(x, y, color);
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
            case 'none':
                return '';
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

    // Enhanced Pikachu-specific rendering functions
    renderPikachuMouth(x, y, expression) {
        switch(expression) {
            case 'smile':
                return `
                    <path d="M ${x-6} ${y} Q ${x} ${y+4} ${x+6} ${y}" 
                          stroke="#2B1810" stroke-width="2" fill="none" stroke-linecap="round"/>
                `;
            case 'open':
                return `
                    <ellipse cx="${x}" cy="${y+2}" rx="3" ry="5" 
                             fill="#2B1810"/>
                `;
            case 'neutral':
                return `
                    <line x1="${x-4}" y1="${y}" x2="${x+4}" y2="${y}" 
                          stroke="#2B1810" stroke-width="2" stroke-linecap="round"/>
                `;
            case 'tongue':
                return `
                    <path d="M ${x-8} ${y} Q ${x} ${y+6} ${x+8} ${y}" 
                          stroke="#2B1810" stroke-width="2" fill="none" stroke-linecap="round"/>
                    <ellipse cx="${x}" cy="${y+3}" rx="4" ry="2" fill="#FF69B4"/>
                `;
            default:
                return `
                    <path d="M ${x-4} ${y} Q ${x} ${y+2} ${x+4} ${y}" 
                          stroke="#2B1810" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                `;
        }
    }

    renderPikachuEyes(centerX, centerY, eyeSize, expression, eyeColor) {
        const leftX = centerX - 12;
        const rightX = centerX + 12;
        
        switch(expression) {
            case 'happy':
                return `
                    <!-- Happy curved eyes -->
                    <path d="M ${leftX - eyeSize * 0.8} ${centerY} Q ${leftX} ${centerY - eyeSize * 0.5} ${leftX + eyeSize * 0.8} ${centerY}" 
                          fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <path d="M ${rightX - eyeSize * 0.8} ${centerY} Q ${rightX} ${centerY - eyeSize * 0.5} ${rightX + eyeSize * 0.8} ${centerY}" 
                          fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <!-- Small pupils for happy -->
                    <circle cx="${leftX}" cy="${centerY - eyeSize * 0.2}" r="${eyeSize * 0.3}" fill="${eyeColor}"/>
                    <circle cx="${rightX}" cy="${centerY - eyeSize * 0.2}" r="${eyeSize * 0.3}" fill="${eyeColor}"/>
                    <!-- Highlights -->
                    <circle cx="${leftX + 2}" cy="${centerY - eyeSize * 0.3}" r="${eyeSize * 0.15}" fill="white"/>
                    <circle cx="${rightX + 2}" cy="${centerY - eyeSize * 0.3}" r="${eyeSize * 0.15}" fill="white"/>
                `;
            case 'surprised':
                return `
                    <!-- Large round surprised eyes -->
                    <circle cx="${leftX}" cy="${centerY}" r="${eyeSize * 1.2}" fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <circle cx="${rightX}" cy="${centerY}" r="${eyeSize * 1.2}" fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <!-- Large pupils -->
                    <circle cx="${leftX}" cy="${centerY}" r="${eyeSize * 0.8}" fill="${eyeColor}"/>
                    <circle cx="${rightX}" cy="${centerY}" r="${eyeSize * 0.8}" fill="${eyeColor}"/>
                    <!-- Multiple highlights for shine -->
                    <circle cx="${leftX - 3}" cy="${centerY - 3}" r="${eyeSize * 0.3}" fill="white"/>
                    <circle cx="${rightX - 3}" cy="${centerY - 3}" r="${eyeSize * 0.3}" fill="white"/>
                    <circle cx="${leftX + 2}" cy="${centerY + 2}" r="${eyeSize * 0.1}" fill="white"/>
                    <circle cx="${rightX + 2}" cy="${centerY + 2}" r="${eyeSize * 0.1}" fill="white"/>
                `;
            case 'sleepy':
                return `
                    <!-- Half-closed sleepy eyes -->
                    <ellipse cx="${leftX}" cy="${centerY + eyeSize * 0.3}" rx="${eyeSize * 0.8}" ry="${eyeSize * 0.4}" 
                             fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <ellipse cx="${rightX}" cy="${centerY + eyeSize * 0.3}" rx="${eyeSize * 0.8}" ry="${eyeSize * 0.4}" 
                             fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <!-- Small sleepy pupils -->
                    <ellipse cx="${leftX}" cy="${centerY + eyeSize * 0.3}" rx="${eyeSize * 0.4}" ry="${eyeSize * 0.2}" fill="${eyeColor}"/>
                    <ellipse cx="${rightX}" cy="${centerY + eyeSize * 0.3}" rx="${eyeSize * 0.4}" ry="${eyeSize * 0.2}" fill="${eyeColor}"/>
                    <!-- Droopy eyelids -->
                    <path d="M ${leftX - eyeSize * 0.8} ${centerY - eyeSize * 0.2} Q ${leftX} ${centerY + eyeSize * 0.1} ${leftX + eyeSize * 0.8} ${centerY - eyeSize * 0.2}" 
                          stroke="#2B1810" stroke-width="2" fill="none"/>
                    <path d="M ${rightX - eyeSize * 0.8} ${centerY - eyeSize * 0.2} Q ${rightX} ${centerY + eyeSize * 0.1} ${rightX + eyeSize * 0.8} ${centerY - eyeSize * 0.2}" 
                          stroke="#2B1810" stroke-width="2" fill="none"/>
                `;
            default: // normal
                return `
                    <!-- Normal oval eyes -->
                    <ellipse cx="${leftX}" cy="${centerY}" rx="${eyeSize * 0.8}" ry="${eyeSize}" 
                            fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <ellipse cx="${rightX}" cy="${centerY}" rx="${eyeSize * 0.8}" ry="${eyeSize}" 
                            fill="white" stroke="#2B1810" stroke-width="1.5"/>
                    <!-- Normal pupils -->
                    <circle cx="${leftX}" cy="${centerY + 3}" r="${eyeSize * 0.6}" fill="${eyeColor}"/>
                    <circle cx="${rightX}" cy="${centerY + 3}" r="${eyeSize * 0.6}" fill="${eyeColor}"/>
                    <!-- Standard highlights -->
                    <circle cx="${leftX + 3}" cy="${centerY}" r="${eyeSize * 0.25}" fill="white" opacity="0.9"/>
                    <circle cx="${rightX + 3}" cy="${centerY}" r="${eyeSize * 0.25}" fill="white" opacity="0.9"/>
                    <circle cx="${leftX - 2}" cy="${centerY + 5}" r="${eyeSize * 0.1}" fill="white" opacity="0.7"/>
                    <circle cx="${rightX - 2}" cy="${centerY + 5}" r="${eyeSize * 0.1}" fill="white" opacity="0.7"/>
                `;
        }
    }

    renderPikachuEars(x, y, earType, earSize, earColor, tipColor) {
        // Return empty string for 'none' option
        if (earType === 'none') {
            return '';
        }
        
        const scaledSize = earSize * 0.8; // Scale down the ear size appropriately
        
        switch(earType) {
            case 'pointed':
                return `
                    <!-- Left pointed ear -->
                    <polygon points="${x - scaledSize},${y} ${x - scaledSize - 10},${y - scaledSize * 2} ${x - scaledSize + 10},${y - scaledSize * 1.7}" 
                             fill="${earColor}" stroke="#2B1810" stroke-width="2"/>
                    <!-- Right pointed ear -->
                    <polygon points="${x + scaledSize},${y} ${x + scaledSize + 10},${y - scaledSize * 2} ${x + scaledSize - 10},${y - scaledSize * 1.7}" 
                             fill="${earColor}" stroke="#2B1810" stroke-width="2"/>
                    <!-- Ear tips -->
                    <polygon points="${x - scaledSize - 5},${y - scaledSize * 1.7} ${x - scaledSize - 10},${y - scaledSize * 2} ${x - scaledSize},${y - scaledSize * 1.8}" 
                             fill="${tipColor}"/>
                    <polygon points="${x + scaledSize + 5},${y - scaledSize * 1.7} ${x + scaledSize + 10},${y - scaledSize * 2} ${x + scaledSize},${y - scaledSize * 1.8}" 
                             fill="${tipColor}"/>
                `;
            case 'round':
                return `
                    <!-- Left round ear -->
                    <circle cx="${x - scaledSize}" cy="${y - scaledSize}" r="${scaledSize * 0.8}" 
                            fill="${earColor}" stroke="#2B1810" stroke-width="2"/>
                    <!-- Right round ear -->
                    <circle cx="${x + scaledSize}" cy="${y - scaledSize}" r="${scaledSize * 0.8}" 
                            fill="${earColor}" stroke="#2B1810" stroke-width="2"/>
                    <!-- Inner ear -->
                    <circle cx="${x - scaledSize}" cy="${y - scaledSize}" r="${scaledSize * 0.4}" 
                            fill="${tipColor}" opacity="0.6"/>
                    <circle cx="${x + scaledSize}" cy="${y - scaledSize}" r="${scaledSize * 0.4}" 
                            fill="${tipColor}" opacity="0.6"/>
                `;
            case 'floppy':
                return `
                    <!-- Left floppy ear -->
                    <ellipse cx="${x - scaledSize}" cy="${y - scaledSize * 0.5}" rx="${scaledSize * 0.6}" ry="${scaledSize * 1.2}" 
                             fill="${earColor}" stroke="#2B1810" stroke-width="2" transform="rotate(-20 ${x - scaledSize} ${y - scaledSize * 0.5})"/>
                    <!-- Right floppy ear -->
                    <ellipse cx="${x + scaledSize}" cy="${y - scaledSize * 0.5}" rx="${scaledSize * 0.6}" ry="${scaledSize * 1.2}" 
                             fill="${earColor}" stroke="#2B1810" stroke-width="2" transform="rotate(20 ${x + scaledSize} ${y - scaledSize * 0.5})"/>
                `;
            default: // Default to pointed (Pikachu style)
                return `
                    <!-- Left pointed ear -->
                    <polygon points="${x - scaledSize},${y} ${x - scaledSize - 10},${y - scaledSize * 2} ${x - scaledSize + 10},${y - scaledSize * 1.7}" 
                             fill="${earColor}" stroke="#2B1810" stroke-width="2"/>
                    <!-- Right pointed ear -->
                    <polygon points="${x + scaledSize},${y} ${x + scaledSize + 10},${y - scaledSize * 2} ${x + scaledSize - 10},${y - scaledSize * 1.7}" 
                             fill="${earColor}" stroke="#2B1810" stroke-width="2"/>
                    <!-- Ear tips -->
                    <polygon points="${x - scaledSize - 5},${y - scaledSize * 1.7} ${x - scaledSize - 10},${y - scaledSize * 2} ${x - scaledSize},${y - scaledSize * 1.8}" 
                             fill="${tipColor}"/>
                    <polygon points="${x + scaledSize + 5},${y - scaledSize * 1.7} ${x + scaledSize + 10},${y - scaledSize * 2} ${x + scaledSize},${y - scaledSize * 1.8}" 
                             fill="${tipColor}"/>
                `;
        }
    }

    renderSliderTail(x, y, length, thickness, color) {
        const tailLength = 20 + (length * 50); // 20-70 length range
        const tailThickness = 4 + (thickness * 12); // 4-16 thickness range
        
        // Always render lightning bolt style but with variable size
        const shadeColor = this.darkenColor(color, 0.2);
        
        return `
            <!-- Variable-size lightning bolt tail -->
            <defs>
                <linearGradient id="tailGradient${x}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${color}" />
                    <stop offset="100%" stop-color="${shadeColor}" />
                </linearGradient>
            </defs>
            
            <!-- First segment -->
            <polygon points="${x},${y} ${x + tailLength * 0.3},${y - tailLength * 0.4} ${x + tailLength * 0.2},${y - tailLength * 0.2} ${x + tailLength * 0.4},${y - tailLength * 0.5}" 
                     fill="url(#tailGradient${x})" stroke="#2B1810" stroke-width="${Math.max(1, tailThickness/8)}"/>
            
            <!-- Second segment -->
            <polygon points="${x + tailLength * 0.4},${y - tailLength * 0.5} ${x + tailLength * 0.65},${y - tailLength * 0.8} ${x + tailLength * 0.55},${y - tailLength * 0.65} ${x + tailLength * 0.75},${y - tailLength * 0.9}" 
                     fill="url(#tailGradient${x})" stroke="#2B1810" stroke-width="${Math.max(1, tailThickness/8)}"/>
            
            <!-- Third segment (tip) -->
            <polygon points="${x + tailLength * 0.75},${y - tailLength * 0.9} ${x + tailLength * 0.85},${y - tailLength} ${x + tailLength * 0.8},${y - tailLength * 0.95} ${x + tailLength * 0.95},${y - tailLength * 1.1}" 
                     fill="url(#tailGradient${x})" stroke="#2B1810" stroke-width="${Math.max(1, tailThickness/8)}"/>
        `;
    }

    renderAccessories(x, y, bodyWidth, bodyHeight, accessoryType, accessoryColor) {
        const color = accessoryColor || '#FF4500';
        
        switch(accessoryType) {
            case 'collar':
                return `
                    <!-- Collar around neck area -->
                    <ellipse cx="${x}" cy="${y + bodyHeight/4}" rx="${bodyWidth/2.2}" ry="6" 
                             fill="${color}" stroke="#2B1810" stroke-width="2"/>
                    <!-- Collar buckle -->
                    <rect x="${x - 4}" y="${y + bodyHeight/4 - 3}" width="8" height="6" 
                          fill="#C0C0C0" stroke="#2B1810" stroke-width="1"/>
                `;
            case 'bow':
                return `
                    <!-- Bow tie -->
                    <polygon points="${x - 12},${y - bodyHeight/3 + 25} ${x - 8},${y - bodyHeight/3 + 20} ${x - 8},${y - bodyHeight/3 + 30} ${x - 12},${y - bodyHeight/3 + 25}" 
                             fill="${color}" stroke="#2B1810" stroke-width="1"/>
                    <polygon points="${x + 12},${y - bodyHeight/3 + 25} ${x + 8},${y - bodyHeight/3 + 20} ${x + 8},${y - bodyHeight/3 + 30} ${x + 12},${y - bodyHeight/3 + 25}" 
                             fill="${color}" stroke="#2B1810" stroke-width="1"/>
                    <rect x="${x - 4}" y="${y - bodyHeight/3 + 20}" width="8" height="10" 
                          fill="${this.darkenColor(color, 0.2)}" stroke="#2B1810" stroke-width="1"/>
                `;
            case 'hat':
                return `
                    <!-- Hat on head -->
                    <ellipse cx="${x}" cy="${y - bodyHeight/2 - 20}" rx="${bodyWidth/3}" ry="12" 
                             fill="${color}" stroke="#2B1810" stroke-width="2"/>
                    <circle cx="${x}" cy="${y - bodyHeight/2 - 35}" r="15" 
                            fill="${color}" stroke="#2B1810" stroke-width="2"/>
                `;
            case 'glasses':
                return `
                    <!-- Glasses -->
                    <circle cx="${x - 12}" cy="${y - bodyHeight/3 - 8}" r="8" 
                            fill="none" stroke="#2B1810" stroke-width="2"/>
                    <circle cx="${x + 12}" cy="${y - bodyHeight/3 - 8}" r="8" 
                            fill="none" stroke="#2B1810" stroke-width="2"/>
                    <line x1="${x - 4}" y1="${y - bodyHeight/3 - 8}" x2="${x + 4}" y2="${y - bodyHeight/3 - 8}" 
                          stroke="#2B1810" stroke-width="2"/>
                `;
            case 'cape':
                return `
                    <!-- Cape behind creature -->
                    <ellipse cx="${x - bodyWidth/3}" cy="${y + 10}" rx="8" ry="25" 
                             fill="${color}" stroke="#2B1810" stroke-width="1" opacity="0.8"/>
                    <ellipse cx="${x + bodyWidth/3}" cy="${y + 10}" rx="8" ry="25" 
                             fill="${color}" stroke="#2B1810" stroke-width="1" opacity="0.8"/>
                `;
            default:
                return '';
        }
    }

    renderSliderTail(x, y, tailLength, tailThickness, color) {
        const mainColor = color || '#FFDE00';
        const shadeColor = this.darkenColor(mainColor, 0.2);
        
        // Scale segments based on length and thickness
        const lengthScale = tailLength || 1.0;
        const thicknessScale = tailThickness || 1.0;
        
        // Calculate segment dimensions with proper thickness scaling
        const baseWidth = 4 * thicknessScale; // Base width of lightning segments
        const segmentLength = 15 * lengthScale;
        const segmentOffset = 8 * lengthScale;
        
        return `
            <!-- Lightning bolt tail with variable size and thickness -->
            <defs>
                <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${mainColor}" />
                    <stop offset="100%" stop-color="${shadeColor}" />
                </linearGradient>
            </defs>
            
            <!-- First segment - thick lightning bolt -->
            <polygon points="${x-baseWidth/2},${y} ${x+12+baseWidth/2},${y-segmentLength} ${x+8+baseWidth/2},${y-segmentOffset} ${x+15+baseWidth/2},${y-segmentLength-5} ${x+15-baseWidth/2},${y-segmentLength-5} ${x+8-baseWidth/2},${y-segmentOffset} ${x+12-baseWidth/2},${y-segmentLength} ${x+baseWidth/2},${y}" 
                     fill="url(#tailGradient)" stroke="#2B1810" stroke-width="1"/>
            
            <!-- Second segment - thick lightning bolt -->
            <polygon points="${x+15-baseWidth/2},${y-segmentLength-5} ${x+25+baseWidth/2},${y-segmentLength*2-10} ${x+20+baseWidth/2},${y-segmentLength-15} ${x+30+baseWidth/2},${y-segmentLength*2-20} ${x+30-baseWidth/2},${y-segmentLength*2-20} ${x+20-baseWidth/2},${y-segmentLength-15} ${x+25-baseWidth/2},${y-segmentLength*2-10} ${x+15+baseWidth/2},${y-segmentLength-5}" 
                     fill="url(#tailGradient)" stroke="#2B1810" stroke-width="1"/>
            
            <!-- Third segment (tip) - thick lightning bolt -->
            <polygon points="${x+30-baseWidth/3},${y-segmentLength*2-20} ${x+35+baseWidth/3},${y-segmentLength*3-15} ${x+32+baseWidth/3},${y-segmentLength*2-30} ${x+38},${y-segmentLength*3-25} ${x+32-baseWidth/3},${y-segmentLength*2-30} ${x+35-baseWidth/3},${y-segmentLength*3-15} ${x+30+baseWidth/3},${y-segmentLength*2-20}" 
                     fill="url(#tailGradient)" stroke="#2B1810" stroke-width="1"/>
        `;
    }

    renderFireCatEars(x, y, earSize, earType, earColor) {
        if (earType === 'none') return '';
        
        const earScale = earSize || 15;
        const mainColor = earColor || '#3B3F54';
        
        // Triangular ears positioned much higher above the eyes
        return `
            <!-- Left pointed ear -->
            <polygon points="${x - 25},${y - 35} ${x - 15},${y - 55} ${x - 5},${y - 35}" 
                     fill="${mainColor}" stroke="#2B1810" stroke-width="2"/>
            <!-- Right pointed ear -->
            <polygon points="${x + 5},${y - 35} ${x + 15},${y - 55} ${x + 25},${y - 35}" 
                     fill="${mainColor}" stroke="#2B1810" stroke-width="2"/>
            <!-- Inner ear details -->
            <polygon points="${x - 22},${y - 37} ${x - 15},${y - 50} ${x - 8},${y - 37}" 
                     fill="#E85A4F" stroke="none"/>
            <polygon points="${x + 8},${y - 37} ${x + 15},${y - 50} ${x + 22},${y - 37}" 
                     fill="#E85A4F" stroke="none"/>
        `;
    }

    renderFireCatEyes(x, y, eyeSize, expression, eyeColor) {
        const size = eyeSize || 8;
        const color = eyeColor || '#FFD54F';
        
        switch(expression) {
            case 'happy':
                return `
                    <!-- Happy curved eyes -->
                    <path d="M ${x - 12} ${y - 2} Q ${x - 8} ${y + 2} ${x - 4} ${y - 2}" 
                          stroke="#2B1810" stroke-width="3" fill="none"/>
                    <path d="M ${x + 4} ${y - 2} Q ${x + 8} ${y + 2} ${x + 12} ${y - 2}" 
                          stroke="#2B1810" stroke-width="3" fill="none"/>
                `;
            case 'surprised':
                return `
                    <!-- Large surprised eyes -->
                    <circle cx="${x - 8}" cy="${y}" r="${size + 2}" fill="${color}" stroke="#2B1810" stroke-width="2"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size + 2}" fill="${color}" stroke="#2B1810" stroke-width="2"/>
                    <circle cx="${x - 8}" cy="${y}" r="${size/2}" fill="#2B1810"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size/2}" fill="#2B1810"/>
                `;
            case 'sleepy':
                return `
                    <!-- Sleepy half-closed eyes -->
                    <path d="M ${x - 12} ${y - 2} Q ${x - 8} ${y + 1} ${x - 4} ${y - 2}" 
                          stroke="#2B1810" stroke-width="3" fill="${color}"/>
                    <path d="M ${x + 4} ${y - 2} Q ${x + 8} ${y + 1} ${x + 12} ${y - 2}" 
                          stroke="#2B1810" stroke-width="3" fill="${color}"/>
                `;
            default: // normal
                return `
                    <!-- Normal alert eyes -->
                    <circle cx="${x - 8}" cy="${y}" r="${size}" fill="${color}" stroke="#2B1810" stroke-width="2"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size}" fill="${color}" stroke="#2B1810" stroke-width="2"/>
                    <circle cx="${x - 8}" cy="${y}" r="${size/2.5}" fill="#2B1810"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size/2.5}" fill="#2B1810"/>
                    <!-- Eye shine -->
                    <circle cx="${x - 6}" cy="${y - 2}" r="2" fill="white" opacity="0.8"/>
                    <circle cx="${x + 10}" cy="${y - 2}" r="2" fill="white" opacity="0.8"/>
                `;
        }
    }

    renderFireCatTail(x, y, tailLength, tailThickness, color) {
        const mainColor = color || '#3B3F54';
        const lengthScale = tailLength || 1.0;
        const thicknessScale = tailThickness || 1.0;
        const baseWidth = 8 * thicknessScale;
        
        // Curved cat tail - different from lightning bolt
        return `
            <!-- Fire cat curved tail -->
            <defs>
                <linearGradient id="catTailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${mainColor}" />
                    <stop offset="100%" stop-color="${this.darkenColor(mainColor, 0.2)}" />
                </linearGradient>
            </defs>
            
            <!-- Curved tail path -->
            <path d="M ${x + 40} ${y + 10} Q ${x + 60 * lengthScale} ${y - 20 * lengthScale} ${x + 45 * lengthScale} ${y - 40 * lengthScale}" 
                  stroke="url(#catTailGradient)" stroke-width="${baseWidth}" 
                  fill="none" stroke-linecap="round"/>
            
            <!-- Tail tip -->
            <circle cx="${x + 45 * lengthScale}" cy="${y - 40 * lengthScale}" r="${baseWidth/2}" 
                    fill="${mainColor}" stroke="#2B1810" stroke-width="1"/>
        `;
    }

    renderRockPupEars(x, y, earSize, earType, earColor) {
        if (earType === 'none') return '';
        
        const earScale = earSize || 15;
        const mainColor = earColor || '#D4A574';
        
        // Pointed upright dog ears
        return `
            <!-- Left pointed ear -->
            <polygon points="${x - 20},${y - 25} ${x - 12},${y - 45} ${x - 5},${y - 25}" 
                     fill="${mainColor}" stroke="#8B4513" stroke-width="2"/>
            <!-- Right pointed ear -->
            <polygon points="${x + 5},${y - 25} ${x + 12},${y - 45} ${x + 20},${y - 25}" 
                     fill="${mainColor}" stroke="#8B4513" stroke-width="2"/>
            <!-- Inner ear details -->
            <polygon points="${x - 18},${y - 27} ${x - 12},${y - 40} ${x - 7},${y - 27}" 
                     fill="#F5E6D3" stroke="none"/>
            <polygon points="${x + 7},${y - 27} ${x + 12},${y - 40} ${x + 18},${y - 27}" 
                     fill="#F5E6D3" stroke="none"/>
        `;
    }

    renderRockPupEyes(x, y, eyeSize, expression, eyeColor) {
        const size = eyeSize || 8;
        const color = eyeColor || '#4169E1';
        
        switch(expression) {
            case 'happy':
                return `
                    <!-- Happy curved eyes -->
                    <path d="M ${x - 12} ${y - 2} Q ${x - 8} ${y + 2} ${x - 4} ${y - 2}" 
                          stroke="#8B4513" stroke-width="3" fill="none"/>
                    <path d="M ${x + 4} ${y - 2} Q ${x + 8} ${y + 2} ${x + 12} ${y - 2}" 
                          stroke="#8B4513" stroke-width="3" fill="none"/>
                `;
            case 'surprised':
                return `
                    <!-- Large surprised eyes -->
                    <circle cx="${x - 8}" cy="${y}" r="${size + 2}" fill="${color}" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size + 2}" fill="${color}" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="${x - 8}" cy="${y}" r="${size/2}" fill="#2B1810"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size/2}" fill="#2B1810"/>
                `;
            case 'sleepy':
                return `
                    <!-- Sleepy half-closed eyes -->
                    <path d="M ${x - 12} ${y - 2} Q ${x - 8} ${y + 1} ${x - 4} ${y - 2}" 
                          stroke="#8B4513" stroke-width="3" fill="${color}"/>
                    <path d="M ${x + 4} ${y - 2} Q ${x + 8} ${y + 1} ${x + 12} ${y - 2}" 
                          stroke="#8B4513" stroke-width="3" fill="${color}"/>
                `;
            default: // normal
                return `
                    <!-- Normal alert eyes -->
                    <circle cx="${x - 8}" cy="${y}" r="${size}" fill="${color}" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size}" fill="${color}" stroke="#8B4513" stroke-width="2"/>
                    <circle cx="${x - 8}" cy="${y}" r="${size/2.5}" fill="#2B1810"/>
                    <circle cx="${x + 8}" cy="${y}" r="${size/2.5}" fill="#2B1810"/>
                    <!-- Eye shine -->
                    <circle cx="${x - 6}" cy="${y - 2}" r="2" fill="white" opacity="0.8"/>
                    <circle cx="${x + 10}" cy="${y - 2}" r="2" fill="white" opacity="0.8"/>
                `;
        }
    }

    renderRockPupTail(x, y, tailLength, tailThickness, color) {
        const mainColor = color || '#F5F5DC';
        const lengthScale = tailLength || 1.0;
        const thicknessScale = tailThickness || 1.0;
        const baseWidth = 12 * thicknessScale;
        
        // Fluffy white tail that curves upward
        return `
            <!-- Rock pup fluffy tail -->
            <defs>
                <radialGradient id="fluffyTailGradient" cx="0.5" cy="0.5" r="0.6">
                    <stop offset="0%" stop-color="${mainColor}" />
                    <stop offset="100%" stop-color="${this.darkenColor(mainColor, 0.1)}" />
                </radialGradient>
            </defs>
            
            <!-- Fluffy tail base -->
            <ellipse cx="${x + 35 * lengthScale}" cy="${y + 5}" rx="${baseWidth}" ry="${baseWidth * 0.8}" 
                     fill="url(#fluffyTailGradient)" stroke="#8B4513" stroke-width="1"/>
            
            <!-- Fluffy tail tip -->
            <ellipse cx="${x + 40 * lengthScale}" cy="${y - 10 * lengthScale}" rx="${baseWidth * 0.8}" ry="${baseWidth * 0.7}" 
                     fill="url(#fluffyTailGradient)" stroke="#8B4513" stroke-width="1"/>
            
            <!-- Additional fluff details -->
            <circle cx="${x + 32 * lengthScale}" cy="${y + 8}" r="${baseWidth * 0.4}" 
                    fill="${mainColor}" stroke="none" opacity="0.8"/>
            <circle cx="${x + 42 * lengthScale}" cy="${y - 5 * lengthScale}" r="${baseWidth * 0.3}" 
                    fill="${mainColor}" stroke="none" opacity="0.8"/>
        `;
    }

    renderPoisonSnakeSegments(x, y, bodyWidth, bodyHeight, bodyColor, bellyColor) {
        const segmentHeight = bodyHeight * 0.25;
        const segments = [];
        
        // Create segmented snake body like Ekans
        for (let i = 0; i < 4; i++) {
            const segmentY = y - bodyHeight/2 + (i * segmentHeight);
            const segmentWidth = bodyWidth/3.5 - (i * 2); // Tapers slightly
            
            segments.push(`
                <!-- Body segment ${i + 1} -->
                <ellipse cx="${x}" cy="${segmentY}" rx="${segmentWidth}" ry="${segmentHeight/2}" 
                         fill="${bodyColor}" stroke="#6B5B95" stroke-width="2"/>
                <!-- Belly marking -->
                <ellipse cx="${x}" cy="${segmentY + 5}" rx="${segmentWidth * 0.7}" ry="${segmentHeight/3}" 
                         fill="${bellyColor}" stroke="none"/>
            `);
        }
        
        return segments.join('');
    }

    renderPoisonSnakeEyes(x, y, eyeSize, expression, eyeColor) {
        const size = eyeSize || 8;
        const color = eyeColor || '#FFD700';
        
        switch(expression) {
            case 'happy':
                return `
                    <!-- Happy curved eyes -->
                    <path d="M ${x - 10} ${y - 2} Q ${x - 6} ${y + 2} ${x - 2} ${y - 2}" 
                          stroke="#6B5B95" stroke-width="3" fill="none"/>
                    <path d="M ${x + 2} ${y - 2} Q ${x + 6} ${y + 2} ${x + 10} ${y - 2}" 
                          stroke="#6B5B95" stroke-width="3" fill="none"/>
                `;
            case 'surprised':
                return `
                    <!-- Large surprised eyes -->
                    <circle cx="${x - 6}" cy="${y}" r="${size + 2}" fill="${color}" stroke="#6B5B95" stroke-width="2"/>
                    <circle cx="${x + 6}" cy="${y}" r="${size + 2}" fill="${color}" stroke="#6B5B95" stroke-width="2"/>
                    <circle cx="${x - 6}" cy="${y}" r="${size/2}" fill="#2B1810"/>
                    <circle cx="${x + 6}" cy="${y}" r="${size/2}" fill="#2B1810"/>
                `;
            case 'sleepy':
                return `
                    <!-- Sleepy half-closed eyes -->
                    <path d="M ${x - 10} ${y - 2} Q ${x - 6} ${y + 1} ${x - 2} ${y - 2}" 
                          stroke="#6B5B95" stroke-width="3" fill="${color}"/>
                    <path d="M ${x + 2} ${y - 2} Q ${x + 6} ${y + 1} ${x + 10} ${y - 2}" 
                          stroke="#6B5B95" stroke-width="3" fill="${color}"/>
                `;
            default: // normal
                return `
                    <!-- Normal serpentine eyes -->
                    <ellipse cx="${x - 6}" cy="${y}" rx="${size}" ry="${size * 0.7}" fill="${color}" stroke="#6B5B95" stroke-width="2"/>
                    <ellipse cx="${x + 6}" cy="${y}" rx="${size}" ry="${size * 0.7}" fill="${color}" stroke="#6B5B95" stroke-width="2"/>
                    <!-- Vertical pupils -->
                    <ellipse cx="${x - 6}" cy="${y}" rx="2" ry="${size * 0.6}" fill="#2B1810"/>
                    <ellipse cx="${x + 6}" cy="${y}" rx="2" ry="${size * 0.6}" fill="#2B1810"/>
                    <!-- Eye shine -->
                    <circle cx="${x - 4}" cy="${y - 2}" r="1.5" fill="white" opacity="0.8"/>
                    <circle cx="${x + 8}" cy="${y - 2}" r="1.5" fill="white" opacity="0.8"/>
                `;
        }
    }

    renderPoisonSnakeTail(x, y, bodyHeight, tailLength, tailThickness, color) {
        const mainColor = color || '#FFD700';
        const lengthScale = tailLength || 1.0;
        const thicknessScale = tailThickness || 1.0;
        
        // Snake tail with rattle segments
        return `
            <!-- Snake tail body -->
            <ellipse cx="${x + 30 * lengthScale}" cy="${y + bodyHeight/2}" rx="6" ry="${15 * lengthScale}" 
                     fill="#8B77C7" stroke="#6B5B95" stroke-width="2"/>
            
            <!-- Rattle segments -->
            <ellipse cx="${x + 35 * lengthScale}" cy="${y + bodyHeight/2 + 15 * lengthScale}" rx="${5 * thicknessScale}" ry="4" 
                     fill="${mainColor}" stroke="#B8860B" stroke-width="1"/>
            <ellipse cx="${x + 37 * lengthScale}" cy="${y + bodyHeight/2 + 20 * lengthScale}" rx="${4 * thicknessScale}" ry="3" 
                     fill="${mainColor}" stroke="#B8860B" stroke-width="1"/>
            <ellipse cx="${x + 39 * lengthScale}" cy="${y + bodyHeight/2 + 24 * lengthScale}" rx="${3 * thicknessScale}" ry="2" 
                     fill="${mainColor}" stroke="#B8860B" stroke-width="1"/>
        `;
    }

    renderPikachuMarkings(x, y, bodyWidth, bodyHeight, markingsType, color) {
        const markingColor = color || '#D4A017';
        
        switch(markingsType) {
            case 'electric':
                return `
                    <!-- Small lightning marks on body -->
                    <path d="M ${x-15} ${y+10} L ${x-10} ${y+5} L ${x-12} ${y+8} L ${x-8} ${y+3}" 
                          stroke="${markingColor}" stroke-width="2" fill="none"/>
                    <path d="M ${x+15} ${y+10} L ${x+10} ${y+5} L ${x+12} ${y+8} L ${x+8} ${y+3}" 
                          stroke="${markingColor}" stroke-width="2" fill="none"/>
                `;
            case 'sparks':
                return `
                    <!-- Electric spark effects -->
                    <circle cx="${x-20}" cy="${y-10}" r="2" fill="${markingColor}" opacity="0.7"/>
                    <circle cx="${x+18}" cy="${y+5}" r="1.5" fill="${markingColor}" opacity="0.7"/>
                    <circle cx="${x-8}" cy="${y+20}" r="1" fill="${markingColor}" opacity="0.7"/>
                    <circle cx="${x+25}" cy="${y-5}" r="2.5" fill="${markingColor}" opacity="0.7"/>
                `;
            case 'power':
                return `
                    <!-- Power symbol on forehead -->
                    <polygon points="${x},${y-bodyHeight/2+5} ${x-3},${y-bodyHeight/2+12} ${x+3},${y-bodyHeight/2+12}" 
                             fill="${markingColor}" opacity="0.8"/>
                `;
            default:
                return '';
        }
    }

    renderPikachuBodyPattern(x, y, bodyWidth, bodyHeight, patternType, patternColor) {
        if (patternType === 'solid' || !patternType) return '';
        
        const color = patternColor || '#D4A017';
        
        // Content-aware pattern positioning
        const bodyX = x;
        const bodyY = y + 5; // Main body position
        const headY = y - bodyHeight/3; // Head position
        const bellyX = x;
        const bellyY = y + bodyHeight/4; // Belly area
        
        switch(patternType) {
            case 'striped':
                return `
                    <!-- Natural body stripes following creature contours -->
                    <defs>
                        <mask id="bodyStripeMask">
                            <rect x="0" y="0" width="1000" height="1000" fill="white"/>
                            <!-- Exclude head, ears, and limbs -->
                            <circle cx="${x}" cy="${headY}" r="${bodyWidth/2.5 + 8}" fill="black"/>
                            <circle cx="${x - bodyWidth/2}" cy="${y + 10}" r="8" fill="black"/> <!-- Left arm -->
                            <circle cx="${x + bodyWidth/2}" cy="${y + 10}" r="8" fill="black"/> <!-- Right arm -->
                        </mask>
                    </defs>
                    <!-- Curved stripes following body shape -->
                    <path d="M ${bodyX - bodyWidth/2.8} ${bodyY - 15} Q ${bodyX} ${bodyY - 12} ${bodyX + bodyWidth/2.8} ${bodyY - 15}" 
                          stroke="${color}" stroke-width="4" fill="none" opacity="0.6" mask="url(#bodyStripeMask)"/>
                    <path d="M ${bodyX - bodyWidth/2.5} ${bodyY} Q ${bodyX} ${bodyY + 3} ${bodyX + bodyWidth/2.5} ${bodyY}" 
                          stroke="${color}" stroke-width="4" fill="none" opacity="0.6" mask="url(#bodyStripeMask)"/>
                    <path d="M ${bodyX - bodyWidth/2.8} ${bodyY + 15} Q ${bodyX} ${bodyY + 18} ${bodyX + bodyWidth/2.8} ${bodyY + 15}" 
                          stroke="${color}" stroke-width="4" fill="none" opacity="0.6" mask="url(#bodyStripeMask)"/>
                `;
            case 'spotted':
                return `
                    <!-- Natural spots on body and belly -->
                    <defs>
                        <mask id="bodySpotMask">
                            <rect x="0" y="0" width="1000" height="1000" fill="white"/>
                            <!-- Exclude head and facial features -->
                            <circle cx="${x}" cy="${headY}" r="${bodyWidth/2.5 + 10}" fill="black"/>
                        </mask>
                    </defs>
                    <!-- Body spots in natural positions -->
                    <circle cx="${bodyX - 18}" cy="${bodyY - 8}" r="5" fill="${color}" opacity="0.7" mask="url(#bodySpotMask)"/>
                    <circle cx="${bodyX + 15}" cy="${bodyY + 5}" r="4" fill="${color}" opacity="0.7" mask="url(#bodySpotMask)"/>
                    <circle cx="${bodyX - 10}" cy="${bodyY + 18}" r="6" fill="${color}" opacity="0.7" mask="url(#bodySpotMask)"/>
                    <circle cx="${bodyX + 20}" cy="${bodyY - 12}" r="3.5" fill="${color}" opacity="0.7" mask="url(#bodySpotMask)"/>
                    <!-- Belly spots -->
                    <ellipse cx="${bellyX - 8}" cy="${bellyY + 5}" rx="3" ry="4" fill="${color}" opacity="0.5" mask="url(#bodySpotMask)"/>
                    <ellipse cx="${bellyX + 6}" cy="${bellyY + 12}" rx="2.5" ry="3.5" fill="${color}" opacity="0.5" mask="url(#bodySpotMask)"/>
                `;
            case 'gradient':
                return `
                    <!-- Natural body gradient following anatomy -->
                    <defs>
                        <radialGradient id="bodyPatternGradient" cx="0.5" cy="0.3" r="0.9">
                            <stop offset="0%" stop-color="${color}" stop-opacity="0.2" />
                            <stop offset="60%" stop-color="${color}" stop-opacity="0.4" />
                            <stop offset="100%" stop-color="${color}" stop-opacity="0.6" />
                        </radialGradient>
                        <mask id="gradientBodyMask">
                            <rect x="0" y="0" width="1000" height="1000" fill="white"/>
                            <!-- Exclude head and extremities -->
                            <circle cx="${x}" cy="${headY}" r="${bodyWidth/2.5 + 12}" fill="black"/>
                        </mask>
                    </defs>
                    <!-- Body gradient -->
                    <ellipse cx="${bodyX}" cy="${bodyY}" rx="${bodyWidth/2.3}" ry="${bodyHeight/2.2}" 
                             fill="url(#bodyPatternGradient)" mask="url(#gradientBodyMask)"/>
                    <!-- Belly accent gradient -->
                    <ellipse cx="${bellyX}" cy="${bellyY + 8}" rx="${bodyWidth/3.5}" ry="${bodyHeight/4}" 
                             fill="${color}" opacity="0.25" mask="url(#gradientBodyMask)"/>
                `;
            case 'diamond':
                return `
                    <!-- Diamond pattern on body -->
                    <defs>
                        <mask id="diamondMask">
                            <rect x="0" y="0" width="1000" height="1000" fill="white"/>
                            <circle cx="${x}" cy="${headY}" r="${bodyWidth/2.5 + 10}" fill="black"/>
                        </mask>
                    </defs>
                    <!-- Central diamond -->
                    <path d="M ${bodyX} ${bodyY - 12} L ${bodyX + 8} ${bodyY} L ${bodyX} ${bodyY + 12} L ${bodyX - 8} ${bodyY} Z" 
                          fill="${color}" opacity="0.6" mask="url(#diamondMask)"/>
                    <!-- Smaller side diamonds -->
                    <path d="M ${bodyX - 20} ${bodyY - 5} L ${bodyX - 15} ${bodyY} L ${bodyX - 20} ${bodyY + 5} L ${bodyX - 25} ${bodyY} Z" 
                          fill="${color}" opacity="0.5" mask="url(#diamondMask)"/>
                    <path d="M ${bodyX + 20} ${bodyY - 5} L ${bodyX + 25} ${bodyY} L ${bodyX + 20} ${bodyY + 5} L ${bodyX + 15} ${bodyY} Z" 
                          fill="${color}" opacity="0.5" mask="url(#diamondMask)"/>
                `;
            default:
                return '';
        }
    }

    // Helper function to darken colors
    darkenColor(color, factor) {
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            const darkenedR = Math.floor(r * (1 - factor));
            const darkenedG = Math.floor(g * (1 - factor));
            const darkenedB = Math.floor(b * (1 - factor));
            
            return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
        }
        return color;
    }

    renderBackground(backgroundType) {
        const backgrounds = {
            forest: 'linear-gradient(180deg, #87CEEB 0%, #228B22 30%, #006400 100%)',
            beach: 'linear-gradient(180deg, #FFE4B5 0%, #F0E68C 40%, #1E90FF 100%)',
            stadium: 'linear-gradient(180deg, #4169E1 0%, #32CD32 50%, #228B22 100%)',
            ocean: 'linear-gradient(180deg, #87CEEB 0%, #1E90FF 100%)',
            volcano: 'linear-gradient(180deg, #FF4500 0%, #DC143C 50%, #8B0000 100%)',
            sky: 'linear-gradient(180deg, #87CEEB 0%, #FFB6C1 100%)',
            rainbow: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)',
            default: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
        };
        
        const bg = backgrounds[backgroundType] || backgrounds.default;
        return `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${bg}; border-radius: 15px; z-index: 1;"></div>`;
    }

    renderSVGEffects(creature, svgWidth, svgHeight) {
        let effects = '';
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        
        // Particle effects only (auras removed)
        if (creature.particles && creature.particles !== 'none') {
            switch(creature.particles) {
                case 'sparkles':
                    effects += `
                        <g class="sparkle-particles">
                            ${Array.from({length: 8}, (_, i) => {
                                const angle = (i * 45) * Math.PI / 180;
                                const radius = 80 + Math.random() * 40;
                                const x = centerX + Math.cos(angle) * radius;
                                const y = centerY + Math.sin(angle) * radius;
                                const delay = Math.random() * 2;
                                return `
                                    <circle cx="${x}" cy="${y}" r="2" fill="#FFD700" opacity="0">
                                        <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="${delay}s" repeatCount="indefinite"/>
                                        <animate attributeName="r" values="1;3;1" dur="1.5s" begin="${delay}s" repeatCount="indefinite"/>
                                    </circle>
                                `;
                            }).join('')}
                        </g>
                    `;
                    break;
                case 'hearts':
                    effects += `
                        <g class="heart-particles">
                            ${Array.from({length: 6}, (_, i) => {
                                const x = centerX + (Math.random() - 0.5) * 200;
                                const y = centerY + (Math.random() - 0.5) * 200;
                                const delay = Math.random() * 3;
                                return `
                                    <text x="${x}" y="${y}" font-size="12" fill="#FF69B4" opacity="0" text-anchor="middle">♥
                                        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
                                        <animate attributeName="y" values="${y};${y-20};${y}" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
                                    </text>
                                `;
                            }).join('')}
                        </g>
                    `;
                    break;
                case 'stars':
                    effects += `
                        <g class="star-particles">
                            ${Array.from({length: 10}, (_, i) => {
                                const x = centerX + (Math.random() - 0.5) * 180;
                                const y = centerY + (Math.random() - 0.5) * 180;
                                const delay = Math.random() * 2.5;
                                return `
                                    <text x="${x}" y="${y}" font-size="10" fill="#FFFF00" opacity="0" text-anchor="middle">★
                                        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
                                        <animateTransform attributeName="transform" type="rotate" 
                                                        values="0 ${x} ${y};360 ${x} ${y}" dur="3s" begin="${delay}s" repeatCount="indefinite"/>
                                    </text>
                                `;
                            }).join('')}
                        </g>
                    `;
                    break;
            }
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
                <h4 class="section-title">🎓 Choose Your Study Buddy</h4>
                
                <div class="option-group">
                    <label>Avatar Type:</label>
                    <div class="creature-type-grid">
                        ${[
                            { id: 'robot', name: 'Robo Scholar', icon: '🤖', desc: 'Professional avatar like the teachers use!' },
                            { id: 'mouse', name: 'Sparky the Study Mouse', icon: '⚡', desc: 'Quick learner with electric energy!' },
                            { id: 'fire-cat', name: 'Blaze the Brain Cat', icon: '🔥', desc: 'Fierce focus and fiery determination!' },
                            { id: 'rock-pup', name: 'Rocky the Rock Star', icon: '⭐', desc: 'Solid study habits and star potential!' },
                            { id: 'poison-snake', name: 'Purple Snake Scholar', icon: '🐍', desc: 'Wise serpent with mystical knowledge!' },
                            { id: 'dolphin', name: 'Splash the Smart Dolphin', icon: '🌊', desc: 'Intelligent aquatic academic!' }
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
                    <label>Body Size (Small to Large):</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="1" step="0.1" value="${this.currentAvatar.bodySize}" 
                               onchange="avatarBuilderManager.updateAvatar('bodySize', parseFloat(this.value))"
                               class="creature-slider"/>
                        <div class="slider-labels">
                            <span>Small</span>
                            <span>Large</span>
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
                    <label>Limb Size (Small to Large):</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="1" step="0.1" value="${this.currentAvatar.limbThickness}" 
                               onchange="avatarBuilderManager.updateAvatar('limbThickness', parseFloat(this.value))"
                               class="creature-slider"/>
                        <div class="slider-labels">
                            <span>Small</span>
                            <span>Large</span>
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
                        ${['normal', 'happy', 'surprised', 'sleepy'].map(expression => `
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
                    <label>Tail Length: ${this.currentAvatar.tailLength}</label>
                    <input type="range" min="0.3" max="1.5" step="0.1" value="${this.currentAvatar.tailLength}"
                           onchange="avatarBuilderManager.updateAvatar('tailLength', parseFloat(this.value))">
                </div>

                <div class="option-group">
                    <label>Tail Thickness: ${this.currentAvatar.tailThickness}</label>
                    <input type="range" min="0.5" max="2.0" step="0.1" value="${this.currentAvatar.tailThickness}"
                           onchange="avatarBuilderManager.updateAvatar('tailThickness', parseFloat(this.value))">
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
                    <label>Accessories:</label>
                    <div class="option-grid">
                        ${['collar', 'bow', 'hat', 'glasses', 'cape', 'none'].map(accessory => `
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
                        ${['forest', 'beach', 'stadium', 'ocean', 'volcano', 'sky', 'rainbow', 'default'].map(bg => `
                            <div class="option-item ${this.currentAvatar.background === bg ? 'active' : ''}" 
                                 onclick="avatarBuilderManager.updateAvatar('background', '${bg}')">
                                ${bg.charAt(0).toUpperCase() + bg.slice(1)}
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
        
        // Handle robot preview area
        const robotPreview = document.getElementById('robot-preview');
        if (robotPreview) {
            if (this.currentAvatar.creatureType === 'robot') {
                robotPreview.style.display = 'block';
                this.showRobotPreview();
            } else {
                robotPreview.style.display = 'none';
            }
        }
    }

    getCreatureIcon(creatureType) {
        const icons = {
            mouse: '🐭',
            cat: '🐱', 
            'fire-cat': '🔥',
            dog: '🐶',
            'rock-pup': '🪨',
            snake: '🐍',
            'poison-snake': '☠️',
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
        const creatureTypes = ['robot', 'mouse', 'fire-cat', 'rock-pup', 'poison-snake', 'dolphin'];
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

    async saveCreature() {
        try {
            if (this.currentStudent) {
                console.log('Saving avatar data:', this.currentAvatar);
                
                // Update local student data
                this.currentStudent.avatar = { ...this.currentAvatar };
                
                // Save to database
                const updatedStudent = await DatabaseAPI.updateStudentAvatar(
                    this.currentStudent.id,
                    this.currentAvatar
                );
                
                console.log('Updated student from server:', updatedStudent);
                
                if (updatedStudent) {
                    // Update navigation manager's current student
                    navigationManager.setCurrentStudent({
                        ...this.currentStudent,
                        avatar: updatedStudent.avatar
                    });
                    
                    console.log('Updated navigation manager with new student data');
                    this.showFeedback('Avatar saved successfully!', 'success');
                } else {
                    this.showFeedback('Failed to save avatar', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving avatar:', error);
            this.showFeedback('Error saving avatar. Please try again.', 'error');
        }
    }
}

// Initialize the avatar builder when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.avatarBuilderManager = new AvatarBuilderManager();
    console.log('✅ Avatar Builder Manager initialized and attached to window');
});
