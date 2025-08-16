// Battle System Manager for Student Portal - Redirects to Kudos Colosseum

class BattleSystemManager {
    constructor() {
        this.currentStudent = null;
        this.init();
    }

    init() {
        console.log('🏛️ Battle System redirecting to Kudos Colosseum');
    }

    async loadBattleArena() {
        this.currentStudent = navigationManager.getCurrentStudent();
        if (!this.currentStudent) {
            navigationManager.showPage('login');
            return;
        }

        console.log('Loading Kudos Colosseum for student:', this.currentStudent);

        // Initialize and render the Kudos Colosseum instead of the old battle system
        if (typeof KudosColosseum === 'undefined') {
            console.error('KudosColosseum class not found!');
            return;
        }

        if (typeof colosseumManager === 'undefined') {
            // Import and initialize Kudos Colosseum
            window.colosseumManager = new KudosColosseum();
        }
        
        // Render the educational learning arena
        await this.renderKudosColosseum();
    }

    async renderKudosColosseum() {
        const container = document.querySelector('.battle-arena-container');
        if (!container) {
            console.error('Battle arena container not found!');
            return;
        }

        console.log('Rendering Kudos Colosseum...');

        // Clear container and let Kudos Colosseum take over
        container.innerHTML = '<div class="content-area"></div>';
        
        // Initialize the colosseum
        if (window.colosseumManager) {
            window.colosseumManager.currentStudent = this.currentStudent;
            window.colosseumManager.renderColosseum();
        } else {
            console.error('Colosseum manager not initialized!');
        }
    }
}

// Initialize battle system manager
let battleSystemManager;

document.addEventListener('DOMContentLoaded', () => {
    battleSystemManager = new BattleSystemManager();
    window.battleSystemManager = battleSystemManager;
});
