const CONSOLE_TYPING_SPEED = 80;
const CONSOLE_OUTPUT_SPEED = 15;

// Putain JS ! Sérieux quoi ?
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Mars Explorer Interactive System
class MarsExplorer {
    constructor() {
        this.currentPage = 'welcome';
        this.gameState = {
            sol: 2157,
            power: 100,
            oxygen: 98,
            water: 85,
            discovered: []
        };
        this.consolePageInitialized = false;
        this.ledActive = false;
        this.missionStartTime = new Date('2025-01-01T00:00:00Z');
        this.missionDuration = {
            days: 149,
            hours: 18,
            minutes: 53,
            seconds: 17
        };
        // Start with no commands, the first one (i.e. `help`) will be added
        // once the console initialization animation is done.
        this.commands = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.generateCommandButtons();
        this.startTimers();
        this.setupVideoEffects();
    }

    startTimers() {
        this.updateMarsTime();
        this.updateMissionTimer();
        setInterval(() => this.updateMarsTime(), 1000);
        setInterval(() => this.updateMissionTimer(), 1000);
    }

    updateMarsTime() {
        const now = new Date();
        const marsTime = new Date(now.getTime() * 1.0274912517);
        const hours = String(marsTime.getUTCHours()).padStart(2, '0');
        const minutes = String(marsTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(marsTime.getUTCSeconds()).padStart(2, '0');
        
        const marsClockElement = document.getElementById('mars-clock');
        if (marsClockElement) {
            marsClockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    updateMissionTimer() {
        const now = new Date();
        const elapsed = now - this.missionStartTime;
        
        const totalSeconds = Math.floor(elapsed / 1000) + 
            (this.missionDuration.days * 24 * 3600) +
            (this.missionDuration.hours * 3600) +
            (this.missionDuration.minutes * 60) +
            this.missionDuration.seconds;
        
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const missionTimerElement = document.getElementById('mission-timer');
        if (missionTimerElement) {
            missionTimerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    bindEvents() {
        // Welcome page
        document.getElementById('enter-mission').addEventListener('click', () => {
            this.switchPage('main');
        });

        // Main page controls
        document.getElementById('toggle-control').addEventListener('click', () => {
            this.switchPage('control');
        });

        document.getElementById('open-about').addEventListener('click', () => {
            this.openModal();
        });

        document.getElementById('toggle-led').addEventListener('click', () => {
            this.toggleLed();
        });

        // Control page
        document.getElementById('back-to-main').addEventListener('click', () => {
            this.switchPage('main');
        });

        // About modal
        document.getElementById('close-about').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('about-modal').addEventListener('click', (e) => {
            if (e.target.id === 'about-modal') {
                this.closeModal();
            }
        });

        // Command buttons will be bound dynamically

        // Company links
        document.getElementById('company-website').addEventListener('click', (e) => {
            e.preventDefault();
            // Replace with actual company website
            window.open('https://example-company.com', '_blank');
        });

        document.getElementById('company-location').addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://maps.google.com/search/Mars+Exploration+Technologies', '_blank');
        });
    }

    switchPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        setTimeout(() => {
            document.getElementById(`${pageId}-page`).classList.add('active');
            this.currentPage = pageId;

            if (pageId === 'control' && !this.consolePageInitialized) {
                this.setupConsole();
                this.consolePageInitialized = true;
            }
        }, 80);
    }

    openModal() {
        document.getElementById('about-modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('about-modal').classList.remove('active');
    }

    async setupConsole() {
        await sleep(500);
        await this.addToConsole('MARS EXPLORATION CONTROL SYSTEM v2.4.1', 'system');
        await sleep(500);
        await this.addToConsole(`SOL ${this.gameState.sol} - All systems nominal`, 'system');
        await sleep(500);
        await this.addToConsole('Ready for commands. Use command buttons for operations.', 'prompt');
        this.createNextPrompt(); // Show initial prompt
        this.commands['HELP'] = () => this.showHelp();
        this.generateCommandButtons();
    }
    
    generateCommandButtons() {
        console.log('Generating command buttons...', this.commands);
        const container = document.getElementById('command-buttons');
        if (!container) return;
        
        // Clear existing buttons
        container.innerHTML = '';
        
        // Generate buttons from commands object
        Object.keys(this.commands).forEach(command => {
            const button = document.createElement('button');
            button.className = 'command-btn';
            button.setAttribute('data-command', command);
            button.textContent = command.toUpperCase();
            
            // Add click event listener
            button.addEventListener('click', async () => {
                await this.processCommand(command);
            });
            
            container.appendChild(button);
        });
    }
    
    disableCommandButtons() {
        const buttons = document.querySelectorAll('.command-btn');
        buttons.forEach(button => {
            button.disabled = true;
        });
    }
    
    enableCommandButtons() {
        const buttons = document.querySelectorAll('.command-btn');
        buttons.forEach(button => {
            button.disabled = false;
        });
    }
    
    async showHelp() {
        // At first only the help command is available, using it unlocks more commands
        var needRefreshCommandButtons = false;
        if (this.commands['LOG'] == undefined) {
            this.commands['LOG'] = () => this.showLog();
            needRefreshCommandButtons = true;
        }
        if (this.commands['CLEAR'] == undefined) {
            this.commands['CLEAR'] = () => this.clearConsole();
            needRefreshCommandButtons = true;
        }
        if (this.commands['SCAN'] == undefined) {
            this.commands['SCAN'] = () => this.scanArea();
            needRefreshCommandButtons = true;
        }
        if (needRefreshCommandButtons) {
            this.generateCommandButtons();
        }

        const availableCommands = Object.keys(this.commands).join(', ');
        await this.addToConsole(`Available commands: ${availableCommands}`);
    }

    setupVideoEffects() {
        const video = document.getElementById('mars-video');
        const noSignal = document.getElementById('no-signal');
        
        // Initialize TV static with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.initTVStatic();
        }, 100);
        
        // Show no signal by default (since there's likely no video file)
        this.showNoSignal();
        
        // Listen for video events
        video.addEventListener('loadstart', () => {
            this.showNoSignal();
        });
        
        video.addEventListener('canplay', () => {
            this.hideNoSignal();
        });
        
        video.addEventListener('error', () => {
            this.showNoSignal();
        });
        
        video.addEventListener('stalled', () => {
            this.showNoSignal();
        });
        
        video.addEventListener('waiting', () => {
            this.showNoSignal();
        });
    }
    
    initTVStatic() {
        this.canvas = document.getElementById('static-canvas');
        if (!this.canvas) {
            console.error('Static canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.staticAnimationId = null;
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Start static animation
        this.animateStatic();
    }
    
    resizeCanvas() {
        const viewport = document.querySelector('.video-viewport');
        if (viewport && this.canvas) {
            this.canvas.width = viewport.clientWidth;
            this.canvas.height = viewport.clientHeight;
        }
    }
    
    generateTVStatic() {
        if (!this.canvas || !this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        if (width === 0 || height === 0) return;
        
        const imageData = this.ctx.createImageData(width, height);
        const data = imageData.data;
        
        const grainSize = 4; // Size of each grain pixel
        
        for (let x = 0; x < width; x += grainSize) {
            for (let y = 0; y < height; y += grainSize) {
                // Generate random noise value
                const noise = Math.random();
                
                // Create color variations for more realistic TV static
                let r, g, b, a;
                
                if (noise > 0.95) {
                    // Bright white pixels (5% chance)
                    r = g = b = 255;
                    a = 200;
                } else if (noise > 0.9) {
                    // Blue tinted pixels (5% chance)
                    r = Math.floor(noise * 100);
                    g = Math.floor(noise * 120);
                    b = Math.floor(noise * 255);
                    a = 150;
                } else if (noise > 0.85) {
                    // Orange tinted pixels (5% chance)
                    r = Math.floor(noise * 255);
                    g = Math.floor(noise * 180);
                    b = Math.floor(noise * 100);
                    a = 150;
                } else if (noise > 0.7) {
                    // Gray pixels (15% chance)
                    const gray = Math.floor(noise * 180);
                    r = g = b = gray;
                    a = 120;
                } else {
                    // Transparent/dark pixels (70% chance)
                    r = g = b = 0;
                    a = 0;
                }
                
                // Fill grain-sized blocks
                for (let dx = 0; dx < grainSize && x + dx < width; dx++) {
                    for (let dy = 0; dy < grainSize && y + dy < height; dy++) {
                        const index = ((y + dy) * width + (x + dx)) * 4;
                        data[index] = r;     // Red
                        data[index + 1] = g; // Green
                        data[index + 2] = b; // Blue
                        data[index + 3] = a; // Alpha
                    }
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    animateStatic() {
        this.generateTVStatic();
        
        // Random frame rate between 150-300ms for slower, more realistic TV static
        const nextFrameDelay = 150 + Math.random() * 150;
        
        this.staticAnimationId = setTimeout(() => {
            this.animateStatic();
        }, nextFrameDelay);
    }
    
    stopStatic() {
        if (this.staticAnimationId) {
            clearTimeout(this.staticAnimationId);
            this.staticAnimationId = null;
        }
    }
    
    showNoSignal() {
        const noSignal = document.getElementById('no-signal');
        const video = document.getElementById('mars-video');
        noSignal.classList.add('active');
        video.style.opacity = '0';
        
        // Start static animation if not running
        if (!this.staticAnimationId && this.canvas) {
            this.animateStatic();
        }
    }
    
    hideNoSignal() {
        const noSignal = document.getElementById('no-signal');
        const video = document.getElementById('mars-video');
        noSignal.classList.remove('active');
        video.style.opacity = '1';
        
        // Stop static animation to save resources
        this.stopStatic();
    }

    playVideo(videoPath) {
        const video = document.getElementById('mars-video');
        const source = video.querySelector('source');
        
        // Update video source
        source.src = videoPath;
        video.load(); // Reload video with new source
        
        // Hide no signal effect
        this.hideNoSignal();
        
        // Play the video
        video.play().catch(error => {
            console.error('Error playing video:', error);
            // If video fails to play, show no signal
            this.showNoSignal();
        });
    }

    toggleLed() {
        this.ledActive = !this.ledActive;
        const ledEffect = document.getElementById('led-effect');
        
        if (this.ledActive) {
            ledEffect.classList.add('active');
        } else {
            ledEffect.classList.remove('active');
        }
    }

    async addToConsole(text, type = 'normal', speed = CONSOLE_OUTPUT_SPEED) {
        const output = document.getElementById('console-output');
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        output.appendChild(line);
        
        // Start typing animation and wait for completion
        await this.typeText(line, text, speed);
        output.scrollTop = output.scrollHeight;

        return line;
    }
    
    createNextPrompt(promptText = 'ARES-IV:~$ ') {
        const output = document.getElementById('console-output');
        const line = document.createElement('div');
        line.className = 'output-line normal';
        line.textContent = promptText;
        line.id = 'current-prompt'; // Mark as current prompt
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        this.currentPromptElement = line;
    }
    
    async completeCurrentPrompt(command) {
        if (this.currentPromptElement) {
            // Remove the current prompt ID since it's no longer current
            this.currentPromptElement.removeAttribute('id');
            
            // Type the command part
            await this.typeText(
                this.currentPromptElement,
                this.currentPromptElement.textContent + command,
                CONSOLE_TYPING_SPEED,
                this.currentPromptElement.textContent.length  // Start typing after the prompt text
            );

            const output = document.getElementById('console-output');
            output.scrollTop = output.scrollHeight;
            
            this.currentPromptElement = null;
        }
    }

    async typeText(element, fullText, speed, startIndex = 0) {
        return new Promise((resolve) => {
            let index = startIndex;
            
            const typeInterval = setInterval(() => {
                if (index < fullText.length) {
                    element.textContent = fullText.substring(0, index + 1);
                    index++;
                    // Auto-scroll during typing
                    const output = document.getElementById('console-output');
                    output.scrollTop = output.scrollHeight;
                } else {
                    clearInterval(typeInterval);
                    resolve();
                }
            }, speed);
        });
    }

    async processCommand(cmd) {
        console.log(`Processing command: ${cmd}`);
        this.disableCommandButtons();
        let displayPromptText = true;
        try {
            // Complete the current prompt with the command
            await this.completeCurrentPrompt(cmd);
            
            console.log(`Processing command: ${cmd}`, this.commands[cmd]);
            console.log(this.commands);
            if (this.commands[cmd]) {
                const noPrompt = await this.commands[cmd]();
                console.log("Command executed, no prompt:", noPrompt);
                if (noPrompt === false) {
                    displayPromptText = false;
                }
            } else {
                throw new Error(`Command not recognized: ${cmd}, available commands: ${Object.keys(this.commands).join(', ')}`);
            }

        } finally {
            if (displayPromptText) {
                this.createNextPrompt();
            } else {
                // Must still create the line that will contain the input typed
                // by the user, but we ask for no prompt text
                this.createNextPrompt('');
            }
            this.enableCommandButtons();
        }
    }

    getStatus() {
        return `SOL ${this.gameState.sol} STATUS REPORT:
Power: ${this.gameState.power}%
Oxygen: ${this.gameState.oxygen}%
Water: ${this.gameState.water}%
Location: Acidalia Planitia
Weather: Clear, -63°C
All systems nominal`;
    }

    async scanArea() {
        const scanning = "SCANNING";
        const scanning_and_dots = `${scanning}..........`;
        let scanning_line = await this.addToConsole(scanning, 'warning');
        await this.typeText(scanning_line, scanning_and_dots, 150, scanning.length);
        await this.typeText(scanning_line, scanning_and_dots + " DONE!", CONSOLE_OUTPUT_SPEED, scanning_and_dots.length);

        await this.addToConsole("Unknown signal detected!\nStrength: -133.8 dBm", 'success');

        const triangulation = "TRIANGULATION";
        const triangulation_and_dots = `${triangulation}..........`;
        let triangulation_line = await this.addToConsole(triangulation, 'warning');
        await this.typeText(triangulation_line, triangulation_and_dots, 150, triangulation.length);
        await this.typeText(triangulation_line, triangulation_and_dots + " DONE!", CONSOLE_OUTPUT_SPEED, triangulation_and_dots.length);

        await this.addToConsole("Lat: 4.8049°S, Lon: 222.6215°W", 'success');

        await this.addToConsole("CONNECT TO SIGNAL ?", 'error');
        const previousCommands = this.commands;
        this.commands = {
            'YES': async () => {
                const connecting = "CONNECTING";
                const connecting_and_dots = `${connecting}..........`;
                let connecting_line = await this.addToConsole(connecting, 'warning');
                await this.typeText(connecting_line, connecting_and_dots, 150, connecting.length);
                await this.typeText(connecting_line, connecting_and_dots + " DONE!", CONSOLE_OUTPUT_SPEED, connecting_and_dots.length);
                this.playVideo("rushes/waiting.mp4");
                this.commands = previousCommands; // Restore commands
                delete this.commands['SCAN'];  // No longer used
                this.commands['LED'] = () => this.toggleLed();
                this.generateCommandButtons();
            },
            'NO': () => {
                this.commands = previousCommands; // Restore commands
                this.generateCommandButtons();
            }
        };
        this.generateCommandButtons();

        return false; // Disable prompt display
    }

    drillSample() {
        this.gameState.power -= 5;
        const samples = [
            'Sample A-001: High iron content, oxidized minerals',
            'Sample B-002: Crystalline structures, possible water traces',
            'Sample C-003: Organic compounds detected - requires analysis'
        ];
        
        const sample = samples[Math.floor(Math.random() * samples.length)];
        this.addToConsole(`DRILLING COMPLETE: ${sample}`, 'success');
        this.gameState.discovered.push(sample);
        return null;
    }

    analyzeSample() {
        if (this.gameState.discovered.length === 0) {
            this.addToConsole('No samples available for analysis', 'warning');
            return null;
        }
        
        const analysis = `ANALYSIS COMPLETE:
- Mineral composition: 67% iron oxide, 23% silicates
- Water content: 0.3%
- Organic traces: Inconclusive
- Age: ~3.7 billion years`;
        
        this.addToConsole(analysis, 'success');
        return null;
    }

    getWeather() {
        const weather = `WEATHER REPORT SOL ${this.gameState.sol}:
Temperature: -63°C (High: -23°C, Low: -78°C)
Pressure: 610 Pa
Wind: 5 m/s from the west
Dust opacity: 0.3
UV Index: Extreme
Visibility: 15 km`;
        
        this.addToConsole(weather, 'system');
        return null;
    }

    navigate() {
        const locations = [
            'Moving to coordinates 22.48°N 49.97°W',
            'Approaching interesting geological formation',
            'Navigation to backup landing site initiated',
            'Route calculated to avoid dust storm'
        ];
        
        const nav = locations[Math.floor(Math.random() * locations.length)];
        this.addToConsole(`NAVIGATION: ${nav}`, 'success');
        return null;
    }

    checkPower() {
        const powerReport = `POWER SYSTEMS:
Solar Array: ${this.gameState.power}%
Battery: 89%
RTG: Online
Daily Generation: 900 Wh
Daily Consumption: 720 Wh
Est. operational days: ${Math.floor(this.gameState.power / 2)}`;
        
        this.addToConsole(powerReport, 'system');
        return null;
    }

    communications() {
        const messages = [
            'Signal delay to Earth: 14 minutes',
            'Next communication window: 2 hours 17 minutes',
            'Houston, we have successfully completed EVA-07',
            'Orbital relay satellite in good health',
            'Data packet transmission scheduled for 18:30 UTC'
        ];
        
        const msg = messages[Math.floor(Math.random() * messages.length)];
        this.addToConsole(`COMMUNICATIONS: ${msg}`, 'system');
        return null;
    }

    async showLog() {
        const logs = `MISSION LOG ENTRIES:
SOL 2155: Arrived at Acidalia Planitia base camp
SOL 2156: Completed habitat setup and system checks
SOL 2157: Beginning geological survey operations
SOL 2157: Weather monitoring systems operational`;
        
        await this.addToConsole(logs, 'system');
    }

    async clearConsole() {
        document.getElementById('console-output').innerHTML = '';
        this.currentPromptElement = null;
        await this.addToConsole('Console cleared. Use command buttons for operations', 'prompt', CONSOLE_OUTPUT_SPEED);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MarsExplorer();
});