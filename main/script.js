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
        this.flashlightActive = false;
        this.missionStartTime = new Date('2025-01-01T00:00:00Z');
        this.missionDuration = {
            days: 149,
            hours: 18,
            minutes: 53,
            seconds: 17
        };
        this.commands = {
            'help': 'Available commands: status, scan, drill, sample, weather, navigate, power, comms, log, clear',
            'status': () => this.getStatus(),
            'scan': () => this.scanArea(),
            'drill': () => this.drillSample(),
            'sample': () => this.analyzeSample(),
            'weather': () => this.getWeather(),
            'navigate': () => this.navigate(),
            'power': () => this.checkPower(),
            'comms': () => this.communications(),
            'log': () => this.showLog(),
            'clear': () => this.clearConsole()
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupConsole();
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

        document.getElementById('toggle-flashlight').addEventListener('click', () => {
            this.toggleFlashlight();
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

        // Command buttons
        document.querySelectorAll('.command-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.getAttribute('data-command');
                this.processCommand(command);
            });
        });

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
            
            // Focus management removed since we're using buttons now
        }, 100);
    }

    openModal() {
        document.getElementById('about-modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('about-modal').classList.remove('active');
    }

    setupConsole() {
        const output = document.getElementById('console-output');
        this.addToConsole('Ready for commands. Click a command button to begin.', 'prompt');
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

    toggleFlashlight() {
        this.flashlightActive = !this.flashlightActive;
        const flashlightEffect = document.getElementById('flashlight-effect');
        
        if (this.flashlightActive) {
            flashlightEffect.classList.add('active');
        } else {
            flashlightEffect.classList.remove('active');
        }
    }

    addToConsole(text, type = 'normal') {
        const output = document.getElementById('console-output');
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    processCommand(command) {
        this.addToConsole(`ARES-IV:~$ ${command.toUpperCase()}`, 'normal');
        
        const cmd = command.toLowerCase();
        
        if (this.commands[cmd]) {
            if (typeof this.commands[cmd] === 'function') {
                const result = this.commands[cmd]();
                if (result) this.addToConsole(result, 'success');
            } else {
                this.addToConsole(this.commands[cmd], 'success');
            }
        } else {
            this.addToConsole(`Command not recognized: ${command}`, 'error');
            this.addToConsole('Use the command buttons for available operations', 'warning');
        }
    }

    getStatus() {
        const status = `SOL ${this.gameState.sol} STATUS REPORT:
Power: ${this.gameState.power}%
Oxygen: ${this.gameState.oxygen}%
Water: ${this.gameState.water}%
Location: Acidalia Planitia
Weather: Clear, -63°C
All systems nominal`;
        this.addToConsole(status, 'system');
        return null;
    }

    scanArea() {
        this.playVideo("rushes/waiting.mp4");
        const discoveries = [
            'Iron oxide deposits detected 50m north',
            'Unusual rock formation identified',
            'Subsurface water ice signatures detected',
            'Methane traces in atmosphere',
            'Possible microbial activity indicators'
        ];
        
        const random = discoveries[Math.floor(Math.random() * discoveries.length)];
        this.addToConsole(`SCANNING... ${random}`, 'success');
        return null;
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

    showLog() {
        const logs = `MISSION LOG ENTRIES:
SOL 2155: Arrived at Acidalia Planitia base camp
SOL 2156: Completed habitat setup and system checks
SOL 2157: Beginning geological survey operations
SOL 2157: Weather monitoring systems operational`;
        
        this.addToConsole(logs, 'system');
        return null;
    }

    clearConsole() {
        document.getElementById('console-output').innerHTML = '';
        this.addToConsole('MARS EXPLORATION CONTROL SYSTEM v2.4.1', 'system');
        this.addToConsole(`SOL ${this.gameState.sol} - All systems nominal`, 'system');
        this.addToConsole('Console cleared. Use command buttons for operations', 'prompt');
        return null;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MarsExplorer();
});