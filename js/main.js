(function () {
  // ===== SOUND SYSTEM =====
  var SoundManager = (function () {
    var audioContext = null;
    var soundEnabled = true;

    function initAudio() {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }

    function playTone(frequency, duration, type, volume) {
      if (!soundEnabled) return;
      initAudio();

      var oscillator = audioContext.createOscillator();
      var gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    }

    return {
      playClick: function () {
        playTone(800, 0.05, 'square', 0.1);
      },
      playGameStart: function () {
        playTone(440, 0.1, 'square', 0.15);
        setTimeout(function () { playTone(554, 0.1, 'square', 0.15); }, 100);
        setTimeout(function () { playTone(659, 0.2, 'square', 0.15); }, 200);
      },
      playScore: function () {
        playTone(880, 0.1, 'sine', 0.2);
      },
      playGameOver: function () {
        playTone(330, 0.3, 'sawtooth', 0.2);
        setTimeout(function () { playTone(220, 0.4, 'sawtooth', 0.2); }, 200);
      },
      playAchievement: function () {
        var notes = [523, 659, 784, 1047];
        notes.forEach(function (freq, i) {
          setTimeout(function () {
            playTone(freq, 0.2, 'square', 0.15);
          }, i * 100);
        });
      },
      playError: function () {
        playTone(150, 0.3, 'sawtooth', 0.15);
      },
      playPowerUp: function () {
        playTone(220, 0.1, 'sine', 0.15);
        setTimeout(function () { playTone(440, 0.1, 'sine', 0.15); }, 100);
        setTimeout(function () { playTone(880, 0.2, 'sine', 0.15); }, 200);
      },
      toggle: function () {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled);
        return soundEnabled;
      },
      isEnabled: function () {
        return soundEnabled;
      },
      init: function () {
        var stored = localStorage.getItem('soundEnabled');
        if (stored !== null) {
          soundEnabled = stored === 'true';
        }
      },
      playTone: playTone
    };
  })();

  SoundManager.init();

  // ===== TREASURE HUNT SYSTEM =====
  var TREASURE_DATA = [
    { id: 'boot', icon: '&#128187;', name: 'Boot Sequence', hint: 'Just wait for the terminal to boot...', area: 'terminal' },
    { id: 'help', icon: '&#128270;', name: 'Help Command', hint: 'Type "help" in the terminal', area: 'terminal' },
    { id: 'about', icon: '&#128100;', name: 'About Info', hint: 'Type "about" to learn who I am', area: 'terminal' },
    { id: 'skills', icon: '&#127891;', name: 'Tech Skills', hint: 'Type "skills" to see my stack', area: 'terminal' },
    { id: 'projects', icon: '&#128187;', name: 'Projects', hint: 'Type "projects" to see my work', area: 'terminal' },
    { id: 'contact', icon: '&#128231;', name: 'Contact Info', hint: 'Type "contact" to reach me', area: 'terminal' },
    { id: 'scan', icon: '&#128300;', name: 'Profile Scan', hint: 'Type "scan" to analyze profile', area: 'terminal' },
    { id: 'matrix', icon: '&#127915;', name: 'Matrix Rain', hint: 'Type "matrix" for digital rain', area: 'terminal' },
    { id: 'status', icon: '&#128202;', name: 'Status Check', hint: 'Type "status" to see progress', area: 'terminal' },
    { id: 'ls', icon: '&#128193;', name: 'List Files', hint: 'Type "ls" to see files', area: 'terminal' },
    { id: 'whoami', icon: '&#128483;', name: 'Identity Check', hint: 'Type "whoami" to find yourself', area: 'terminal' },
    { id: 'sudo', icon: '&#128274;', name: 'Root Access', hint: 'Try "sudo" (hint: you\'re not admin)', area: 'terminal' },
    { id: 'secret', icon: '&#128293;', name: 'Secret File', hint: 'Type "cat secret.zip" to find secrets', area: 'terminal' },
    { id: 'password', icon: '&#128273;', name: 'Password Hunt', hint: 'Type "password" (there is none)', area: 'terminal' },
    { id: '42', icon: '#&#128084;', name: 'The Answer', hint: 'Type "42" for the answer to everything', area: 'terminal' },
    { id: 'konami', icon: '&#127918;', name: 'Konami Code', hint: '↑↑↓↓←→←→BA - The classic cheat code!', area: 'page' },
    { id: 'linkedin', icon: '&#128187;', name: 'LinkedIn', hint: 'Click the LinkedIn icon in hero', area: 'hero' },
    { id: 'github', icon: '&#128187;', name: 'GitHub', hint: 'Click the GitHub icon or type "github"', area: 'hero' },
    { id: 'twitter', icon: '&#128187;', name: 'Twitter', hint: 'Click the Twitter icon in hero', area: 'hero' },
    { id: 'scroll', icon: '&#128071;', name: 'Scroll Down', hint: 'Use the scroll indicator or scroll down', area: 'page' },
    { id: 'nav', icon: '&#128640;', name: 'Navigation', hint: 'Click nav links to explore sections', area: 'nav' },
    { id: 'snake', icon: '&#127943;', name: 'Snake Game', hint: 'Unlock at 1 discovery - EASY! Type "snake"', area: 'terminal' },
    { id: 'hack', icon: '&#128165;', name: 'Hack Game', hint: 'Unlock at 5 discoveries, then type "hack"', area: 'terminal' },
    { id: 'type', icon: '&#9889;', name: 'Typing Game', hint: 'Unlock at 10 discoveries (HARD) - type "type"', area: 'terminal' },
    { id: 'memory', icon: '&#128466;', name: 'Memory Game', hint: 'Unlock at 14 discoveries (HARD) - type "memory"', area: 'terminal' },
    { id: 'quiz', icon: '&#10067;', name: 'Quiz Game', hint: 'Unlock at 18 discoveries (HARD) - type "quiz"', area: 'terminal' },
    { id: 'breakout', icon: '&#127919;', name: 'Breakout', hint: 'Unlock at 22 discoveries (HARDER) - type "breakout"', area: 'terminal' },
    { id: 'tetris', icon: '&#127184;', name: 'Tetris', hint: 'Unlock at 26 discoveries (HARDER) - type "tetris"', area: 'terminal' },
    { id: 'pong', icon: '&#127955;', name: 'Pong', hint: 'Unlock at 30 discoveries (VERY HARD) - type "pong"', area: 'terminal' },
    { id: 'whack', icon: '&#128028;', name: 'Whack-a-Bug', hint: 'Unlock at 33 discoveries (VERY HARD) - type "whack"', area: 'terminal' },
    { id: 'minesweeper', icon: '&#128163;', name: 'Minesweeper', hint: 'Unlock at 36 discoveries (EXTREME) - type "minesweeper"', area: 'terminal' },
    { id: '2048', icon: '&#128318;', name: '2048', hint: 'Unlock at 38 discoveries (EXTREME) - type "2048"', area: 'terminal' },
    { id: 'simon', icon: '&#127911;', name: 'Simon Says', hint: 'Available after exploration starts', area: 'terminal' },
    { id: 'reaction', icon: '&#9889;', name: 'Reaction Test', hint: 'Available after exploration starts', area: 'terminal' },
    { id: 'shooter', icon: '&#128165;', name: 'Target Shooter', hint: 'Available after exploration starts', area: 'terminal' },
    { id: 'math', icon: '&#127912;', name: 'Math Sprint', hint: 'Available after exploration starts', area: 'terminal' }
  ];

  var treasureMapOverlay = document.getElementById('treasureMapOverlay');
  var treasureMapClose = document.getElementById('treasureMapClose');
  var treasureGrid = document.getElementById('treasureGrid');
  var treasureHints = document.getElementById('treasureHints');
  var treasureSparkles = document.getElementById('treasureSparkles');

  function showTreasureMap() {
    renderTreasureMap();
    treasureMapOverlay.classList.remove('hidden');
  }

  function closeTreasureMap() {
    treasureMapOverlay.classList.add('hidden');
  }

  function renderTreasureMap() {
    treasureGrid.innerHTML = '';

    TREASURE_DATA.forEach(function (treasure) {
      var found = discoveries[treasure.id];
      var item = document.createElement('div');
      item.className = 'treasure-item';

      if (found) {
        item.classList.add('found');
      }

      var locked = false;
      if (treasure.id === 'snake' && !discoveries['snake_unlock']) locked = true;
      if (treasure.id === 'hack' && !discoveries['hack_unlock']) locked = true;
      if (treasure.id === 'type' && !discoveries['type_unlock']) locked = true;
      if (treasure.id === 'memory' && !discoveries['memory_unlock']) locked = true;
      if (treasure.id === 'quiz' && !discoveries['quiz_unlock']) locked = true;
      if (treasure.id === 'breakout' && !discoveries['breakout_unlock']) locked = true;
      if (treasure.id === 'tetris' && !discoveries['tetris_unlock']) locked = true;
      if (treasure.id === 'pong' && !discoveries['pong_unlock']) locked = true;
      if (treasure.id === 'whack' && !discoveries['whack_unlock']) locked = true;
      if (treasure.id === 'minesweeper' && !discoveries['minesweeper_unlock']) locked = true;
      if (treasure.id === '2048' && !discoveries['game2048_unlock']) locked = true;

      if (locked && !found) {
        item.classList.add('locked');
      }

      item.innerHTML =
        '<span class="treasure-icon">' + treasure.icon + '</span>' +
        '<div class="treasure-name">' + treasure.name + '</div>' +
        '<div class="treasure-hint">' + (found ? '✓ FOUND!' : locked ? '🔒 Locked - Explore more!' : treasure.hint) + '</div>';

      treasureGrid.appendChild(item);
    });

    generateTreasureHints();
  }

  function generateTreasureHints() {
    var hints = [];

    hints.push('<div class="treasure-hints-title">&#128161; HUNT PROGRESS</div>');
    hints.push('<div class="treasure-hint-text">Found: ' + discoveryOrder.length + ' / ' + TREASURE_DATA.length + '</div>');

    if (discoveryOrder.length < 5) {
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Try typing <span class="cmd-hint">help</span> to see commands</div>');
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Type <span class="cmd-hint">about</span>, <span class="cmd-hint">skills</span>, <span class="cmd-hint">projects</span></div>');
    } else if (discoveryOrder.length < 10) {
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Try <span class="cmd-hint">scan</span> to analyze profile</div>');
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Type <span class="cmd-hint">ls</span> and <span class="cmd-hint">cat secret.zip</span></div>');
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Click social icons in hero section</div>');
    } else if (discoveryOrder.length < 15) {
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Try <span class="cmd-hint">whoami</span> and <span class="cmd-hint">sudo</span></div>');
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Type <span class="cmd-hint">matrix</span> for digital rain</div>');
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Konami code: ↑↑↓↓←→←→BA</div>');
    } else if (discoveryOrder.length < 20) {
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Play games to find more secrets!</div>');
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Each game rewards exploration</div>');
    } else {
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> You\'re close to completing the hunt!</div>');
    }

    var nextUnlock = getNextGameUnlock();
    if (nextUnlock) {
      hints.push('<div class="treasure-hint-text"><span class="hint-arrow">→</span> Next game: ' + nextUnlock.game + ' (' + nextUnlock.count + ' discoveries)</div>');
    }

    treasureHints.innerHTML = hints.join('');
  }

  function getNextGameUnlock() {
    var count = discoveryOrder.length;
    if (count < 1) return { game: 'Snake (EASY!)', count: 1 };
    if (count < 5) return { game: 'Hack', count: 5 };
    if (count < 10) return { game: 'Type Speed (HARD)', count: 10 };
    if (count < 14) return { game: 'Memory (HARD)', count: 14 };
    if (count < 18) return { game: 'Quiz (HARD)', count: 18 };
    if (count < 22) return { game: 'Breakout (HARDER)', count: 22 };
    if (count < 26) return { game: 'Tetris (HARDER)', count: 26 };
    if (count < 30) return { game: 'Pong (VERY HARD)', count: 30 };
    if (count < 33) return { game: 'Whack-a-Bug (VERY HARD)', count: 33 };
    if (count < 36) return { game: 'Minesweeper (EXTREME)', count: 36 };
    if (count < 38) return { game: '2048 (EXTREME)', count: 38 };
    return null;
  }

  treasureMapClose.addEventListener('click', closeTreasureMap);

  treasureMapOverlay.addEventListener('click', function (e) {
    if (e.target === treasureMapOverlay) {
      closeTreasureMap();
    }
  });

  // ===== SCOREBOARD FUNCTIONS =====
  var scoreboardOverlay = document.getElementById('scoreboardOverlay');
  var scoreboardClose = document.getElementById('scoreboardClose');
  var scoreboardContent = document.getElementById('scoreboardContent');
  var scoreboardBtn = document.getElementById('scoreboardBtn');

  function showScoreboard() {
    renderScoreboardTab('games');
    scoreboardOverlay.classList.remove('hidden');
  }

  function closeScoreboard() {
    scoreboardOverlay.classList.add('hidden');
  }

  function renderScoreboardTab(tab) {
    var html = '';
    if (tab === 'games') {
      html = Scoreboard.renderGamesTab();
    } else if (tab === 'stats') {
      html = Scoreboard.renderStatsTab();
    } else if (tab === 'achievements') {
      html = Scoreboard.renderAchievementsTab();
    }
    scoreboardContent.innerHTML = html;

    document.querySelectorAll('.scoreboard-tab').forEach(function (tabEl) {
      tabEl.classList.remove('active');
      if (tabEl.dataset.tab === tab) {
        tabEl.classList.add('active');
      }
    });
  }

  scoreboardClose.addEventListener('click', closeScoreboard);

  scoreboardOverlay.addEventListener('click', function (e) {
    if (e.target === scoreboardOverlay) {
      closeScoreboard();
    }
  });

  if (scoreboardBtn) {
    scoreboardBtn.addEventListener('click', function () {
      SoundManager.playClick();
      showScoreboard();
    });
  }

  document.querySelectorAll('.scoreboard-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      SoundManager.playClick();
      renderScoreboardTab(this.dataset.tab);
    });
  });

  // ===== SOUND TOGGLE =====
  var soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', function () {
      var enabled = SoundManager.toggle();
      soundToggle.classList.toggle('muted', !enabled);
      SoundManager.playClick();
    });
    soundToggle.classList.toggle('muted', !SoundManager.isEnabled());
  }

  // ===== TREASURE BUTTON =====
  var treasureBtn = document.getElementById('treasureBtn');
  if (treasureBtn) {
    treasureBtn.addEventListener('click', function () {
      SoundManager.playClick();
      showTreasureMap();
    });
  }

  // ===== ADD VISUAL HINTS =====
  function addVisualHints() {
    if (discoveryOrder.length >= 5) return;

    var heroSocial = document.querySelector('.hero-social');
    if (heroSocial && !discoveries['linkedin']) {
      heroSocial.classList.add('clue-glow');
    }

    var terminal = document.getElementById('mainTerminal');
    if (terminal && bootComplete && discoveryOrder.length < 3) {
      terminal.classList.add('clue-glow');
    }
  }

  setTimeout(addVisualHints, 3000);

  // ===== VISUAL EFFECTS =====
  function screenShake() {
    document.body.classList.add('shake');
    setTimeout(function () {
      document.body.classList.remove('shake');
    }, 500);
  }

  function particleBurst(x, y, color) {
    var burst = document.createElement('div');
    burst.className = 'particle-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);

    for (var i = 0; i < 12; i++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      var angle = (i / 12) * Math.PI * 2;
      var distance = 50 + Math.random() * 50;
      var tx = Math.cos(angle) * distance;
      var ty = Math.sin(angle) * distance;
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      if (color) {
        particle.style.background = color;
        particle.style.boxShadow = '0 0 8px ' + color;
      }
      burst.appendChild(particle);
    }

    setTimeout(function () {
      document.body.removeChild(burst);
    }, 800);
  }

  function textGlitch(element) {
    element.classList.add('text-glitch');
  }

  // ===== CONFETTI SYSTEM =====
  var confettiCanvas = document.getElementById('confettiCanvas');
  var confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  var confettiParticles = [];
  var confettiAnimating = false;

  function createConfetti() {
    confettiParticles = [];
    for (var i = 0; i < 50; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: ['#ffe600', '#00f0ff', '#ff00ff', '#39ff14'][Math.floor(Math.random() * 4)],
        size: Math.random() * 6 + 4
      });
    }
  }

  function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach(function (p) {
      p.y += p.vy;
      p.x += p.vx;
      p.rotation += p.rotationSpeed;

      if (p.y > confettiCanvas.height) {
        p.y = -10;
        p.x = Math.random() * confettiCanvas.width;
      }

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation * Math.PI / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      confettiCtx.restore();
    });

    if (confettiAnimating) {
      requestAnimationFrame(updateConfetti);
    }
  }

  function startConfetti() {
    if (!confettiCtx) return;
    var popup = document.getElementById('achievementPopup');
    confettiCanvas.width = popup.offsetWidth;
    confettiCanvas.height = popup.offsetHeight;
    createConfetti();
    confettiAnimating = true;
    updateConfetti();
  }

  function stopConfetti() {
    confettiAnimating = false;
    if (confettiCtx) {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var sections = document.querySelectorAll('.section, .hero');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  var activeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-links a').forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(function (section) {
    activeObserver.observe(section);
  });

  // ===== PARTICLES =====
  var particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (var i = 0; i < 25; i++) {
      var particle = document.createElement('div');
      particle.classList.add('particle');
      var size = Math.floor(Math.random() * 4 + 2);
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 12) + 's';
      if (Math.random() > 0.7) {
        particle.style.background = '#ff00ff';
        particle.style.boxShadow = '0 0 4px rgba(255, 0, 255, 0.6)';
      }
      particlesContainer.appendChild(particle);
    }
  }

  // ===== TYPEWRITER =====
  var typewriterEl = document.getElementById('typewriter');
  var twText = 'Built from thought. Finished with care.';
  var twIndex = 0;

  function typeWriter() {
    if (twIndex < twText.length) {
      typewriterEl.textContent += twText.charAt(twIndex);
      twIndex++;
      setTimeout(typeWriter, 70 + Math.random() * 50);
    }
  }

  setTimeout(typeWriter, 1200);

  // ===== KONAMI CODE =====
  var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var konamiIndex = 0;

  document.addEventListener('keydown', function (e) {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        document.body.style.animation = 'glitch 0.3s ease 5';
        discover('konami');
        showAchievement('SECRET CODE DETECTED!');
        setTimeout(function () {
          document.body.style.animation = '';
        }, 1500);
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // ===== DISCOVERY SYSTEM =====
  var discoveries = {};
  var discoveryOrder = [];
  var MAX_DISCOVERIES = 40;

  var navDiscFill = document.getElementById('navDiscFill');
  var navDiscValue = document.getElementById('navDiscValue');
  var terminalDiscovery = document.getElementById('terminalDiscovery');

  function discover(name) {
    if (discoveries[name]) return;
    discoveries[name] = true;
    discoveryOrder.push(name);
    updateDiscoveryBar();
    checkUnlocks();

    // Remove glow effects when discovered
    if (name === 'linkedin' || name === 'github' || name === 'twitter') {
      var heroSocial = document.querySelector('.hero-social');
      if (heroSocial) heroSocial.classList.remove('clue-glow');
    }
    if (name === 'help' || name === 'about' || name === 'skills') {
      var terminal = document.getElementById('mainTerminal');
      if (terminal) terminal.classList.remove('clue-glow');
    }

    // Show hint for treasure map after first discovery
    if (discoveryOrder.length === 1 && !discoveries['treature']) {
      setTimeout(function () {
        if (bootComplete) {
          addTermLine('', '');
          addTermLine('  💡 Pro tip: Type <span class="cmd-hint">treasure</span> to see all secrets!', 'info');
        }
      }, 2000);
    }
  }

  function updateDiscoveryBar() {
    var count = discoveryOrder.length;
    var pct = Math.min(Math.round((count / MAX_DISCOVERIES) * 100), 100);
    navDiscFill.style.width = pct + '%';
    navDiscValue.textContent = pct + '%';
    terminalDiscovery.textContent = pct + '% explored';
  }

  function checkUnlocks() {
    var count = discoveryOrder.length;
    if (count >= 1 && !discoveries['snake_unlock']) {
      discoveries['snake_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">snake</span> ***', 'unlock');
      showAchievement('SNAKE GAME UNLOCKED!');
    }
    if (count >= 5 && !discoveries['hack_unlock']) {
      discoveries['hack_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">hack</span> ***', 'unlock');
      showAchievement('HACK MINI-GAME UNLOCKED!');
    }
    if (count >= 10 && !discoveries['type_unlock']) {
      discoveries['type_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">type</span> ***', 'unlock');
      showAchievement('TYPING GAME UNLOCKED!');
    }
    if (count >= 14 && !discoveries['memory_unlock']) {
      discoveries['memory_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">memory</span> ***', 'unlock');
      showAchievement('MEMORY GAME UNLOCKED!');
    }
    if (count >= 18 && !discoveries['quiz_unlock']) {
      discoveries['quiz_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">quiz</span> ***', 'unlock');
      showAchievement('QUIZ GAME UNLOCKED!');
    }
    if (count >= 22 && !discoveries['breakout_unlock']) {
      discoveries['breakout_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">breakout</span> ***', 'unlock');
      showAchievement('BREAKOUT GAME UNLOCKED!');
    }
    if (count >= 26 && !discoveries['tetris_unlock']) {
      discoveries['tetris_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">tetris</span> ***', 'unlock');
      showAchievement('TETRIS GAME UNLOCKED!');
    }
    if (count >= 30 && !discoveries['pong_unlock']) {
      discoveries['pong_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">pong</span> ***', 'unlock');
      showAchievement('PONG GAME UNLOCKED!');
    }
    if (count >= 33 && !discoveries['whack_unlock']) {
      discoveries['whack_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">whack</span> ***', 'unlock');
      showAchievement('WHACK-A-BUG UNLOCKED!');
    }
    if (count >= 36 && !discoveries['minesweeper_unlock']) {
      discoveries['minesweeper_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">minesweeper</span> ***', 'unlock');
      showAchievement('MINESWEEPER UNLOCKED!');
    }
    if (count >= 38 && !discoveries['game2048_unlock']) {
      discoveries['game2048_unlock'] = true;
      addTermLine('', '');
      addTermLine('  *** NEW COMMAND UNLOCKED: <span class="cmd-hint">2048</span> ***', 'unlock');
      showAchievement('2048 GAME UNLOCKED!');
    }
    if (count >= MAX_DISCOVERIES && !discoveries['complete']) {
      discoveries['complete'] = true;
      addTermLine('', '');
      addTermLine('  *** SYSTEM FULLY EXPLORED ***', 'unlock');
      addTermLine('  You have discovered everything. You are a legend.', 'success');
      showAchievement('100% COMPLETE - LEGENDARY EXPLORER!');
    }
  }

  // ===== ACHIEVEMENTS =====
  var achievementEl = document.getElementById('achievementPopup');
  var achievementText = document.getElementById('achievementText');
  var achievementTimeout;

  function showAchievement(msg) {
    achievementText.textContent = msg;
    achievementEl.classList.add('show');
    startConfetti();
    SoundManager.playAchievement();
    clearTimeout(achievementTimeout);
    achievementTimeout = setTimeout(function () {
      achievementEl.classList.remove('show');
      stopConfetti();
    }, 3000);
  }

  // ===== SCOREBOARD SYSTEM =====
  var Scoreboard = (function () {
    var SCORES_KEY = 'cyberpunk_scores';
    var STATS_KEY = 'cyberpunk_stats';
    var ACHIEVEMENTS_KEY = 'cyberpunk_achievements';

    var gameConfigs = [
      { id: 'snake', name: 'Snake', icon: '&#127943;', scoreKey: 'snakeHiScore' },
      { id: 'hack', name: 'Hack', icon: '&#128165;', scoreKey: 'hackBest' },
      { id: 'type', name: 'Type Speed', icon: '&#9889;', scoreKey: 'typeBest' },
      { id: 'memory', name: 'Memory', icon: '&#128466;', scoreKey: 'memoryBest' },
      { id: 'quiz', name: 'Quiz', icon: '&#10067;', scoreKey: 'quizBest' },
      { id: 'breakout', name: 'Breakout', icon: '&#127919;', scoreKey: 'breakoutBest' },
      { id: 'tetris', name: 'Tetris', icon: '&#127184;', scoreKey: 'tetrisBest' },
      { id: 'pong', name: 'Pong', icon: '&#127955;', scoreKey: 'pongBest' },
      { id: 'whack', name: 'Whack-a-Bug', icon: '&#128028;', scoreKey: 'whackBest' },
      { id: 'minesweeper', name: 'Minesweeper', icon: '&#128163;', scoreKey: 'minesweeperBest' },
      { id: '2048', name: '2048', icon: '&#128318;', scoreKey: 'best2048' },
      { id: 'simon', name: 'Simon', icon: '&#127911;', scoreKey: 'simonBest' },
      { id: 'reaction', name: 'Reaction', icon: '&#9889;', scoreKey: 'reactionBest' },
      { id: 'shooter', name: 'Shooter', icon: '&#128165;', scoreKey: 'shooterBest' },
      { id: 'math', name: 'Math', icon: '&#127912;', scoreKey: 'mathBest' }
    ];

    var achievements = [
      { id: 'first_game', name: 'First Steps', desc: 'Play your first game', icon: '&#127919;', unlocked: false },
      { id: 'score_100', name: 'Century', desc: 'Score 100+ points in any game', icon: '&#127942;', unlocked: false },
      { id: 'snake_100', name: 'Snake Charmer', desc: 'Score 100+ in Snake', icon: '&#127943;', unlocked: false },
      { id: 'perfect_accuracy', name: 'Perfect Aim', desc: '100% accuracy in Shooter', icon: '&#128165;', unlocked: false },
      { id: 'type_500', name: 'Speed Demon', desc: 'Type 500+ points', icon: '&#9889;', unlocked: false },
      { id: 'memory_12_moves', name: 'Eidetic Memory', desc: 'Clear Memory in 12 moves', icon: '&#128466;', unlocked: false },
      { id: 'quiz_perfect', name: 'Quiz Master', desc: 'Perfect quiz score', icon: '&#10067;', unlocked: false },
      { id: 'tetris_1000', name: 'Tetris Master', desc: 'Score 1000+ in Tetris', icon: '&#127184;', unlocked: false },
      { id: 'pong_win', name: 'Pong Champion', desc: 'Beat the CPU in Pong', icon: '&#127955;', unlocked: false },
      { id: 'whack_200', name: 'Bug Hunter', desc: 'Score 200+ in Whack-a-Bug', icon: '&#128028;', unlocked: false },
      { id: 'minesweeper_complete', name: 'Deminer', desc: 'Complete Minesweeper', icon: '&#128163;', unlocked: false },
      { id: '2048_win', name: 'Number Cruncher', desc: 'Reach 2048 tile', icon: '&#128318;', unlocked: false },
      { id: 'explorer_10', name: 'Explorer', desc: 'Discover 10 secrets', icon: '&#128726;', unlocked: false },
      { id: 'explorer_25', name: 'Pathfinder', desc: 'Discover 25 secrets', icon: '&#127919;', unlocked: false },
      { id: 'games_5', name: 'Gamer', desc: 'Play 5 different games', icon: '&#127918;', unlocked: false }
    ];

    function getScores() {
      var stored = localStorage.getItem(SCORES_KEY);
      return stored ? JSON.parse(stored) : {};
    }

    function saveScore(gameId, score) {
      var scores = getScores();
      if (!scores[gameId] || score > scores[gameId]) {
        scores[gameId] = score;
        localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
        return true;
      }
      return false;
    }

    function getScore(gameId) {
      var scores = getScores();
      return scores[gameId] || 0;
    }

    function getAllScores() {
      var result = [];
      gameConfigs.forEach(function (config) {
        var score = localStorage.getItem(config.scoreKey);
        if (score) {
          result.push({
            game: config,
            score: parseInt(score) || 0
          });
        }
      });
      result.sort(function (a, b) { return b.score - a.score; });
      return result;
    }

    function getStats() {
      var stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');

      var gamesPlayed = parseInt(stats.gamesPlayed || 0);
      var totalScore = parseInt(stats.totalScore || 0);
      var totalTime = parseInt(stats.totalTime || 0);
      var gamesPlayedList = stats.gamesPlayedList || [];

      return {
        gamesPlayed: gamesPlayed,
        totalScore: totalScore,
        totalTime: totalTime,
        gamesPlayedList: gamesPlayedList,
        uniqueGames: gamesPlayedList.length
      };
    }

    function updateStats(gameId, score, timeSpent) {
      var stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
      stats.gamesPlayed = (parseInt(stats.gamesPlayed || 0) + 1).toString();
      stats.totalScore = (parseInt(stats.totalScore || 0) + score).toString();
      stats.totalTime = (parseInt(stats.totalTime || 0) + timeSpent).toString();
      stats.gamesPlayedList = stats.gamesPlayedList || [];
      if (stats.gamesPlayedList.indexOf(gameId) === -1) {
        stats.gamesPlayedList.push(gameId);
      }
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));

      checkAchievements();
    }

    function getAchievements() {
      var stored = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (stored) {
        var unlocked = JSON.parse(stored);
        achievements.forEach(function (ach) {
          if (unlocked.indexOf(ach.id) !== -1) {
            ach.unlocked = true;
          }
        });
      }
      return achievements;
    }

    function unlockAchievement(achievementId) {
      var stored = localStorage.getItem(ACHIEVEMENTS_KEY);
      var unlocked = stored ? JSON.parse(stored) : [];

      if (unlocked.indexOf(achievementId) === -1) {
        unlocked.push(achievementId);
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));

        var achievement = achievements.find(function (a) { return a.id === achievementId; });
        if (achievement) {
          showAchievement(achievement.name + ': ' + achievement.desc);
          SoundManager.playAchievement();
        }

        return true;
      }
      return false;
    }

    function checkAchievements() {
      var stats = getStats();
      var scores = getScores();

      if (stats.gamesPlayed >= 1) unlockAchievement('first_game');
      if (stats.totalScore >= 100) unlockAchievement('score_100');
      if (scores.snake >= 100) unlockAchievement('snake_100');
      if (scores.type >= 500) unlockAchievement('type_500');
      if (scores.quiz >= 100) unlockAchievement('quiz_perfect');
      if (scores.tetris >= 1000) unlockAchievement('tetris_1000');
      if (scores.whack >= 200) unlockAchievement('whack_200');
      if (discoveryOrder.length >= 10) unlockAchievement('explorer_10');
      if (discoveryOrder.length >= 25) unlockAchievement('explorer_25');
      if (stats.uniqueGames >= 5) unlockAchievement('games_5');
    }

    function renderGamesTab() {
      var scores = getAllScores();
      var html = '<div class="score-list">';

      if (scores.length === 0) {
        html += '<div class="score-item"><div class="score-game-info" style="text-align:center;width:100%;padding:2rem;">';
        html += '<p style="font-family:var(--pixel);font-size:0.5rem;color:var(--text-dim);">';
        html += 'No scores yet! Play some games to set records.</p></div></div>';
      } else {
        scores.forEach(function (item, index) {
          var rank = index + 1;
          var rankClass = '';
          if (rank === 1) rankClass = 'rank-1';
          else if (rank === 2) rankClass = 'rank-2';
          else if (rank === 3) rankClass = 'rank-3';

          html += '<div class="score-item ranked-' + rank + '">';
          html += '<div class="score-rank ' + rankClass + '">#' + rank + '</div>';
          html += '<div class="score-game-icon">' + item.game.icon + '</div>';
          html += '<div class="score-game-info">';
          html += '<div class="score-game-name">' + item.game.name + '</div>';
          html += '<div class="score-game-stat">Personal Best</div>';
          html += '</div>';
          html += '<div class="score-value">' + item.score.toLocaleString() + '</div>';
          html += '</div>';
        });
      }

      html += '</div>';
      return html;
    }

    function renderStatsTab() {
      var stats = getStats();
      var hoursPlayed = Math.floor(stats.totalTime / 3600000);
      var minutesPlayed = Math.floor((stats.totalTime % 3600000) / 60000);

      var html = '<div class="stats-grid">';
      html += '<div class="stat-box">';
      html += '<div class="stat-value">' + stats.gamesPlayed + '</div>';
      html += '<div class="stat-label">GAMES PLAYED</div>';
      html += '</div>';

      html += '<div class="stat-box">';
      html += '<div class="stat-value">' + stats.uniqueGames + '</div>';
      html += '<div class="stat-label">UNIQUE GAMES</div>';
      html += '</div>';

      html += '<div class="stat-box">';
      html += '<div class="stat-value">' + stats.totalScore.toLocaleString() + '</div>';
      html += '<div class="stat-label">TOTAL POINTS</div>';
      html += '</div>';

      html += '<div class="stat-box">';
      html += '<div class="stat-value">' + (hoursPlayed > 0 ? hoursPlayed + 'h' : '') + (minutesPlayed > 0 ? minutesPlayed + 'm' : '0m') + '</div>';
      html += '<div class="stat-label">TIME PLAYED</div>';
      html += '</div>';

      var scores = getAllScores();
      var topGame = scores.length > 0 ? scores[0].game.name : 'None';
      var topScore = scores.length > 0 ? scores[0].score : 0;

      html += '<div class="stat-box">';
      html += '<div class="stat-value" style="font-size:0.8rem;">' + topGame + '</div>';
      html += '<div class="stat-label">BEST GAME</div>';
      html += '</div>';

      html += '<div class="stat-box">';
      html += '<div class="stat-value">' + discoveryOrder.length + '</div>';
      html += '<div class="stat-label">SECRETS FOUND</div>';
      html += '</div>';

      html += '</div>';
      return html;
    }

    function renderAchievementsTab() {
      var achievementList = getAchievements();
      var unlockedCount = achievementList.filter(function (a) { return a.unlocked; }).length;

      var html = '<div style="margin-bottom:1.5rem;text-align:center;">';
      html += '<span style="font-family:var(--pixel);font-size:0.5rem;color:var(--text-dim);">';
      html += 'Progress: ' + unlockedCount + ' / ' + achievementList.length + '</span></div>';

      html += '<div class="achievement-list">';
      achievementList.forEach(function (ach) {
        html += '<div class="achievement-item ' + (ach.unlocked ? 'unlocked' : 'locked') + '">';
        html += '<div class="achievement-icon">' + ach.icon + '</div>';
        html += '<div class="achievement-info">';
        html += '<div class="achievement-name">' + ach.name + '</div>';
        html += '<div class="achievement-desc">' + ach.desc + '</div>';
        html += '</div>';
        html += '<div class="score-value" style="min-width:40px;font-size:0.6rem;">';
        html += ach.unlocked ? '&#10003;' : '&#128274;';
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';
      return html;
    }

    return {
      saveScore: saveScore,
      getScore: getScore,
      getScores: getScores,
      getAllScores: getAllScores,
      updateStats: updateStats,
      getStats: getStats,
      getAchievements: getAchievements,
      unlockAchievement: unlockAchievement,
      checkAchievements: checkAchievements,
      renderGamesTab: renderGamesTab,
      renderStatsTab: renderStatsTab,
      renderAchievementsTab: renderAchievementsTab
    };
  })();

  // ===== INTERACTIVE TERMINAL =====
  var terminalInput = document.getElementById('terminalInput');
  var terminalOutput = document.getElementById('terminalOutput');
  var terminalBody = document.getElementById('terminalBody');
  var terminalInputLine = document.getElementById('terminalInputLine');
  var gamePanel = document.getElementById('gamePanel');
  var hackPanel = document.getElementById('hackPanel');
  var mainTerminal = document.getElementById('mainTerminal');
  var commandHistory = [];
  var historyIndex = -1;
  var bootComplete = false;

  function addTermLine(text, cls) {
    var line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function addCmdEcho(cmd) {
    addTermLine('<span class="prompt">&gt;</span> ' + escapeHtml(cmd));
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function clearTerminal() {
    terminalOutput.innerHTML = '';
  }

  // ===== BOOT SEQUENCE =====
  function bootSequence() {
    var bootLines = [
      { text: 'BOOTING SYSTEM...', cls: 'system', delay: 300 },
      { text: 'Loading kernel modules... OK', cls: '', delay: 250 },
      { text: 'Initializing display... OK', cls: '', delay: 200 },
      { text: 'Mounting /home/irshad... OK', cls: '', delay: 350 },
      { text: 'Scanning network... OK', cls: '', delay: 200 },
      { text: '', cls: '', delay: 100 },
      { text: 'IRSHAD PC v3.0 — TERMINAL READY', cls: 'system', delay: 300 },
      { text: 'Type <span class="cmd-hint">help</span> to see available commands.', cls: '', delay: 0 },
      { text: 'Type <span class="cmd-hint">snake</span> to play immediately! &#127943; (Other games require exploration)', cls: 'info', delay: 0 },
      { text: 'Type <span class="cmd-hint">treasure</span> to see all secrets! &#128726;', cls: 'info', delay: 0 },
    ];

    var totalDelay = 0;
    bootLines.forEach(function (item) {
      totalDelay += item.delay;
      setTimeout(function () {
        addTermLine(item.text, item.cls);
      }, totalDelay);
    });

    setTimeout(function () {
      terminalInput.disabled = false;
      terminalInput.focus();
      bootComplete = true;
      discover('boot');
    }, totalDelay + 200);
  }

  var aboutObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !bootComplete) {
          bootSequence();
          aboutObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  aboutObserver.observe(document.getElementById('about'));

  // ===== SCAN COMMAND =====
  var scanDone = false;

  function runScan() {
    if (scanDone) {
      addTermLine('Scan already completed. Data on file.', 'info');
      return;
    }
    addTermLine('Initiating system scan...', 'system');
    discover('scan');

    setTimeout(function () {
      scanDone = true;
      addTermLine('', '');
      addTermLine('SCAN RESULTS:', 'system');
      addTermLine('  Subject: Irshad PC');
      addTermLine('  Classification: Software Engineer');
      addTermLine('  Location: India');
      addTermLine('  Specialization: Full-stack development');
      addTermLine('  Status: Actively building cool things');
      addTermLine('  Threat level: None (friendly)');
      addTermLine('', '');
      addTermLine('An enthusiast with deep appreciation for', '');
      addTermLine('mathematics and computer science. Always', '');
      addTermLine('exploring innovative techniques.', '');
    }, 1000);
  }

  // ===== SKILL BARS =====
  var skillsShown = false;

  function showSkills() {
    if (skillsShown) {
      addTermLine('Skills already displayed. Type <span class="cmd-hint">skills</span> to view.', 'info');
      return;
    }

    addTermLine('TECH STACK ANALYSIS:', 'system');
    addTermLine('', '');

    var skills = [
      { name: 'FRONTEND', pct: 90, color: 'cyan' },
      { name: 'BACKEND', pct: 80, color: 'green' },
      { name: 'DATABASE', pct: 70, color: 'magenta' },
      { name: 'DEVOPS', pct: 65, color: 'yellow' },
      { name: 'MOBILE', pct: 55, color: 'red' },
    ];

    skills.forEach(function (skill) {
      var bar = document.createElement('div');
      bar.className = 'skill-bar-term';
      bar.innerHTML =
        '<span class="skill-bar-name">' + skill.name + '</span>' +
        '<span class="skill-bar-track"><span class="skill-bar-fill ' + skill.color + '" data-pct="' + skill.pct + '"></span></span>';
      terminalOutput.appendChild(bar);
    });

    addTermLine('', '');
    addTermLine('  React, Vue, TypeScript, JS', '');
    addTermLine('  Node.js, Python, Go', '');
    addTermLine('  PostgreSQL, MongoDB, Redis', '');
    addTermLine('  Docker, AWS, CI/CD', '');
    addTermLine('  React Native, Flutter', '');

    terminalBody.scrollTop = terminalBody.scrollHeight;

    setTimeout(function () {
      document.querySelectorAll('.skill-bar-fill').forEach(function (fill) {
        fill.style.width = fill.getAttribute('data-pct') + '%';
      });
    }, 100);

    skillsShown = true;
    discover('skills');
  }

  // ===== MATRIX RAIN =====
  var matrixOverlay = document.getElementById('matrixOverlay');
  var matrixCanvas = document.getElementById('matrixCanvas');
  var matrixCtx = matrixCanvas.getContext('2d');
  var matrixRunning = false;
  var matrixAnimId = null;

  function startMatrix() {
    if (matrixRunning) {
      stopMatrix();
      return;
    }
    matrixRunning = true;
    matrixOverlay.classList.remove('hidden');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    var cols = Math.floor(matrixCanvas.width / 16);
    var drops = [];
    for (var i = 0; i < cols; i++) {
      drops[i] = Math.random() * -100;
    }

    var chars = 'IRSHADPC0123456789@#$%&*<>{}[]';
    discover('matrix');

    function drawMatrix() {
      matrixCtx.fillStyle = 'rgba(12, 12, 29, 0.1)';
      matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      matrixCtx.font = '14px "Press Start 2P", monospace';

      for (var c = 0; c < cols; c++) {
        var char = chars[Math.floor(Math.random() * chars.length)];
        var x = c * 16;
        var y = drops[c] * 16;
        matrixCtx.fillStyle = '#00f0ff';
        matrixCtx.shadowColor = 'rgba(0, 240, 255, 0.6)';
        matrixCtx.shadowBlur = 4;
        matrixCtx.fillText(char, x, y);
        matrixCtx.shadowBlur = 0;
        drops[c]++;
        if (drops[c] * 16 > matrixCanvas.height && Math.random() > 0.98) {
          drops[c] = 0;
        }
      }
      matrixAnimId = requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
    addTermLine('Matrix rain activated. Type <span class="cmd-hint">matrix</span> again to stop.', 'info');
  }

  function stopMatrix() {
    matrixRunning = false;
    matrixOverlay.classList.add('hidden');
    if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
    addTermLine('Matrix rain deactivated.', 'system');
  }

  // ===== HACK MINI-GAME =====
  var hackWords = [
    'javascript', 'react', 'python', 'docker', 'kubernetes',
    'typescript', 'nodejs', 'database', 'algorithm', 'function',
    'variable', 'terminal', 'compiler', 'network', 'protocol',
    'async', 'promise', 'deploy', 'serverless', 'recursive'
  ];
  var hackActive = false;
  var hackScore = 0;
  var hackBest = parseInt(localStorage.getItem('hackBest')) || 0;
  var hackTimerInterval = null;
  var hackTimeLeft = 0;
  var currentHackWord = '';
  var hackInputEl = document.getElementById('hackInput');
  var hackWordEl = document.getElementById('hackWord');
  var hackScoreEl = document.getElementById('hackScore');
  var hackBestEl = document.getElementById('hackBest');
  var hackTimerEl = document.getElementById('hackTimer');

  hackBestEl.textContent = hackBest;

  function startHack() {
    if (!discoveries['hack_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Hint: discover ' + (5 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    hackActive = true;
    hackScore = 0;
    hackScoreEl.textContent = '0';
    hackPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    nextHackWord();
    hackInputEl.disabled = false;
    hackInputEl.focus();
    startHackTimer(15);
    discover('hack');
  }

  function scrambleWord(word) {
    var arr = word.split('');
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr.join('');
  }

  function nextHackWord() {
    currentHackWord = hackWords[Math.floor(Math.random() * hackWords.length)];
    hackWordEl.textContent = scrambleWord(currentHackWord).toUpperCase();
    hackWordEl.className = 'hack-word';
    hackInputEl.value = '';
  }

  function startHackTimer(seconds) {
    hackTimeLeft = seconds;
    hackTimerEl.textContent = hackTimeLeft + 's';
    clearInterval(hackTimerInterval);
    hackTimerInterval = setInterval(function () {
      hackTimeLeft--;
      hackTimerEl.textContent = hackTimeLeft + 's';
      if (hackTimeLeft <= 0) {
        endHack();
      }
    }, 1000);
  }

  function endHack() {
    hackActive = false;
    clearInterval(hackTimerInterval);
    hackInputEl.disabled = true;
    SoundManager.playGameOver();

    if (hackScore > hackBest) {
      hackBest = hackScore;
      localStorage.setItem('hackBest', hackBest);
      hackBestEl.textContent = hackBest;
      Scoreboard.saveScore('hack', hackScore);
    }

    Scoreboard.updateStats('hack', hackScore, 0);

    addTermLine('HACK SESSION ENDED', 'system');
    addTermLine('Words decoded: ' + hackScore + ' | Best: ' + hackBest, 'info');
    if (hackScore >= 5) {
      addTermLine('Impressive decoding skills!', 'success');
    } else if (hackScore >= 3) {
      addTermLine('Not bad. Keep practicing.', 'info');
    } else {
      addTermLine('Better luck next time.', 'error');
    }
  }

  function closeHack() {
    hackActive = false;
    clearInterval(hackTimerInterval);
    hackInputEl.disabled = true;
    hackPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  hackInputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var answer = hackInputEl.value.trim().toLowerCase();
      if (answer === currentHackWord) {
        hackScore++;
        hackScoreEl.textContent = hackScore;
        hackWordEl.className = 'hack-word correct';
        SoundManager.playScore();
        setTimeout(nextHackWord, 300);
      } else {
        hackWordEl.className = 'hack-word wrong';
        SoundManager.playError();
        screenShake();
        setTimeout(function () {
          hackWordEl.className = 'hack-word';
          hackInputEl.value = '';
        }, 300);
      }
    } else if (e.key === 'Escape') {
      closeHack();
    }
  });

  document.getElementById('hackPanelClose').addEventListener('click', closeHack);

  // ===== TYPING GAME =====
  var typePanel = document.getElementById('typePanel');
  var typePanelClose = document.getElementById('typePanelClose');
  var typeOverlay = document.getElementById('typeOverlay');
  var typeStartBtn = document.getElementById('typeStartBtn');
  var typeInput = document.getElementById('typeInput');
  var fallingWordsContainer = document.getElementById('fallingWords');
  var typeWpmEl = document.getElementById('typeWpm');
  var typeAccuracyEl = document.getElementById('typeAccuracy');
  var typeScoreEl = document.getElementById('typeScore');

  var typeWords = [
    'function', 'const', 'let', 'var', 'async', 'await', 'promise',
    'callback', 'array', 'object', 'string', 'number', 'boolean',
    'react', 'component', 'state', 'props', 'hook', 'effect',
    'node', 'module', 'export', 'import', 'class', 'extend',
    'database', 'query', 'api', 'json', 'xml', 'html', 'css',
    'terminal', 'command', 'script', 'browser', 'server', 'client'
  ];

  var typeActive = false;
  var typeScore = 0;
  var typeCorrect = 0;
  var typeTotal = 0;
  var typeStartTime = 0;
  var typeWordsOnScreen = [];
  var typeSpawnInterval = null;
  var typeGameLoop = null;

  function startTypeGame() {
    if (!discoveries['type_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (7 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    typeActive = true;
    typeScore = 0;
    typeCorrect = 0;
    typeTotal = 0;
    typeWordsOnScreen = [];
    fallingWordsContainer.innerHTML = '';
    typeWpmEl.textContent = '0';
    typeAccuracyEl.textContent = '100%';
    typeScoreEl.textContent = '0';
    typePanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    typeOverlay.classList.remove('hidden');
    typeInput.disabled = true;
    discover('type');
  }

  function initTypeGame() {
    typeActive = true;
    typeStartTime = Date.now();
    typeOverlay.classList.add('hidden');
    typeInput.disabled = false;
    typeInput.focus();
    spawnTypeWord();
    typeSpawnInterval = setInterval(spawnTypeWord, 2500);
    typeGameLoop = setInterval(updateTypeGame, 100);
  }

  function spawnTypeWord() {
    if (!typeActive) return;
    var word = typeWords[Math.floor(Math.random() * typeWords.length)];
    var wordEl = document.createElement('div');
    wordEl.className = 'falling-word';
    wordEl.textContent = word;
    wordEl.dataset.word = word;
    wordEl.style.left = Math.random() * 60 + 20 + '%';
    wordEl.style.animationDuration = (8 + Math.random() * 4) + 's';
    fallingWordsContainer.appendChild(wordEl);
    typeWordsOnScreen.push({ element: wordEl, word: word, y: 0 });

    wordEl.addEventListener('animationend', function () {
      if (wordEl.classList.contains('matched')) return;
      wordEl.classList.add('missed');
      typeTotal++;
      typeAccuracyEl.textContent = typeTotal > 0 ? Math.round((typeCorrect / typeTotal) * 100) + '%' : '100%';
      setTimeout(function () {
        if (wordEl.parentNode) {
          wordEl.parentNode.removeChild(wordEl);
        }
        typeWordsOnScreen = typeWordsOnScreen.filter(function (w) { return w.element !== wordEl; });
      }, 300);
    });
  }

  function updateTypeGame() {
    if (!typeActive) return;

    var elapsed = (Date.now() - typeStartTime) / 1000 / 60;
    var wpm = elapsed > 0 ? Math.round(typeCorrect / elapsed) : 0;
    typeWpmEl.textContent = wpm;
  }

  function endTypeGame() {
    typeActive = false;
    clearInterval(typeSpawnInterval);
    clearInterval(typeGameLoop);
    typeInput.disabled = true;

    var elapsed = (Date.now() - typeStartTime) / 1000 / 60;
    var wpm = elapsed > 0 ? Math.round(typeCorrect / elapsed) : 0;

    Scoreboard.saveScore('type', typeScore);
    Scoreboard.updateStats('type', typeScore, Date.now() - typeStartTime);

    if (typeScore >= 500) {
      Scoreboard.unlockAchievement('type_500');
    }

    addTermLine('TYPING SESSION ENDED', 'system');
    addTermLine('WPM: ' + wpm + ' | Accuracy: ' + typeAccuracyEl.textContent + ' | Score: ' + typeScore, 'info');

    if (typeScore >= 100) {
      showAchievement('TYPE MASTER! Score: ' + typeScore);
    }
  }

  function closeTypeGame() {
    typeActive = false;
    clearInterval(typeSpawnInterval);
    clearInterval(typeGameLoop);
    typeInput.disabled = true;
    typePanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  typeInput.addEventListener('input', function () {
    var input = typeInput.value.trim().toLowerCase();
    typeWordsOnScreen.forEach(function (wordObj) {
      if (wordObj.word === input && !wordObj.element.classList.contains('matched')) {
        wordObj.element.classList.add('matched');
        typeScore += 10;
        typeCorrect++;
        typeTotal++;
        typeScoreEl.textContent = typeScore;
        typeAccuracyEl.textContent = Math.round((typeCorrect / typeTotal) * 100) + '%';
        SoundManager.playScore();
        particleBurst(
          wordObj.element.getBoundingClientRect().left + 50,
          wordObj.element.getBoundingClientRect().top,
          '#ffe600'
        );
        setTimeout(function () {
          if (wordObj.element.parentNode) {
            wordObj.element.parentNode.removeChild(wordObj.element);
          }
        }, 300);
        typeWordsOnScreen = typeWordsOnScreen.filter(function (w) { return w.element !== wordObj.element; });
        typeInput.value = '';
      }
    });
  });

  typeInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeTypeGame();
    }
  });

  typeStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initTypeGame();
  });

  typePanelClose.addEventListener('click', closeTypeGame);

  // ===== MEMORY GAME =====
  var memoryPanel = document.getElementById('memoryPanel');
  var memoryPanelClose = document.getElementById('memoryPanelClose');
  var memoryOverlay = document.getElementById('memoryOverlay');
  var memoryStartBtn = document.getElementById('memoryStartBtn');
  var memoryGrid = document.getElementById('memoryGrid');
  var memoryMovesEl = document.getElementById('memoryMoves');
  var memoryPairsEl = document.getElementById('memoryPairs');
  var memoryTimeEl = document.getElementById('memoryTime');

  var memorySymbols = ['{', '}', '<', '>', '/', '\\', '[', ']', '(', ')', ';', ':', '#', '$', '@', '!'];
  var memoryActive = false;
  var memoryCards = [];
  var memoryFlipped = [];
  var memoryMatched = 0;
  var memoryMoves = 0;
  var memoryTimer = null;
  var memorySeconds = 0;

  function startMemoryGame() {
    if (!discoveries['memory_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (9 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    memoryActive = true;
    memoryMatched = 0;
    memoryMoves = 0;
    memorySeconds = 0;
    memoryMovesEl.textContent = '0';
    memoryPairsEl.textContent = '0/8';
    memoryTimeEl.textContent = '0:00';
    memoryPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    memoryOverlay.classList.remove('hidden');
    discover('memory');
  }

  function initMemoryGame() {
    memoryActive = true;
    memoryOverlay.classList.add('hidden');

    var pairs = memorySymbols.slice(0, 8);
    memoryCards = pairs.concat(pairs).sort(function () { return Math.random() - 0.5; });

    memoryGrid.innerHTML = '';
    memoryCards.forEach(function (symbol, index) {
      var card = document.createElement('div');
      card.className = 'memory-card';
      card.textContent = '?';
      card.dataset.index = index;
      card.dataset.symbol = symbol;
      card.addEventListener('click', function () { flipCard(card); });
      memoryGrid.appendChild(card);
    });

    memoryTimer = setInterval(function () {
      memorySeconds++;
      var mins = Math.floor(memorySeconds / 60);
      var secs = memorySeconds % 60;
      memoryTimeEl.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    }, 1000);
  }

  function flipCard(card) {
    if (!memoryActive || memoryFlipped.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    memoryFlipped.push(card);
    SoundManager.playClick();

    if (memoryFlipped.length === 2) {
      memoryMoves++;
      memoryMovesEl.textContent = memoryMoves;
      checkMemoryMatch();
    }
  }

  function checkMemoryMatch() {
    var card1 = memoryFlipped[0];
    var card2 = memoryFlipped[1];

    if (card1.dataset.symbol === card2.dataset.symbol) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      memoryMatched++;
      memoryPairsEl.textContent = memoryMatched + '/8';
      memoryFlipped = [];
      SoundManager.playScore();
      particleBurst(
        card2.getBoundingClientRect().left + 30,
        card2.getBoundingClientRect().top + 30,
        '#ff8c00'
      );

      if (memoryMatched === 8) {
        endMemoryGame();
      }
    } else {
      setTimeout(function () {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '?';
        card2.textContent = '?';
        memoryFlipped = [];
      }, 1000);
    }
  }

  function endMemoryGame() {
    memoryActive = false;
    clearInterval(memoryTimer);

    var memoryScore = Math.max(0, 100 - memoryMoves * 2);
    Scoreboard.saveScore('memory', memoryScore);
    Scoreboard.updateStats('memory', memoryScore, memorySeconds * 1000);

    if (memoryMoves <= 12) {
      Scoreboard.unlockAchievement('memory_12_moves');
      showAchievement('MEMORY MASTER! Moves: ' + memoryMoves);
    }

    addTermLine('MEMORY GAME COMPLETE!', 'success');
    addTermLine('Moves: ' + memoryMoves + ' | Time: ' + memoryTimeEl.textContent, 'info');
  }

  function closeMemoryGame() {
    memoryActive = false;
    clearInterval(memoryTimer);
    memoryPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  memoryStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initMemoryGame();
  });

  memoryPanelClose.addEventListener('click', closeMemoryGame);

  // ===== QUIZ GAME =====
  var quizPanel = document.getElementById('quizPanel');
  var quizPanelClose = document.getElementById('quizPanelClose');
  var quizOverlay = document.getElementById('quizOverlay');
  var quizStartBtn = document.getElementById('quizStartBtn');
  var quizQuestionEl = document.getElementById('quizQuestion');
  var quizOptionsEl = document.getElementById('quizOptions');
  var quizScoreEl = document.getElementById('quizScore');
  var quizStreakEl = document.getElementById('quizStreak');
  var quizQuestionNumEl = document.getElementById('quizQuestionNum');

  var quizQuestions = [
    { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HighTech Modern Language', 'HyperTransfer Markup Language', 'Home Tool Markup Language'], a: 0 },
    { q: 'Which CSS property changes text color?', options: ['text-color', 'font-color', 'color', 'foreground'], a: 2 },
    { q: 'What is the correct way to declare a variable in ES6?', options: ['var myVar = 5', 'variable myVar = 5', 'let myVar = 5', 'v myVar = 5'], a: 2 },
    { q: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], a: 0 },
    { q: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Model', 'Digital Ordinance Model', 'Document Oriented Model'], a: 0 },
    { q: 'Which is NOT a JavaScript data type?', options: ['String', 'Boolean', 'Float', 'Undefined'], a: 2 },
    { q: 'What is the purpose of Git?', options: ['Database management', 'Version control', 'Web hosting', 'API testing'], a: 1 },
    { q: 'Which HTTP method is used to update data?', options: ['GET', 'POST', 'PUT', 'DELETE'], a: 2 },
    { q: 'What does REST stand for in APIs?', options: ['Representational State Transfer', 'Remote State Transfer', 'Resource State Transfer', 'Representational Service Transfer'], a: 0 },
    { q: 'Which is a valid JavaScript loop?', options: ['for', 'foreach', 'loop', 'iterate'], a: 0 },
    { q: 'What is closure in JavaScript?', options: ['Function with no return', 'Function with access to outer scope', 'Function that closes browser', 'Function with private variables'], a: 1 },
    { q: 'Which CSS unit is relative to font size?', options: ['px', 'em', 'vh', 'cm'], a: 1 },
    { q: 'What is npm?', options: ['Node Package Manager', 'New Project Manager', 'Native Process Module', 'Network Protocol Manager'], a: 0 },
    { q: 'Which symbol is used for comments in JavaScript?', options: ['<!-- -->', '#', '//', '**'], a: 2 },
    { q: 'What is the result of typeof []?', options: ['array', 'object', 'list', 'undefined'], a: 1 }
  ];

  var quizActive = false;
  var quizScore = 0;
  var quizStreak = 0;
  var quizCurrentQ = 0;
  var quizQuestionsList = [];
  var quizAnswered = false;

  function startQuizGame() {
    if (!discoveries['quiz_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (11 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    quizActive = true;
    quizScore = 0;
    quizStreak = 0;
    quizCurrentQ = 0;
    quizQuestionsList = quizQuestions.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 10);
    quizScoreEl.textContent = '0';
    quizStreakEl.textContent = '0';
    quizQuestionNumEl.textContent = '1/10';
    quizPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    quizOverlay.classList.remove('hidden');
    discover('quiz');
  }

  function initQuizGame() {
    quizActive = true;
    quizOverlay.classList.add('hidden');
    showQuizQuestion();
  }

  function showQuizQuestion() {
    if (quizCurrentQ >= quizQuestionsList.length) {
      endQuizGame();
      return;
    }

    quizAnswered = false;
    var question = quizQuestionsList[quizCurrentQ];
    quizQuestionEl.textContent = question.q;
    quizQuestionNumEl.textContent = (quizCurrentQ + 1) + '/10';

    quizOptionsEl.innerHTML = '';
    question.options.forEach(function (option, index) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = String.fromCharCode(65 + index) + '. ' + option;
      btn.addEventListener('click', function () { answerQuiz(index, btn); });
      quizOptionsEl.appendChild(btn);
    });
  }

  function answerQuiz(index, btn) {
    if (quizAnswered) return;
    quizAnswered = true;

    var question = quizQuestionsList[quizCurrentQ];
    var options = quizOptionsEl.querySelectorAll('.quiz-option');

    if (index === question.a) {
      btn.classList.add('correct');
      quizScore += 10 + quizStreak * 2;
      quizStreak++;
      quizScoreEl.textContent = quizScore;
      quizStreakEl.textContent = quizStreak;
      SoundManager.playScore();
      particleBurst(
        btn.getBoundingClientRect().left + 100,
        btn.getBoundingClientRect().top + 20,
        '#9b59b6'
      );
    } else {
      btn.classList.add('wrong');
      options[question.a].classList.add('correct');
      quizStreak = 0;
      quizStreakEl.textContent = '0';
      SoundManager.playError();
      screenShake();
    }

    setTimeout(function () {
      quizCurrentQ++;
      showQuizQuestion();
    }, 1500);
  }

  function endQuizGame() {
    quizActive = false;
    quizQuestionEl.textContent = 'QUIZ COMPLETE!';
    quizOptionsEl.innerHTML = '<p style="text-align:center;color:var(--purple);font-family:var(--pixel);font-size:0.6rem;">Final Score: ' + quizScore + '/100</p>';

    addTermLine('QUIZ COMPLETE! Final Score: ' + quizScore, 'system');

    if (quizScore >= 80) {
      showAchievement('QUIZ MASTER! Score: ' + quizScore);
    }
  }

  function closeQuizGame() {
    quizActive = false;
    quizPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  quizStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initQuizGame();
  });

  quizPanelClose.addEventListener('click', closeQuizGame);

  // ===== BREAKOUT GAME =====
  var breakoutPanel = document.getElementById('breakoutPanel');
  var breakoutPanelClose = document.getElementById('breakoutPanelClose');
  var breakoutCanvas = document.getElementById('breakoutCanvas');
  var breakoutCtx = breakoutCanvas.getContext('2d');
  var breakoutOverlay = document.getElementById('breakoutOverlay');
  var breakoutStartBtn = document.getElementById('breakoutStartBtn');
  var breakoutScoreEl = document.getElementById('breakoutScore');
  var breakoutLivesEl = document.getElementById('breakoutLives');
  var breakoutLevelEl = document.getElementById('breakoutLevel');

  var breakoutActive = false;
  var breakoutRunning = false;
  var breakoutScore = 0;
  var breakoutLives = 3;
  var breakoutLevel = 1;
  var breakoutPaddle, breakoutBall, breakoutBricks = [];
  var breakoutLoop = null;

  function startBreakoutGame() {
    if (!discoveries['breakout_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (13 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    breakoutActive = true;
    breakoutScore = 0;
    breakoutLives = 3;
    breakoutLevel = 1;
    breakoutScoreEl.textContent = '0';
    breakoutLivesEl.textContent = '3';
    breakoutLevelEl.textContent = '1';
    breakoutPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    breakoutOverlay.classList.remove('hidden');
    discover('breakout');
  }

  function initBreakout() {
    breakoutActive = true;
    breakoutRunning = true;
    breakoutOverlay.classList.add('hidden');

    breakoutPaddle = { x: 160, y: 280, width: 80, height: 10, speed: 6 };
    breakoutBall = { x: 200, y: 260, radius: 6, dx: 3, dy: -3 };
    createBreakoutBricks();

    if (breakoutLoop) cancelAnimationFrame(breakoutLoop);
    breakoutLoop = requestAnimationFrame(updateBreakout);
  }

  function createBreakoutBricks() {
    breakoutBricks = [];
    var rows = 4 + breakoutLevel;
    var cols = 8;
    var brickWidth = 44;
    var brickHeight = 15;
    var padding = 4;
    var offsetTop = 30;
    var offsetLeft = 20;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var colors = ['#ff3131', '#ff8c00', '#ffe600', '#39ff14', '#00f0ff'];
        breakoutBricks.push({
          x: c * (brickWidth + padding) + offsetLeft,
          y: r * (brickHeight + padding) + offsetTop,
          width: brickWidth,
          height: brickHeight,
          color: colors[r % colors.length],
          alive: true
        });
      }
    }
  }

  function updateBreakout() {
    if (!breakoutRunning) return;

    breakoutCtx.fillStyle = '#0c0c1d';
    breakoutCtx.fillRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);

    breakoutPaddle.x += breakoutPaddle.dx;
    if (breakoutPaddle.x < 0) breakoutPaddle.x = 0;
    if (breakoutPaddle.x + breakoutPaddle.width > breakoutCanvas.width) {
      breakoutPaddle.x = breakoutCanvas.width - breakoutPaddle.width;
    }

    breakoutBall.x += breakoutBall.dx;
    breakoutBall.y += breakoutBall.dy;

    if (breakoutBall.x - breakoutBall.radius < 0 || breakoutBall.x + breakoutBall.radius > breakoutCanvas.width) {
      breakoutBall.dx *= -1;
    }
    if (breakoutBall.y - breakoutBall.radius < 0) {
      breakoutBall.dy *= -1;
    }

    if (breakoutBall.y + breakoutBall.radius > breakoutCanvas.height) {
      breakoutLives--;
      breakoutLivesEl.textContent = breakoutLives;
      if (breakoutLives <= 0) {
        endBreakout();
        return;
      }
      breakoutBall.x = 200;
      breakoutBall.y = 260;
      breakoutBall.dx = 3;
      breakoutBall.dy = -3;
    }

    if (breakoutBall.y + breakoutBall.radius > breakoutPaddle.y &&
        breakoutBall.x > breakoutPaddle.x &&
        breakoutBall.x < breakoutPaddle.x + breakoutPaddle.width) {
      breakoutBall.dy = -Math.abs(breakoutBall.dy);
      var hitPos = (breakoutBall.x - breakoutPaddle.x) / breakoutPaddle.width;
      breakoutBall.dx = (hitPos - 0.5) * 8;
    }

    breakoutBricks.forEach(function (brick) {
      if (!brick.alive) return;
      if (breakoutBall.x + breakoutBall.radius > brick.x &&
          breakoutBall.x - breakoutBall.radius < brick.x + brick.width &&
          breakoutBall.y + breakoutBall.radius > brick.y &&
          breakoutBall.y - breakoutBall.radius < brick.y + brick.height) {
        brick.alive = false;
        breakoutBall.dy *= -1;
        breakoutScore += 10;
        breakoutScoreEl.textContent = breakoutScore;
        SoundManager.playScore();
      }
    });

    if (breakoutBricks.every(function (b) { return !b.alive; })) {
      breakoutLevel++;
      breakoutLevelEl.textContent = breakoutLevel;
      createBreakoutBricks();
      breakoutBall.x = 200;
      breakoutBall.y = 260;
      breakoutBall.dx *= 1.1;
      breakoutBall.dy *= 1.1;
    }

    breakoutCtx.fillStyle = '#00f0ff';
    breakoutCtx.shadowColor = 'rgba(0, 240, 255, 0.8)';
    breakoutCtx.shadowBlur = 10;
    breakoutCtx.fillRect(breakoutPaddle.x, breakoutPaddle.y, breakoutPaddle.width, breakoutPaddle.height);

    breakoutCtx.beginPath();
    breakoutCtx.arc(breakoutBall.x, breakoutBall.y, breakoutBall.radius, 0, Math.PI * 2);
    breakoutCtx.fillStyle = '#ffffff';
    breakoutCtx.fill();

    breakoutBricks.forEach(function (brick) {
      if (!brick.alive) return;
      breakoutCtx.fillStyle = brick.color;
      breakoutCtx.shadowColor = brick.color;
      breakoutCtx.shadowBlur = 5;
      breakoutCtx.fillRect(brick.x, brick.y, brick.width, brick.height);
    });

    breakoutLoop = requestAnimationFrame(updateBreakout);
  }

  function endBreakout() {
    breakoutRunning = false;
    breakoutActive = false;
    cancelAnimationFrame(breakoutLoop);
    SoundManager.playGameOver();
    screenShake();

    addTermLine('BREAKOUT GAME OVER! Score: ' + breakoutScore, 'system');
    if (breakoutScore >= 500) {
      showAchievement('BREAKOUT MASTER! Score: ' + breakoutScore);
    }
  }

  function closeBreakoutGame() {
    breakoutRunning = false;
    breakoutActive = false;
    cancelAnimationFrame(breakoutLoop);
    breakoutPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  breakoutStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initBreakout();
  });

  breakoutPanelClose.addEventListener('click', closeBreakoutGame);

  var breakoutKeys = {};
  document.addEventListener('keydown', function (e) {
    if (!breakoutActive) return;
    breakoutKeys[e.key] = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
  });
  document.addEventListener('keyup', function (e) {
    breakoutKeys[e.key] = false;
  });

  setInterval(function () {
    if (!breakoutRunning) return;
    breakoutPaddle.dx = 0;
    if (breakoutKeys['ArrowLeft']) breakoutPaddle.dx = -breakoutPaddle.speed;
    if (breakoutKeys['ArrowRight']) breakoutPaddle.dx = breakoutPaddle.speed;
  }, 16);

  // ===== TETRIS GAME =====
  var tetrisPanel = document.getElementById('tetrisPanel');
  var tetrisPanelClose = document.getElementById('tetrisPanelClose');
  var tetrisCanvas = document.getElementById('tetrisCanvas');
  var tetrisCtx = tetrisCanvas.getContext('2d');
  var tetrisOverlay = document.getElementById('tetrisOverlay');
  var tetrisStartBtn = document.getElementById('tetrisStartBtn');
  var tetrisScoreEl = document.getElementById('tetrisScore');
  var tetrisLinesEl = document.getElementById('tetrisLines');
  var tetrisLevelEl = document.getElementById('tetrisLevel');

  var tetrisActive = false;
  var tetrisRunning = false;
  var tetrisScore = 0;
  var tetrisLines = 0;
  var tetrisLevel = 1;
  var tetrisGrid = [];
  var tetrisCurrent = null;
  var tetrisLoop = null;
  var tetrisDropCounter = 0;
  var tetrisDropInterval = 1000;
  var tetrisLastTime = 0;

  var TETRIS_COLS = 10;
  var TETRIS_ROWS = 15;
  var TETRIS_BLOCK = 20;

  var TETRIS_PIECES = [
    { shape: [[1,1,1,1]], color: '#00f0ff' },
    { shape: [[1,1],[1,1]], color: '#ffe600' },
    { shape: [[1,1,1],[0,1,0]], color: '#9b59b6' },
    { shape: [[1,1,1],[1,0,0]], color: '#ff8c00' },
    { shape: [[1,1,1],[0,0,1]], color: '#39ff14' },
    { shape: [[1,1,0],[0,1,1]], color: '#ff3131' },
    { shape: [[0,1,1],[1,1,0]], color: '#ff00ff' }
  ];

  function startTetrisGame() {
    if (!discoveries['tetris_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (15 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    tetrisActive = true;
    tetrisScore = 0;
    tetrisLines = 0;
    tetrisLevel = 1;
    tetrisScoreEl.textContent = '0';
    tetrisLinesEl.textContent = '0';
    tetrisLevelEl.textContent = '1';
    tetrisPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    tetrisOverlay.classList.remove('hidden');
    discover('tetris');
  }

  function initTetris() {
    tetrisActive = true;
    tetrisRunning = true;
    tetrisOverlay.classList.add('hidden');

    tetrisGrid = [];
    for (var r = 0; r < TETRIS_ROWS; r++) {
      tetrisGrid[r] = [];
      for (var c = 0; c < TETRIS_COLS; c++) {
        tetrisGrid[r][c] = null;
      }
    }

    spawnTetrisPiece();
    tetrisLastTime = performance.now();
    tetrisLoop = requestAnimationFrame(updateTetris);
  }

  function spawnTetrisPiece() {
    var piece = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
    tetrisCurrent = {
      shape: piece.shape,
      color: piece.color,
      x: Math.floor(TETRIS_COLS / 2) - 1,
      y: 0
    };

    if (!tetrisValidMove(0, 0)) {
      endTetris();
    }
  }

  function tetrisValidMove(offsetX, offsetY, newShape) {
    var shape = newShape || tetrisCurrent.shape;
    for (var r = 0; r < shape.length; r++) {
      for (var c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          var newX = tetrisCurrent.x + c + offsetX;
          var newY = tetrisCurrent.y + r + offsetY;
          if (newX < 0 || newX >= TETRIS_COLS || newY >= TETRIS_ROWS) {
            return false;
          }
          if (newY >= 0 && tetrisGrid[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function rotateTetrisPiece() {
    var rotated = [];
    for (var c = 0; c < tetrisCurrent.shape[0].length; c++) {
      rotated[c] = [];
      for (var r = tetrisCurrent.shape.length - 1; r >= 0; r--) {
        rotated[c].push(tetrisCurrent.shape[r][c]);
      }
    }
    if (tetrisValidMove(0, 0, rotated)) {
      tetrisCurrent.shape = rotated;
    }
  }

  function lockTetrisPiece() {
    for (var r = 0; r < tetrisCurrent.shape.length; r++) {
      for (var c = 0; c < tetrisCurrent.shape[r].length; c++) {
        if (tetrisCurrent.shape[r][c]) {
          var y = tetrisCurrent.y + r;
          var x = tetrisCurrent.x + c;
          if (y >= 0) {
            tetrisGrid[y][x] = tetrisCurrent.color;
          }
        }
      }
    }

    var linesCleared = 0;
    for (var r = TETRIS_ROWS - 1; r >= 0; r--) {
      if (tetrisGrid[r].every(function (cell) { return cell !== null; })) {
        tetrisGrid.splice(r, 1);
        tetrisGrid.unshift(new Array(TETRIS_COLS).fill(null));
        linesCleared++;
        r++;
      }
    }

    if (linesCleared > 0) {
      tetrisLines += linesCleared;
      tetrisLinesEl.textContent = tetrisLines;
      tetrisScore += [0, 100, 300, 500, 800][linesCleared] * tetrisLevel;
      tetrisScoreEl.textContent = tetrisScore;
      tetrisLevel = Math.floor(tetrisLines / 10) + 1;
      tetrisLevelEl.textContent = tetrisLevel;
      tetrisDropInterval = Math.max(100, 1000 - (tetrisLevel - 1) * 100);
      SoundManager.playScore();
    }

    spawnTetrisPiece();
  }

  function updateTetris(time) {
    if (!tetrisRunning) return;

    var deltaTime = time - tetrisLastTime;
    tetrisLastTime = time;
    tetrisDropCounter += deltaTime;

    if (tetrisDropCounter > tetrisDropInterval) {
      tetrisDropCounter = 0;
      if (tetrisValidMove(0, 1)) {
        tetrisCurrent.y++;
      } else {
        lockTetrisPiece();
      }
    }

    drawTetris();
    tetrisLoop = requestAnimationFrame(updateTetris);
  }

  function drawTetris() {
    tetrisCtx.fillStyle = '#0c0c1d';
    tetrisCtx.fillRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);

    for (var r = 0; r < TETRIS_ROWS; r++) {
      for (var c = 0; c < TETRIS_COLS; c++) {
        if (tetrisGrid[r][c]) {
          tetrisCtx.fillStyle = tetrisGrid[r][c];
          tetrisCtx.shadowColor = tetrisGrid[r][c];
          tetrisCtx.shadowBlur = 5;
          tetrisCtx.fillRect(c * TETRIS_BLOCK + 40, r * TETRIS_BLOCK + 20, TETRIS_BLOCK - 1, TETRIS_BLOCK - 1);
        }
      }
    }

    if (tetrisCurrent) {
      for (var r = 0; r < tetrisCurrent.shape.length; r++) {
        for (var c = 0; c < tetrisCurrent.shape[r].length; c++) {
          if (tetrisCurrent.shape[r][c]) {
            tetrisCtx.fillStyle = tetrisCurrent.color;
            tetrisCtx.shadowColor = tetrisCurrent.color;
            tetrisCtx.shadowBlur = 5;
            tetrisCtx.fillRect(
              (tetrisCurrent.x + c) * TETRIS_BLOCK + 40,
              (tetrisCurrent.y + r) * TETRIS_BLOCK + 20,
              TETRIS_BLOCK - 1,
              TETRIS_BLOCK - 1
            );
          }
        }
      }
    }
  }

  function endTetris() {
    tetrisRunning = false;
    tetrisActive = false;
    cancelAnimationFrame(tetrisLoop);
    SoundManager.playGameOver();
    screenShake();

    addTermLine('TETRIS GAME OVER! Score: ' + tetrisScore, 'system');
    if (tetrisScore >= 1000) {
      showAchievement('TETRIS MASTER! Score: ' + tetrisScore);
    }
  }

  function closeTetrisGame() {
    tetrisRunning = false;
    tetrisActive = false;
    cancelAnimationFrame(tetrisLoop);
    tetrisPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  tetrisStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initTetris();
  });

  tetrisPanelClose.addEventListener('click', closeTetrisGame);

  document.addEventListener('keydown', function (e) {
    if (!tetrisRunning) return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (tetrisValidMove(-1, 0)) tetrisCurrent.x--;
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (tetrisValidMove(1, 0)) tetrisCurrent.x++;
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (tetrisValidMove(0, 1)) {
          tetrisCurrent.y++;
          tetrisScore += 1;
          tetrisScoreEl.textContent = tetrisScore;
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotateTetrisPiece();
        break;
    }
  });

  document.querySelectorAll('.tetris-controls .ctrl-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      SoundManager.playClick();
      var action = btn.dataset.action;
      var dir = btn.dataset.dir;
      if (action === 'rotate') {
        rotateTetrisPiece();
      } else if (dir === 'left' && tetrisValidMove(-1, 0)) {
        tetrisCurrent.x--;
      } else if (dir === 'right' && tetrisValidMove(1, 0)) {
        tetrisCurrent.x++;
      } else if (dir === 'down' && tetrisValidMove(0, 1)) {
        tetrisCurrent.y++;
        tetrisScore += 1;
        tetrisScoreEl.textContent = tetrisScore;
      }
    });
  });

  // ===== PONG GAME =====
  var pongPanel = document.getElementById('pongPanel');
  var pongPanelClose = document.getElementById('pongPanelClose');
  var pongCanvas = document.getElementById('pongCanvas');
  var pongCtx = pongCanvas.getContext('2d');
  var pongOverlay = document.getElementById('pongOverlay');
  var pongStartBtn = document.getElementById('pongStartBtn');
  var pongPlayerScoreEl = document.getElementById('pongPlayerScore');
  var pongCpuScoreEl = document.getElementById('pongCpuScore');

  var pongActive = false;
  var pongRunning = false;
  var pongPlayerScore = 0;
  var pongCpuScore = 0;
  var pongPaddleHeight = 60;
  var pongPaddleWidth = 10;
  var pongPlayerY = 120;
  var pongCpuY = 120;
  var pongBall = { x: 200, y: 150, dx: 4, dy: 3, size: 8 };
  var pongLoop = null;

  function startPongGame() {
    if (!discoveries['pong_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (17 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    pongActive = true;
    pongPlayerScore = 0;
    pongCpuScore = 0;
    pongPlayerScoreEl.textContent = '0';
    pongCpuScoreEl.textContent = '0';
    pongPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    pongOverlay.classList.remove('hidden');
    discover('pong');
  }

  function initPong() {
    pongActive = true;
    pongRunning = true;
    pongPlayerY = 120;
    pongCpuY = 120;
    pongBall = { x: 200, y: 150, dx: 4, dy: 3, size: 8 };
    pongOverlay.classList.add('hidden');
    pongLoop = requestAnimationFrame(updatePong);
  }

  function updatePong() {
    if (!pongRunning) return;

    pongCtx.fillStyle = '#0c0c1d';
    pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

    pongCtx.setLineDash([5, 5]);
    pongCtx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
    pongCtx.beginPath();
    pongCtx.moveTo(pongCanvas.width / 2, 0);
    pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
    pongCtx.stroke();
    pongCtx.setLineDash([]);

    pongBall.x += pongBall.dx;
    pongBall.y += pongBall.dy;

    if (pongBall.y <= 0 || pongBall.y >= pongCanvas.height) {
      pongBall.dy *= -1;
    }

    if (pongBall.x <= pongPaddleWidth + 10 &&
        pongBall.y >= pongPlayerY &&
        pongBall.y <= pongPlayerY + pongPaddleHeight) {
      pongBall.dx = Math.abs(pongBall.dx);
      pongBall.dx *= 1.05;
      var hitPos = (pongBall.y - pongPlayerY) / pongPaddleHeight;
      pongBall.dy = (hitPos - 0.5) * 8;
      SoundManager.playClick();
    }

    if (pongBall.x >= pongCanvas.width - pongPaddleWidth - 10 &&
        pongBall.y >= pongCpuY &&
        pongBall.y <= pongCpuY + pongPaddleHeight) {
      pongBall.dx = -Math.abs(pongBall.dx);
    }

    if (pongBall.x < 0) {
      pongCpuScore++;
      pongCpuScoreEl.textContent = pongCpuScore;
      resetPongBall();
      SoundManager.playError();
    } else if (pongBall.x > pongCanvas.width) {
      pongPlayerScore++;
      pongPlayerScoreEl.textContent = pongPlayerScore;
      resetPongBall();
      SoundManager.playScore();
    }

    if (pongPlayerScore >= 5 || pongCpuScore >= 5) {
      endPong();
      return;
    }

    var targetY = pongBall.y - pongPaddleHeight / 2;
    var cpuSpeed = 4;
    if (pongCpuY < targetY - 10) {
      pongCpuY += cpuSpeed;
    } else if (pongCpuY > targetY + 10) {
      pongCpuY -= cpuSpeed;
    }
    pongCpuY = Math.max(0, Math.min(pongCanvas.height - pongPaddleHeight, pongCpuY));

    pongCtx.fillStyle = '#39ff14';
    pongCtx.shadowColor = 'rgba(57, 255, 20, 0.8)';
    pongCtx.shadowBlur = 10;
    pongCtx.fillRect(10, pongPlayerY, pongPaddleWidth, pongPaddleHeight);

    pongCtx.fillStyle = '#ff3131';
    pongCtx.shadowColor = 'rgba(255, 49, 49, 0.8)';
    pongCtx.fillRect(pongCanvas.width - pongPaddleWidth - 10, pongCpuY, pongPaddleWidth, pongPaddleHeight);

    pongCtx.beginPath();
    pongCtx.arc(pongBall.x, pongBall.y, pongBall.size, 0, Math.PI * 2);
    pongCtx.fillStyle = '#ffffff';
    pongCtx.fill();

    pongLoop = requestAnimationFrame(updatePong);
  }

  function resetPongBall() {
    pongBall.x = pongCanvas.width / 2;
    pongBall.y = pongCanvas.height / 2;
    pongBall.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    pongBall.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
  }

  function endPong() {
    pongRunning = false;
    pongActive = false;
    cancelAnimationFrame(pongLoop);
    SoundManager.playGameOver();

    var result = pongPlayerScore >= 5 ? 'YOU WIN!' : 'CPU WINS!';
    addTermLine('PONG: ' + result + ' (' + pongPlayerScore + '-' + pongCpuScore + ')', 'system');

    if (pongPlayerScore >= 5) {
      showAchievement('PONG CHAMPION!');
    }
  }

  function closePongGame() {
    pongRunning = false;
    pongActive = false;
    cancelAnimationFrame(pongLoop);
    pongPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  pongStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initPong();
  });

  pongPanelClose.addEventListener('click', closePongGame);

  var pongKeys = {};
  document.addEventListener('keydown', function (e) {
    if (!pongRunning) return;
    pongKeys[e.key] = true;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
  });
  document.addEventListener('keyup', function (e) {
    pongKeys[e.key] = false;
  });

  setInterval(function () {
    if (!pongRunning) return;
    if (pongKeys['ArrowUp'] && pongPlayerY > 0) {
      pongPlayerY -= 6;
    }
    if (pongKeys['ArrowDown'] && pongPlayerY < pongCanvas.height - pongPaddleHeight) {
      pongPlayerY += 6;
    }
  }, 16);

  pongCanvas.addEventListener('mousemove', function (e) {
    if (!pongRunning) return;
    var rect = pongCanvas.getBoundingClientRect();
    var y = (e.clientY - rect.top) * (pongCanvas.height / rect.height);
    pongPlayerY = Math.max(0, Math.min(pongCanvas.height - pongPaddleHeight, y - pongPaddleHeight / 2));
  });

  // ===== WHACK-A-BUG GAME =====
  var whackPanel = document.getElementById('whackPanel');
  var whackPanelClose = document.getElementById('whackPanelClose');
  var whackGrid = document.getElementById('whackGrid');
  var whackOverlay = document.getElementById('whackOverlay');
  var whackStartBtn = document.getElementById('whackStartBtn');
  var whackScoreEl = document.getElementById('whackScore');
  var whackHitEl = document.getElementById('whackHit');
  var whackBestEl = document.getElementById('whackBest');
  var whackTimerEl = document.getElementById('whackTimer');

  var whackActive = false;
  var whackScore = 0;
  var whackHit = 0;
  var whackBest = parseInt(localStorage.getItem('whackBest')) || 0;
  var whackTimeLeft = 0;
  var whackTimer = null;
  var whackSpawnTimer = null;

  whackBestEl.textContent = whackBest;

  function startWhackGame() {
    if (!discoveries['whack_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (19 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    whackActive = true;
    whackScore = 0;
    whackHit = 0;
    whackScoreEl.textContent = '0';
    whackHitEl.textContent = '0';
    whackPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    whackOverlay.classList.remove('hidden');
    whackGrid.innerHTML = '';
    for (var i = 0; i < 9; i++) {
      var hole = document.createElement('div');
      hole.className = 'whack-hole';
      hole.dataset.index = i;
      whackGrid.appendChild(hole);
    }
    discover('whack');
  }

  function initWhackGame() {
    whackActive = true;
    whackScore = 0;
    whackHit = 0;
    whackTimeLeft = 30;
    whackScoreEl.textContent = '0';
    whackHitEl.textContent = '0';
    whackTimerEl.textContent = '30s';
    whackOverlay.classList.add('hidden');

    whackTimer = setInterval(function () {
      whackTimeLeft--;
      whackTimerEl.textContent = whackTimeLeft + 's';
      if (whackTimeLeft <= 0) {
        endWhackGame();
      }
    }, 1000);

    whackSpawnTimer = setInterval(spawnWhackMole, 600);

    var holes = whackGrid.querySelectorAll('.whack-hole');
    holes.forEach(function (hole) {
      hole.addEventListener('click', function () {
        var mole = hole.querySelector('.whack-mole');
        if (mole && !mole.dataset.hit) {
          mole.dataset.hit = 'true';
          whackScore += 10;
          whackHit++;
          whackScoreEl.textContent = whackScore;
          whackHitEl.textContent = whackHit;
          SoundManager.playScore();
          particleBurst(
            mole.getBoundingClientRect().left + 30,
            mole.getBoundingClientRect().top + 30,
            '#ff3131'
          );
        }
      });
    });
  }

  function spawnWhackMole() {
    if (!whackActive) return;
    var holes = whackGrid.querySelectorAll('.whack-hole');
    var emptyHoles = Array.from(holes).filter(function (h) { return !h.querySelector('.whack-mole'); });
    if (emptyHoles.length === 0) return;

    var hole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
    var mole = document.createElement('div');
    mole.className = 'whack-mole';
    mole.innerHTML = ['&#128308;', '&#128021;', '&#128004;', '&#129997;'][Math.floor(Math.random() * 4)];
    hole.appendChild(mole);

    setTimeout(function () {
      if (mole.parentNode) {
        mole.parentNode.removeChild(mole);
      }
    }, 800);
  }

  function endWhackGame() {
    whackActive = false;
    clearInterval(whackTimer);
    clearInterval(whackSpawnTimer);

    if (whackScore > whackBest) {
      whackBest = whackScore;
      localStorage.setItem('whackBest', whackBest);
      whackBestEl.textContent = whackBest;
    }

    addTermLine('WHACK-A-BUG COMPLETE! Hits: ' + whackHit + ' | Score: ' + whackScore, 'system');

    if (whackScore >= 200) {
      showAchievement('BUG HUNTER! Score: ' + whackScore);
    }
  }

  function closeWhackGame() {
    whackActive = false;
    clearInterval(whackTimer);
    clearInterval(whackSpawnTimer);
    whackPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  whackStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initWhackGame();
  });

  whackPanelClose.addEventListener('click', closeWhackGame);

  // ===== MINESWEEPER GAME =====
  var minesweeperPanel = document.getElementById('minesweeperPanel');
  var minesweeperPanelClose = document.getElementById('minesweeperPanelClose');
  var minesweeperGrid = document.getElementById('minesweeperGrid');
  var minesweeperOverlay = document.getElementById('minesweeperOverlay');
  var minesweeperStartBtn = document.getElementById('minesweeperStartBtn');
  var mineCountEl = document.getElementById('mineCount');
  var mineTimeEl = document.getElementById('mineTime');

  var minesweeperActive = false;
  var mineGrid = [];
  var mineLocations = [];
  var minesweeperGameOver = false;
  var minesweeperTimer = null;
  var minesweeperSeconds = 0;
  var MINES = 10;
  var GRID_SIZE = 10;

  function startMinesweeperGame() {
    if (!discoveries['minesweeper_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (21 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    minesweeperActive = true;
    mineCountEl.textContent = MINES;
    mineTimeEl.textContent = '0:00';
    minesweeperPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    minesweeperOverlay.classList.remove('hidden');
    discover('minesweeper');
  }

  function initMinesweeper() {
    minesweeperActive = true;
    minesweeperGameOver = false;
    mineGrid = [];
    mineLocations = [];
    minesweeperSeconds = 0;

    mineCountEl.textContent = MINES;
    mineTimeEl.textContent = '0:00';
    minesweeperOverlay.classList.add('hidden');

    for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      mineGrid.push({ mine: false, revealed: false, flagged: false, adjacent: 0 });
    }

    while (mineLocations.length < MINES) {
      var idx = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
      if (mineLocations.indexOf(idx) === -1) {
        mineLocations.push(idx);
        mineGrid[idx].mine = true;
      }
    }

    for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      if (!mineGrid[i].mine) {
        var adj = 0;
        for (var d = -1; d <= 1; d++) {
          for (var e = -1; e <= 1; e++) {
            if (d === 0 && e === 0) continue;
            var ni = i + d * GRID_SIZE + e;
            if (ni >= 0 && ni < GRID_SIZE * GRID_SIZE &&
                Math.abs((i % GRID_SIZE) - (ni % GRID_SIZE)) <= 1 &&
                mineGrid[ni].mine) {
              adj++;
            }
          }
        }
        mineGrid[i].adjacent = adj;
      }
    }

    renderMinesweeper();

    if (minesweeperTimer) clearInterval(minesweeperTimer);
    minesweeperTimer = setInterval(function () {
      minesweeperSeconds++;
      var mins = Math.floor(minesweeperSeconds / 60);
      var secs = minesweeperSeconds % 60;
      mineTimeEl.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    }, 1000);
  }

  function renderMinesweeper() {
    minesweeperGrid.innerHTML = '';
    mineGrid.forEach(function (cell, i) {
      var el = document.createElement('div');
      el.className = 'mine-cell';
      el.dataset.index = i;

      if (cell.revealed) {
        el.classList.add('revealed');
        if (cell.mine) {
          el.classList.add('mine');
          el.textContent = '&#128165;';
        } else if (cell.adjacent > 0) {
          el.textContent = cell.adjacent;
          el.dataset.num = cell.adjacent;
        }
      } else if (cell.flagged) {
        el.classList.add('flagged');
        el.textContent = '&#128681;';
      }

      el.addEventListener('click', function () { revealMine(i); });
      el.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        flagMine(i);
      });

      minesweeperGrid.appendChild(el);
    });
  }

  function revealMine(i) {
    if (minesweeperGameOver || !minesweeperActive) return;
    var cell = mineGrid[i];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;

    if (cell.mine) {
      minesweeperGameOver = true;
      clearInterval(minesweeperTimer);
      mineGrid.forEach(function (c, idx) {
        if (c.mine) c.revealed = true;
      });
      renderMinesweeper();
      SoundManager.playGameOver();
      screenShake();
      addTermLine('BOOM! You hit a mine!', 'error');
      return;
    }

    SoundManager.playClick();

    if (cell.adjacent === 0) {
      for (var d = -1; d <= 1; d++) {
        for (var e = -1; e <= 1; e++) {
          var ni = i + d * GRID_SIZE + e;
          if (ni >= 0 && ni < GRID_SIZE * GRID_SIZE &&
              Math.abs((i % GRID_SIZE) - (ni % GRID_SIZE)) <= 1) {
            revealMine(ni);
          }
        }
      }
    }

    renderMinesweeper();

    var unrevealed = mineGrid.filter(function (c) { return !c.revealed && !c.mine; }).length;
    if (unrevealed === 0) {
      minesweeperGameOver = true;
      clearInterval(minesweeperTimer);
      SoundManager.playAchievement();
      addTermLine('MINESWEEPER COMPLETE! Time: ' + mineTimeEl.textContent, 'success');
      showAchievement('MINESWEEPER MASTER!');
    }
  }

  function flagMine(i) {
    if (minesweeperGameOver || !minesweeperActive) return;
    var cell = mineGrid[i];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    var flagCount = mineGrid.filter(function (c) { return c.flagged; }).length;
    mineCountEl.textContent = MINES - flagCount;
    SoundManager.playClick();
    renderMinesweeper();
  }

  function closeMinesweeperGame() {
    minesweeperActive = false;
    minesweeperGameOver = true;
    clearInterval(minesweeperTimer);
    minesweeperPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  minesweeperStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initMinesweeper();
  });

  minesweeperPanelClose.addEventListener('click', closeMinesweeperGame);

  // ===== 2048 GAME =====
  var game2048Panel = document.getElementById('game2048Panel');
  var game2048PanelClose = document.getElementById('game2048PanelClose');
  var grid2048 = document.getElementById('grid2048');
  var game2048Overlay = document.getElementById('game2048Overlay');
  var game2048StartBtn = document.getElementById('game2048StartBtn');
  var score2048El = document.getElementById('score2048');
  var best2048El = document.getElementById('best2048');

  var game2048Active = false;
  var grid2048State = [];
  var score2048 = 0;
  var best2048 = parseInt(localStorage.getItem('best2048')) || 0;

  best2048El.textContent = best2048;

  function start2048Game() {
    if (!discoveries['game2048_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (23 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    game2048Active = true;
    score2048 = 0;
    score2048El.textContent = '0';
    game2048Panel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    game2048Overlay.classList.remove('hidden');
    discover('game2048');
  }

  function init2048Game() {
    game2048Active = true;
    score2048 = 0;
    grid2048State = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    score2048El.textContent = '0';
    game2048Overlay.classList.add('hidden');

    spawn2048Tile();
    spawn2048Tile();
    render2048();
  }

  function spawn2048Tile() {
    var empty = grid2048State.map(function (v, i) { return v === 0 ? i : -1; }).filter(function (i) { return i !== -1; });
    if (empty.length === 0) return;
    var idx = empty[Math.floor(Math.random() * empty.length)];
    grid2048State[idx] = Math.random() < 0.9 ? 2 : 4;
  }

  function render2048() {
    grid2048.innerHTML = '';
    grid2048State.forEach(function (val) {
      var tile = document.createElement('div');
      tile.className = 'tile2048';
      if (val > 0) {
        tile.textContent = val;
        tile.dataset.val = val;
      }
      grid2048.appendChild(tile);
    });
  }

  function slide2048(dir) {
    if (!game2048Active) return;

    var moved = false;
    var newGrid = grid2048State.slice();

    for (var i = 0; i < 4; i++) {
      var line = [];
      for (var j = 0; j < 4; j++) {
        var idx;
        if (dir === 'left' || dir === 'right') {
          idx = i * 4 + j;
        } else {
          idx = j * 4 + i;
        }
        if (newGrid[idx] !== 0) {
          line.push(newGrid[idx]);
        }
      }

      if (dir === 'right' || dir === 'down') {
        line.reverse();
      }

      var merged = [];
      for (var k = 0; k < line.length; k++) {
        if (k < line.length - 1 && line[k] === line[k + 1]) {
          merged.push(line[k] * 2);
          score2048 += line[k] * 2;
          k++;
        } else {
          merged.push(line[k]);
        }
      }

      while (merged.length < 4) {
        if (dir === 'right' || dir === 'down') {
          merged.unshift(0);
        } else {
          merged.push(0);
        }
      }

      if (dir === 'right' || dir === 'down') {
        merged.reverse();
      }

      for (var j = 0; j < 4; j++) {
        var idx;
        if (dir === 'left' || dir === 'right') {
          idx = i * 4 + j;
        } else {
          idx = j * 4 + i;
        }
        if (newGrid[idx] !== merged[j]) moved = true;
        newGrid[idx] = merged[j];
      }
    }

    if (moved) {
      grid2048State = newGrid;
      spawn2048Tile();
      render2048();
      score2048El.textContent = score2048;
      SoundManager.playClick();

      if (score2048 > best2048) {
        best2048 = score2048;
        localStorage.setItem('best2048', best2048);
        best2048El.textContent = best2048;
      }

      if (grid2048State.indexOf(0) === -1 && !canMerge2048()) {
        SoundManager.playGameOver();
        addTermLine('2048 GAME OVER! Score: ' + score2048, 'system');
      }

      if (grid2048State.indexOf(2048) !== -1) {
        showAchievement('2048 ACHIEVED!');
      }
    }
  }

  function canMerge2048() {
    for (var i = 0; i < 16; i++) {
      if (i % 4 !== 3 && grid2048State[i] === grid2048State[i + 1]) return true;
      if (i < 12 && grid2048State[i] === grid2048State[i + 4]) return true;
    }
    return false;
  }

  function close2048Game() {
    game2048Active = false;
    game2048Panel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  game2048StartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    init2048Game();
  });

  game2048PanelClose.addEventListener('click', close2048Game);

  document.addEventListener('keydown', function (e) {
    if (!game2048Active) return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        slide2048('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        slide2048('right');
        break;
      case 'ArrowUp':
        e.preventDefault();
        slide2048('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        slide2048('down');
        break;
    }
  });

  // ===== SIMON GAME =====
  var simonPanel = document.getElementById('simonPanel');
  var simonPanelClose = document.getElementById('simonPanelClose');
  var simonGrid = document.getElementById('simonGrid');
  var simonOverlay = document.getElementById('simonOverlay');
  var simonStartBtn = document.getElementById('simonStartBtn');
  var simonRoundEl = document.getElementById('simonRound');
  var simonBestEl = document.getElementById('simonBest');

  var simonActive = false;
  var simonSequence = [];
  var simonPlayerIndex = 0;
  var simonRound = 1;
  var simonBest = parseInt(localStorage.getItem('simonBest')) || 0;
  var simonPlayingSequence = false;

  simonBestEl.textContent = simonBest;

  function startSimonGame() {
    if (!discoveries['simon_unlock']) {
      addTermLine('ACCESS DENIED. Explore more to unlock.', 'error');
      addTermLine('Discover ' + (25 - discoveryOrder.length) + ' more things.', 'info');
      return;
    }
    simonActive = true;
    simonRound = 1;
    simonSequence = [];
    simonRoundEl.textContent = '1';
    simonPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    simonOverlay.classList.remove('hidden');
    simonGrid.innerHTML = '';
    var colors = ['red', 'green', 'blue', 'yellow'];
    var simonTones = [261, 330, 392, 523];
    colors.forEach(function (color, i) {
      var btn = document.createElement('div');
      btn.className = 'simon-btn ' + color;
      btn.dataset.color = color;
      btn.dataset.tone = simonTones[i];
      btn.addEventListener('click', function () { simonClick(color, simonTones[i], btn); });
      simonGrid.appendChild(btn);
    });
    discover('simon');
  }

  function initSimonGame() {
    simonActive = true;
    simonRound = 1;
    simonSequence = [];
    simonRoundEl.textContent = '1';
    simonOverlay.classList.add('hidden');
    addSimonStep();
  }

  function addSimonStep() {
    var colors = ['red', 'green', 'blue', 'yellow'];
    simonSequence.push(colors[Math.floor(Math.random() * 4)]);
    playSimonSequence();
  }

  function playSimonSequence() {
    simonPlayingSequence = true;
    simonPlayerIndex = 0;

    var i = 0;
    var interval = setInterval(function () {
      if (i >= simonSequence.length) {
        clearInterval(interval);
        simonPlayingSequence = false;
        return;
      }

      var color = simonSequence[i];
      var btn = simonGrid.querySelector('.simon-btn.' + color);
      var tone = parseInt(btn.dataset.tone);

      btn.classList.add('lit');
      SoundManager.playTone(tone, 0.3, 'sine', 0.2);

      setTimeout(function () {
        btn.classList.remove('lit');
      }, 250);

      i++;
    }, 600);
  }

  function simonClick(color, tone, btn) {
    if (!simonActive || simonPlayingSequence) return;

    btn.classList.add('lit');
    SoundManager.playTone(tone, 0.2, 'sine', 0.2);
    setTimeout(function () {
      btn.classList.remove('lit');
    }, 150);

    if (color !== simonSequence[simonPlayerIndex]) {
      SoundManager.playError();
      screenShake();
      addTermLine('SIMON: Wrong! Round: ' + simonRound, 'error');

      if (simonRound > simonBest) {
        simonBest = simonRound;
        localStorage.setItem('simonBest', simonBest);
        simonBestEl.textContent = simonBest;
      }

      if (simonRound >= 10) {
        showAchievement('SIMON SAYS MASTER! Round: ' + simonRound);
      }

      setTimeout(function () {
        simonRound = 1;
        simonSequence = [];
        simonRoundEl.textContent = '1';
        addSimonStep();
      }, 1500);
      return;
    }

    simonPlayerIndex++;

    if (simonPlayerIndex >= simonSequence.length) {
      simonRound++;
      simonRoundEl.textContent = simonRound;
      SoundManager.playScore();

      if (simonRound > simonBest) {
        simonBest = simonRound;
        localStorage.setItem('simonBest', simonBest);
        simonBestEl.textContent = simonBest;
      }

      setTimeout(addSimonStep, 1000);
    }
  }

  function closeSimonGame() {
    simonActive = false;
    simonPlayingSequence = false;
    simonPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  simonStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initSimonGame();
  });

  simonPanelClose.addEventListener('click', closeSimonGame);

  // ===== REACTION TIME GAME =====
  var reactionPanel = document.getElementById('reactionPanel');
  var reactionPanelClose = document.getElementById('reactionPanelClose');
  var reactionArea = document.getElementById('reactionArea');
  var reactionMessage = document.getElementById('reactionMessage');
  var reactionOverlay = document.getElementById('reactionOverlay');
  var reactionStartBtn = document.getElementById('reactionStartBtn');
  var reactionLastEl = document.getElementById('reactionLast');
  var reactionBestEl = document.getElementById('reactionBest');
  var reactionAvgEl = document.getElementById('reactionAvg');

  var reactionActive = false;
  var reactionState = 'idle';
  var reactionStartTime = 0;
  var reactionTimeout = null;
  var reactionTimes = [];
  var reactionBest = parseInt(localStorage.getItem('reactionBest')) || null;

  if (reactionBest) reactionBestEl.textContent = reactionBest + 'ms';

  function startReactionGame() {
    reactionActive = true;
    reactionTimes = [];
    reactionLastEl.textContent = '--';
    reactionAvgEl.textContent = '--';
    reactionPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    reactionOverlay.classList.remove('hidden');
    discover('reaction');
  }

  function initReactionGame() {
    reactionActive = true;
    reactionOverlay.classList.add('hidden');
    reactionState = 'waiting';
    reactionMessage.textContent = 'WAIT FOR GREEN...';
    reactionArea.className = 'reaction-area waiting';

    var delay = 2000 + Math.random() * 3000;
    reactionTimeout = setTimeout(function () {
      if (reactionState === 'waiting') {
        reactionState = 'ready';
        reactionStartTime = Date.now();
        reactionMessage.textContent = 'CLICK!';
        reactionArea.className = 'reaction-area ready';
      }
    }, delay);
  }

  reactionArea.addEventListener('click', function () {
    if (!reactionActive) return;

    if (reactionState === 'waiting') {
      clearTimeout(reactionTimeout);
      reactionMessage.textContent = 'TOO EARLY! Click to try again.';
      reactionArea.className = 'reaction-area';
      reactionState = 'idle';
      SoundManager.playError();
      return;
    }

    if (reactionState === 'ready') {
      var time = Date.now() - reactionStartTime;
      reactionTimes.push(time);
      reactionLastEl.textContent = time + 'ms';

      var avg = Math.round(reactionTimes.reduce(function (a, b) { return a + b; }, 0) / reactionTimes.length);
      reactionAvgEl.textContent = avg + 'ms';

      if (!reactionBest || time < reactionBest) {
        reactionBest = time;
        localStorage.setItem('reactionBest', reactionBest);
        reactionBestEl.textContent = time + 'ms';
      }

      SoundManager.playScore();
      particleBurst(
        reactionArea.getBoundingClientRect().left + 100,
        reactionArea.getBoundingClientRect().top + 100,
        '#00ff7f'
      );

      reactionState = 'idle';
      reactionMessage.textContent = 'Click to test again';
      reactionArea.className = 'reaction-area';

      if (reactionTimes.length >= 5) {
        var finalAvg = Math.round(reactionTimes.reduce(function (a, b) { return a + b; }, 0) / reactionTimes.length);
        addTermLine('REACTION TEST: Avg ' + finalAvg + 'ms (5 tests)', 'system');

        if (finalAvg < 200) {
          showAchievement('LIGHTNING FAST! Avg: ' + finalAvg + 'ms');
        }

        reactionTimes = [];
      }
    } else if (reactionState === 'idle') {
      initReactionGame();
    }
  });

  function closeReactionGame() {
    reactionActive = false;
    clearTimeout(reactionTimeout);
    reactionPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  reactionStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initReactionGame();
  });

  reactionPanelClose.addEventListener('click', closeReactionGame);

  // ===== TARGET SHOOTER GAME =====
  var shooterPanel = document.getElementById('shooterPanel');
  var shooterPanelClose = document.getElementById('shooterPanelClose');
  var shooterArea = document.getElementById('shooterArea');
  var shooterOverlay = document.getElementById('shooterOverlay');
  var shooterStartBtn = document.getElementById('shooterStartBtn');
  var shooterScoreEl = document.getElementById('shooterScore');
  var shooterAccuracyEl = document.getElementById('shooterAccuracy');
  var shooterTimerEl = document.getElementById('shooterTimer');

  var shooterActive = false;
  var shooterScore = 0;
  var shooterHits = 0;
  var shooterShots = 0;
  var shooterTimeLeft = 0;
  var shooterTimer = null;
  var shooterSpawnTimer = null;

  function startShooterGame() {
    shooterActive = true;
    shooterScore = 0;
    shooterHits = 0;
    shooterShots = 0;
    shooterScoreEl.textContent = '0';
    shooterAccuracyEl.textContent = '100%';
    shooterPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    shooterOverlay.classList.remove('hidden');
    discover('shooter');
  }

  function initShooterGame() {
    shooterActive = true;
    shooterScore = 0;
    shooterHits = 0;
    shooterShots = 0;
    shooterTimeLeft = 30;
    shooterScoreEl.textContent = '0';
    shooterAccuracyEl.textContent = '100%';
    shooterTimerEl.textContent = '30s';
    shooterArea.innerHTML = '';
    shooterOverlay.classList.add('hidden');

    shooterTimer = setInterval(function () {
      shooterTimeLeft--;
      shooterTimerEl.textContent = shooterTimeLeft + 's';
      if (shooterTimeLeft <= 0) {
        endShooterGame();
      }
    }, 1000);

    shooterSpawnTimer = setInterval(spawnShooterTarget, 800);
  }

  function spawnShooterTarget() {
    if (!shooterActive) return;
    var target = document.createElement('div');
    target.className = 'shooter-target';
    target.style.left = Math.random() * 80 + 10 + '%';
    target.style.top = Math.random() * 70 + 15 + '%';
    shooterArea.appendChild(target);

    setTimeout(function () {
      if (target.parentNode && !target.classList.contains('hit')) {
        target.parentNode.removeChild(target);
      }
    }, 2000);
  }

  shooterArea.addEventListener('click', function (e) {
    if (!shooterActive) return;
    shooterShots++;

    var accuracy = shooterShots > 0 ? Math.round((shooterHits / shooterShots) * 100) : 100;
    shooterAccuracyEl.textContent = accuracy + '%';

    if (e.target.classList.contains('shooter-target') && !e.target.classList.contains('hit')) {
      e.target.classList.add('hit');
      shooterHits++;
      shooterScore += 10;
      shooterScoreEl.textContent = shooterScore;
      SoundManager.playScore();
      particleBurst(
        e.clientX,
        e.clientY,
        '#ff1493'
      );

      setTimeout(function () {
        if (e.target.parentNode) {
          e.target.parentNode.removeChild(e.target);
        }
      }, 200);
    } else {
      SoundManager.playClick();
    }
  });

  function endShooterGame() {
    shooterActive = false;
    clearInterval(shooterTimer);
    clearInterval(shooterSpawnTimer);

    var accuracy = shooterShots > 0 ? Math.round((shooterHits / shooterShots) * 100) : 0;
    addTermLine('TARGET SHOOTER COMPLETE! Score: ' + shooterScore + ' | Accuracy: ' + accuracy + '%', 'system');

    if (shooterScore >= 200 && accuracy >= 80) {
      showAchievement('SHARPSHOOTER! Score: ' + shooterScore);
    }
  }

  function closeShooterGame() {
    shooterActive = false;
    clearInterval(shooterTimer);
    clearInterval(shooterSpawnTimer);
    shooterPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  shooterStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initShooterGame();
  });

  shooterPanelClose.addEventListener('click', closeShooterGame);

  // ===== MATH SPRINT GAME =====
  var mathPanel = document.getElementById('mathPanel');
  var mathPanelClose = document.getElementById('mathPanelClose');
  var mathQuestionEl = document.getElementById('mathQuestion');
  var mathInput = document.getElementById('mathInput');
  var mathOverlay = document.getElementById('mathOverlay');
  var mathStartBtn = document.getElementById('mathStartBtn');
  var mathScoreEl = document.getElementById('mathScore');
  var mathStreakEl = document.getElementById('mathStreak');
  var mathTimerEl = document.getElementById('mathTimer');

  var mathActive = false;
  var mathScore = 0;
  var mathStreak = 0;
  var mathTimeLeft = 0;
  var mathTimer = null;
  var mathAnswer = 0;

  function startMathGame() {
    mathActive = true;
    mathScore = 0;
    mathStreak = 0;
    mathScoreEl.textContent = '0';
    mathStreakEl.textContent = '0';
    mathPanel.classList.remove('hidden');
    mainTerminal.style.display = 'none';
    mathOverlay.classList.remove('hidden');
    discover('math');
  }

  function initMathGame() {
    mathActive = true;
    mathScore = 0;
    mathStreak = 0;
    mathTimeLeft = 60;
    mathScoreEl.textContent = '0';
    mathStreakEl.textContent = '0';
    mathTimerEl.textContent = '60s';
    mathOverlay.classList.add('hidden');
    mathInput.disabled = false;
    mathInput.focus();

    generateMathQuestion();

    mathTimer = setInterval(function () {
      mathTimeLeft--;
      mathTimerEl.textContent = mathTimeLeft + 's';
      if (mathTimeLeft <= 0) {
        endMathGame();
      }
    }, 1000);
  }

  function generateMathQuestion() {
    var ops = ['+', '-', '×'];
    var op = ops[Math.floor(Math.random() * 3)];
    var a, b;

    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        mathAnswer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * a);
        mathAnswer = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        mathAnswer = a * b;
        break;
    }

    mathQuestionEl.textContent = a + ' ' + op + ' ' + b + ' = ?';
  }

  mathInput.addEventListener('keydown', function (e) {
    if (!mathActive) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      var answer = parseInt(mathInput.value.trim());
      if (answer === mathAnswer) {
        mathScore += 10 + mathStreak * 2;
        mathStreak++;
        mathScoreEl.textContent = mathScore;
        mathStreakEl.textContent = mathStreak;
        SoundManager.playScore();
        generateMathQuestion();
      } else {
        mathStreak = 0;
        mathStreakEl.textContent = '0';
        SoundManager.playError();
        screenShake();
      }
      mathInput.value = '';
    } else if (e.key === 'Escape') {
      closeMathGame();
    }
  });

  function endMathGame() {
    mathActive = false;
    clearInterval(mathTimer);
    mathInput.disabled = true;
    SoundManager.playGameOver();

    addTermLine('MATH SPRINT COMPLETE! Score: ' + mathScore, 'system');

    if (mathScore >= 300) {
      showAchievement('MATH GENIUS! Score: ' + mathScore);
    }
  }

  function closeMathGame() {
    mathActive = false;
    clearInterval(mathTimer);
    mathInput.disabled = true;
    mathPanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  mathStartBtn.addEventListener('click', function () {
    SoundManager.playGameStart();
    initMathGame();
  });

  mathPanelClose.addEventListener('click', closeMathGame);

  // ===== TERMINAL COMMANDS =====
  var commands = {
    help: function () {
      addTermLine('Available commands:', 'system');
      addTermLine('  <span class="cmd-hint">treasure</span>  - Show treasure map &#128726;', 'info');
      addTermLine('  <span class="cmd-hint">scoreboard</span> - View high scores &#127942;', 'info');
      addTermLine('  <span class="cmd-hint">about</span>     - Who am I');
      addTermLine('  <span class="cmd-hint">skills</span>    - Tech stack analysis');
      addTermLine('  <span class="cmd-hint">projects</span>  - Things I built');
      addTermLine('  <span class="cmd-hint">contact</span>   - How to reach me');
      addTermLine('  <span class="cmd-hint">scan</span>      - Scan the profile');
      addTermLine('  <span class="cmd-hint">matrix</span>    - Toggle matrix rain');
      addTermLine('  <span class="cmd-hint">status</span>    - Exploration progress');
      addTermLine('  <span class="cmd-hint">joke</span>     - Random tech joke 😂');
      addTermLine('  <span class="cmd-hint">fortune</span>   - Get your fortune 🔮');
      addTermLine('  <span class="cmd-hint">quote</span>    - Programming quote 📜');
      addTermLine('  <span class="cmd-hint">ping</span>     - Check connection 🏓');
      addTermLine('  <span class="cmd-hint">cowsay</span>    - ASCII cow 🐮');
      addTermLine('  <span class="cmd-hint">clear</span>     - Clear screen');
      addTermLine('  <span class="cmd-hint">exit</span>      - Return to top');
      addTermLine('', 'info');
      addTermLine('Games (unlock by exploring):', 'system');
      if (discoveries['snake_unlock']) {
        addTermLine('  <span class="cmd-hint">snake</span>     - Snake [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">snake</span>     - ??? (1+ discovery) - EASY!', 'info');
      }
      if (discoveries['hack_unlock']) {
        addTermLine('  <span class="cmd-hint">hack</span>      - Decode [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">hack</span>      - ??? (5+ discoveries)', 'info');
      }
      if (discoveries['type_unlock']) {
        addTermLine('  <span class="cmd-hint">type</span>      - Type speed [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">type</span>      - ??? (10+ discoveries) - HARD', 'info');
      }
      if (discoveries['memory_unlock']) {
        addTermLine('  <span class="cmd-hint">memory</span>    - Memory match [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">memory</span>    - ??? (14+ discoveries) - HARD', 'info');
      }
      if (discoveries['quiz_unlock']) {
        addTermLine('  <span class="cmd-hint">quiz</span>      - Tech trivia [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">quiz</span>      - ??? (18+ discoveries) - HARD', 'info');
      }
      if (discoveries['breakout_unlock']) {
        addTermLine('  <span class="cmd-hint">breakout</span>  - Break bricks [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">breakout</span>  - ??? (22+ discoveries) - HARDER', 'info');
      }
      if (discoveries['tetris_unlock']) {
        addTermLine('  <span class="cmd-hint">tetris</span>    - Stack blocks [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">tetris</span>    - ??? (26+ discoveries) - HARDER', 'info');
      }
      if (discoveries['pong_unlock']) {
        addTermLine('  <span class="cmd-hint">pong</span>      - Beat CPU [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">pong</span>      - ??? (30+ discoveries) - VERY HARD', 'info');
      }
      if (discoveries['whack_unlock']) {
        addTermLine('  <span class="cmd-hint">whack</span>     - Whack-a-bug [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">whack</span>     - ??? (33+ discoveries) - VERY HARD', 'info');
      }
      if (discoveries['minesweeper_unlock']) {
        addTermLine('  <span class="cmd-hint">minesweeper</span> - Flag mines [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">minesweeper</span> - ??? (36+ discoveries) - EXTREME', 'info');
      }
      if (discoveries['game2048_unlock']) {
        addTermLine('  <span class="cmd-hint">2048</span>       - Merge tiles [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">2048</span>       - ??? (38+ discoveries) - EXTREME', 'info');
      }
      discover('help');
    },
    treasure: function () {
      addTermLine('Opening treasure map...', 'system');
      showTreasureMap();
      discover('treasure');
    },
    scoreboard: function () {
      addTermLine('Opening scoreboard...', 'system');
      showScoreboard();
      discover('scoreboard');
    },
    scores: function () {
      addTermLine('Opening scoreboard...', 'system');
      showScoreboard();
      discover('scoreboard');
    },
    about: function () {
      addTermLine('IRSHAD PC // SOFTWARE ENGINEER', 'system');
      addTermLine('', '');
      addTermLine('An enthusiastic thinker and engineer with a deep');
      addTermLine('appreciation for mathematics and computer science.');
      addTermLine('', '');
      addTermLine('I dedicate time to staying current in my field');
      addTermLine('and continually enhance my skills by exploring');
      addTermLine('innovative techniques in side projects.');
      addTermLine('', '');
      addTermLine('I love building things that live on the internet.');
      addTermLine('Goal: always pixel-perfect, performant experiences.');
      addTermLine('', '');
      addTermLine('LOCATION: India', 'info');
      addTermLine('EMAIL: <a href="mailto:irshadpc@yahoo.in">irshadpc@yahoo.in</a>', 'info');
      discover('about');
    },
    skills: function () {
      showSkills();
    },
    projects: function () {
      addTermLine('FEATURED PROJECTS:', 'system');
      addTermLine('', '');
      addTermLine('  [01] Portfolio v3', '');
      addTermLine('       This retro-themed interactive site');
      addTermLine('       Built with vanilla JS + retro game design', '');
      addTermLine('', '');
      addTermLine('  [02] Open Source Contributions', '');
      addTermLine('       Active on GitHub, exploring new tech');
      addTermLine('', '');
      addTermLine('  [03] Side Projects', '');
      addTermLine('       Always experimenting with new ideas', '');
      addTermLine('', '');
      addTermLine('Visit <a href="https://github.com/irshadpc" target="_blank">github.com/irshadpc</a> for more.', 'info');
      discover('projects');
    },
    contact: function () {
      addTermLine('COMMUNICATION CHANNELS:', 'system');
      addTermLine('', '');
      addTermLine('  <a href="mailto:irshadpc@yahoo.in">irshadpc@yahoo.in</a>', '');
      addTermLine('  <a href="https://www.linkedin.com/in/irshad-pc-1aaa3814" target="_blank">LinkedIn: irshad-pc</a>', '');
      addTermLine('  <a href="https://github.com/irshadpc" target="_blank">GitHub: irshadpc</a>', '');
      addTermLine('  <a href="https://twitter.com/_irshadpc" target="_blank">Twitter: @_irshadpc</a>', '');
      discover('contact');
    },
    scan: function () {
      runScan();
    },
    snake: function () {
      if (!discoveries['snake_unlock']) {
        addTermLine('ACCESS DENIED. Explore more to unlock this command.', 'error');
        addTermLine('Discover ' + Math.max(0, 3 - discoveryOrder.length) + ' more things to unlock.', 'info');
        return;
      }
      addTermLine('Launching SNAKE... Arrow keys to play!', 'success');
      addTermLine('Press ESC to return to terminal.', 'info');
      gamePanel.classList.remove('hidden');
      mainTerminal.style.display = 'none';
      resetSnakeGame();
      discover('snake');
    },
    hack: function () {
      startHack();
    },
    type: function () {
      startTypeGame();
    },
    memory: function () {
      startMemoryGame();
    },
    quiz: function () {
      startQuizGame();
    },
    breakout: function () {
      startBreakoutGame();
    },
    tetris: function () {
      startTetrisGame();
    },
    pong: function () {
      startPongGame();
    },
    whack: function () {
      startWhackGame();
    },
    minesweeper: function () {
      startMinesweeperGame();
    },
    2048: function () {
      start2048Game();
    },
    simon: function () {
      startSimonGame();
    },
    reaction: function () {
      startReactionGame();
    },
    shooter: function () {
      startShooterGame();
    },
    math: function () {
      startMathGame();
    },
    matrix: function () {
      startMatrix();
    },
    status: function () {
      var count = discoveryOrder.length;
      var pct = Math.min(Math.round((count / MAX_DISCOVERIES) * 100), 100);
      addTermLine('EXPLORATION STATUS:', 'system');
      addTermLine('  Progress: ' + pct + '% (' + count + '/' + MAX_DISCOVERIES + ')', 'info');
      addTermLine('  Discoveries: ' + discoveryOrder.join(', '), '');
      if (!discoveries['snake_unlock']) {
        addTermLine('  Snake unlocks at 1 discovery (2.5%) - EASY!', 'info');
      }
      if (!discoveries['hack_unlock']) {
        addTermLine('  Hack unlocks at 5 discoveries (12.5%)', 'info');
      }
      if (!discoveries['type_unlock']) {
        addTermLine('  Type unlocks at 10 discoveries (25%) - HARD', 'info');
      }
      if (!discoveries['memory_unlock']) {
        addTermLine('  Memory unlocks at 14 discoveries (35%) - HARD', 'info');
      }
      if (!discoveries['quiz_unlock']) {
        addTermLine('  Quiz unlocks at 18 discoveries (45%) - HARD', 'info');
      }
      if (!discoveries['breakout_unlock']) {
        addTermLine('  Breakout unlocks at 22 discoveries (55%) - HARDER', 'info');
      }
      if (!discoveries['tetris_unlock']) {
        addTermLine('  Tetris unlocks at 26 discoveries (65%) - HARDER', 'info');
      }
      if (!discoveries['pong_unlock']) {
        addTermLine('  Pong unlocks at 30 discoveries (75%) - VERY HARD', 'info');
      }
      if (!discoveries['whack_unlock']) {
        addTermLine('  Whack unlocks at 33 discoveries (82.5%) - VERY HARD', 'info');
      }
      if (!discoveries['minesweeper_unlock']) {
        addTermLine('  Minesweeper unlocks at 36 discoveries (90%) - EXTREME', 'info');
      }
      if (!discoveries['game2048_unlock']) {
        addTermLine('  2048 unlocks at 38 discoveries (95%) - EXTREME', 'info');
      }
      discover('status');
    },
    clear: function () {
      clearTerminal();
    },
    exit: function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      addTermLine('Returning to home...', 'system');
    },
    ls: function () {
      addTermLine('about.txt  skills.dat  projects/  contact.md  profile.img  secret.zip', 'system');
      discover('ls');
    },
    cat: function (args) {
      if (args && args.indexOf('secret') !== -1) {
        addTermLine('ACCESS DENIED. Encryption level: maximum.', 'error');
        addTermLine('But you get points for trying.', 'success');
        discover('secret');
      } else if (args && args.indexOf('about') !== -1) {
        commands.about();
      } else {
        addTermLine('Usage: cat &lt;filename&gt;', 'info');
        addTermLine('Files: about.txt, skills.dat, secret.zip', 'info');
      }
    },
    whoami: function () {
      addTermLine('You are an explorer in a digital realm.', 'system');
      addTermLine('Your mission: discover everything.', '');
      discover('whoami');
    },
    sudo: function () {
      addTermLine('Nice try. Root access denied.', 'error');
      addTermLine('But persistence is noted.', 'info');
      discover('sudo');
    },
    hello: function () {
      addTermLine('Hello, explorer! Keep discovering.', 'success');
    },
    date: function () {
      addTermLine(new Date().toLocaleString(), 'system');
    },
    github: function () {
      addTermLine('Opening GitHub...', 'info');
      window.open('https://github.com/irshadpc', '_blank');
    },
    password: function () {
      addTermLine('There is no password. Keep exploring.', 'info');
      discover('password');
    },
    42: function () {
      addTermLine('The answer to life, the universe, and everything.', 'info');
      discover('42');
    },
    irshad: function () {
      addTermLine('Yes, that is the sysadmin. Full access not granted.', 'info');
    },
    rm: function (args) {
      if (args && (args.indexOf('-rf') !== -1 || args.indexOf('-r') !== -1 || args.indexOf('-f') !== -1 || args === '-rf')) {
        addCmdEcho(input);
        triggerFakeCrash();
      } else {
        addCmdEcho(input);
        addTermLine('Usage: rm [options] <file>', 'info');
        addTermLine('This is a portfolio site, not your actual computer! 🤖', 'info');
        addTermLine('You cannot delete anything here.', 'info');
      }
    },
    rmdir: function () {
      addTermLine('Nice try! 🤖', 'error');
      addTermLine('This is a web terminal, you can\'t remove directories.', 'error');
      addTermLine('But points for creativity! +1 XP', 'info');
    },
    helpme: function () {
      addTermLine('Did you mean <span class="cmd-hint">help</span>?', 'info');
    },
    joke: function () {
      var jokes = [
        { q: 'Why do programmers prefer dark mode?', a: 'Because light attracts bugs.' },
        { q: 'What do you call a fake noodle?', a: 'An impasta! (imPOSTA)' },
        { q: 'Why was the JavaScript developer broke?', a: 'Because he didn\'t get any typeof: NaN knew his typeof was Noetherian.' },
        { q: 'How many programmers does it take to change a light bulb?', a: 'None, that\'s a hardware problem!' },
        { q: 'Why do Python programmers wear glasses?', a: 'Because they can\'t C#!' },
        { q: 'What do CSS and Docker have in common?', a: 'They both wrap content!' },
        { q: 'Why was the function so stressed?', a: 'Because it had too many arguments!' },
        { q: 'What did the infinite loop say?', a: 'While (true) { I will never stop }' },
        { q: 'Why do Java devs wear glasses?', a: 'Because they can\'t C# (sea sharp)!' },
        { q: 'What do you call 8 hobbits?', a: 'A hobbyte (hobbyte)!' },
        { q: 'Why was the React developer so calm?', a: 'Because nothing could phase them - they\'d just re-render!' },
        { q: 'What do you call a sleeping programmer?', a: 'A function (wakes up later)!' },
        { q: 'Why do git developers always have clean desks?', a: 'They commit to it!' },
        { q: 'What did the async say to the await?', a: 'I\'ll be right back!' },
        { q: 'Why don\'t we tell jokes to null?', a: 'Because undefined has no sense of humor!' }
      ];
      var r = Math.floor(Math.random() * jokes.length);
      addTermLine('🤖 JOKE #' + (r + 1) + ':', 'system');
      addTermLine('');
      addTermLine('  ' + jokes[r].q, '');
      addTermLine('');
      setTimeout(function() {
        addTermLine('  ' + jokes[r].a, 'success');
      }, 500);
    },
    fortune: function () {
      var fortunes = [
        'Your code will compile on the first try. Today is your lucky day!',
        'A merge conflict in your future, but nothing a cup of coffee can\'t fix.',
        'Your next commit will be clean. Make it count!',
        'Someone somewhere will star your repo today.',
        'Your PR review will have zero nitpicks. Believe in yourself!',
        'The bug you\'re fixing is already fixed in v5.0.',
        'Your lint rules are about to become your best friend.',
        'Semantic versioning: may your semver ever increase!',
        'Your keyboard\'s backspace key is about to get a workout.',
        'Stack Overflow has the answer. You just haven\'t found it yet.',
        'TypeScript will save your day. Trust the type!',
        'Your CI pipeline is green. This is rare. Enjoy it!',
        'The documentation is actually up to date. Prepare to be amazed.',
        'Your production bug will be caught in staging.',
        'Your terminal is about to be 42% more productive.'
      ];
      var r = Math.floor(Math.random() * fortunes.length);
      addTermLine('🔮 FUTURE: ' + fortunes[r], 'success');
    },
    quote: function () {
      var quotes = [
        '"First, solve the problem. Then, write the code." – John Johnson',
        '"Talk is cheap. Show me the code." – Linus Torvalds',
        '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." – Martin Fowler',
        '"Experience is the name everyone gives to their mistakes." – Oscar Wilde',
        '"The best error message is the one that never shows up." – Unknown',
        '"Code is like humor. When you have to explain it, it\'s bad." – Cory House',
        '"Fix the cause, not the symptom." – Steve Maguire',
        '"Make it work, make it right, make it fast." – Kent Beck',
        '"It works on my machine." – Every developer ever',
        '"In theory, theory and practice are the same. In practice, they\'re not." – Yogācāra Bhikṣu',
        '"Programming isn\'t about what you know; it\'s about what you can figure out." – Chris Pine',
        '"The most disastrous thing that you can ever learn is your first programming language." – Alan Kay',
        '"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday\'s code." – Dan Salomon',
        '"Optimism is an occupational hazard of programming: feedback is the work." – Andy Hunt',
        '"If you want to go fast, go alone. If you want to go far, go together." – African proverb'
      ];
      var r = Math.floor(Math.random() * quotes.length);
      addTermLine('📜 QUOTE:', 'system');
      addTermLine('', '');
      addTermLine(quotes[r], 'info');
    },
    cowsay: function (args) {
      if (!args) {
        addTermLine('Usage: cowsay <message>', 'info');
        addTermLine('Example: cowsay Moo!', 'info');
        return;
      }
      var len = Math.max(args.length, 20);
      var border = '';
      for (var i = 0; i < len + 2; i++) border += '_';
      addTermLine(' ' + border, 'system');
      addTermLine('<span class="cmd-hint">' + args + '</span>', '');
      addTermLine(' ' + border, 'system');
    },
    uptime: function () {
      var bootTime = new Date().getTime() - (discoveryOrder.length * 1000);
      var uptimeSeconds = Math.floor((new Date().getTime() - bootTime) / 1000);
      var hours = Math.floor(uptimeSeconds / 3600);
      var mins = Math.floor((uptimeSeconds % 3600) / 60);
      addTermLine('System uptime: ' + hours + 'h ' + mins + 'm (approximate)', 'system');
      addTermLine('Exploration sessions: ' + discoveryOrder.length, 'info');
    },
    matrix: function () {
      if (!discoveries['matrix']) {
        addTermLine('You\'ve found the secret! Matrix rain unlocked.', 'success');
        setTimeout(function() {
          addTermLine('Type <span class="cmd-hint">matrix</span> to toggle the effect.', 'info');
        }, 300);
      }
      if (matrixRunning) {
        stopMatrix();
      } else {
        startMatrix();
      }
    },
    starwars: function () {
      addTermLine('Initializing telnet...', 'system');
      addTermLine('Cannot connect to towel.ug.edu. Network unreachable.', 'error');
      addTermLine('But if you can, try: telnet towel.ug.edu 2000', 'info');
      addTermLine('(The real Star Wars ASCII movie)', 'info');
    },
    cat: function (args) {
      if (!args) {
        addTermLine('Usage: cat <file>', 'info');
        return;
      }
      if (args === 'secret.zip' || args === 'secret') {
        addTermLine('Unzipping...', 'system');
        setTimeout(function() {
          addTermLine('FILE NOT FOUND. Just kidding! 😜', 'success');
          addTermLine('The real secret: you just wasted 2 seconds.', 'info');
          discover('secret');
        }, 800);
      } else if (args === 'joke.txt') {
        commands.joke();
      } else if (args === 'fortune.txt') {
        commands.fortune();
      } else {
        addTermLine('cat: ' + args + ': No such file or directory', 'error');
        addTermLine('Try: about.txt, skills.dat, secret.zip, joke.txt, fortune.txt', 'info');
      }
    },
    reboot: function () {
      addTermLine('Rebooting system...', 'system');
      addTermLine('Just kidding! Refreshing is bad for your health. 🤪', 'info');
    },
    ping: function () {
      addTermLine('PONG! 🏓', 'success');
      addTermLine('Latency: ' + (Math.random() * 50 + 10).toFixed(2) + 'ms', 'info');
    },
    curl: function (args) {
      addTermLine('curl: try fetching something...', 'info');
      addTermLine('This isn\'t a real terminal! 🐚', 'info');
    },
    ls: function () {
      if (!discoveries['ls']) {
        addTermLine('-rw-r--r--  1 irshad  staff   512 Jan 15 2026 about.txt', '');
        addTermLine('-rw-r--r--  1 irshad  staff  1024 Jan 15 2026 skills.dat', '');
        addTermLine('-rw-r--r--  1 irshad  staff   128 Jan 15 2026 secret.zip', '');
        addTermLine('-rw-r--r--  1 irshad  staff   512 Jan 15 2026 joke.txt', '');
        addTermLine('-rw-r--r--  1 irshad  staff   256 Jan 15 2026 fortune.txt', '');
        discover('ls');
      } else {
        addTermLine('-rw-r--r--  1 irshad  staff   512 Jan 15 2026 about.txt', '');
        addTermLine('-rw-r--r--  1 irshad  staff  1024 Jan 15 2026 skills.dat', '');
        addTermLine('-rw-r--r--  1 irshad  staff   128 Jan 15 2026 secret.zip', '');
        addTermLine('-rw-r--r--  1 irshad  staff   512 Jan 15 2026 joke.txt', '');
        addTermLine('-rw-r--r--  1 irshad  staff   256 Jan 15 2026 fortune.txt', '');
      }
    },
    status: function () {
      addTermLine('EXPLORATION STATUS:', 'system');
      addTermLine('', '');
      addTermLine('  Discoveries: ' + discoveryOrder.length + ' / 40', 'info');
      addTermLine('  Exploration: ' + Math.round((discoveryOrder.length / 40) * 100) + '%', 'info');
      addTermLine('', '');
      var recent = discoveryOrder.slice(-3);
      if (recent.length > 0) {
        addTermLine('  Recent:', '');
        recent.forEach(function(d) {
          addTermLine('    - ' + d, '');
        });
      }
      addTermLine('', '');
      addTermLine('  Games Unlocked: ' + Object.keys(discoveries).filter(function(k) { return k.endsWith('_unlock'); }).length, '');
      discover('status');
    }
  };

  function processCommand(input) {
    var parts = input.trim().toLowerCase().split(/\s+/);
    var cmd = parts[0];
    var args = parts.slice(1).join(' ');

    if (!cmd) return;

    commandHistory.unshift(input);
    historyIndex = -1;

    if (commands[cmd]) {
      addCmdEcho(input);
      commands[cmd](args);
    } else {
      addCmdEcho(input);
      addTermLine('Command not found: ' + escapeHtml(cmd), 'error');
      addTermLine('Type <span class="cmd-hint">help</span> for available commands.', 'info');
    }
  }

  // ===== FAKE SYSTEM CRASH =====
  function triggerFakeCrash() {
    var crashStep = 0;

    terminalInput.disabled = true;

    var crashSequence = [
      { delay: 500, action: function() {
        addTermLine('Decoding request...', 'system');
        SoundManager.playClick();
      }},
      { delay: 800, action: function() {
        addTermLine('WARNING: Critical system operation detected', 'error');
        SoundManager.playError();
      }},
      { delay: 1200, action: function() {
        document.body.style.animation = 'glitch 0.3s ease 5';
        SoundManager.playError();
      }},
      { delay: 1500, action: function() {
        addTermLine('', '');
        addTermLine('EXECUTING: rm -rf /', 'system');
        addTermLine('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓', 'error');
      }},
      { delay: 2000, action: function() {
        terminalBody.innerHTML = '';
        terminalBody.style.background = 'rgba(255, 0, 0, 0.3)';
        addTermLine('DELETING SYSTEM32...', 'error');
        SoundManager.playError();
        screenShake();
      }},
      { delay: 2300, action: function() {
        addTermLine('DELETE: 90% complete', 'error');
      }},
      { delay: 2500, action: function() {
        addTermLine('DELETE: kernel panic...', 'error');
        document.body.style.animation = 'glitch 0.1s ease 10';
      }},
      { delay: 2700, action: function() {
        addTermLine('ERROR: CORRUPTION DETECTED', 'error');
        addTermLine('0x000000: CRITICAL FAILURE', 'error');
      }},
      { delay: 3000, action: function() {
        addTermLine('💀 SYSTEM FATAL ERROR 💀', 'error');
        addTermLine('', '');
        addTermLine('紧急情况 | 严重错误 | 系统崩溃', 'error');
        addTermLine('መ⊙᚜°⊙᚜ ERROR ⊙᚜°⊙ SYSTEM CORRUPTED', 'error');
      }},
      { delay: 3500, action: function() {
        terminalBody.innerHTML = '';
        terminalBody.style.background = 'rgba(0, 0, 0, 0.9)';
        var crashMessages = [
          '<span style="color:red;font-size:0.4rem;">&gt;&gt;&gt; BOOT SECTOR CORRUPTED</span>',
          '<span style="color:#ff0000;font-size:0.5rem;">ERROR: 0xDEADBEEF</span>',
          '<span style="color:#ff3131;font-size:0.4rem;"></span>',
          '<span style="color:#ff6b6b6;font-size:0.4rem;">SYSTEM HALTED</span>',
          '<span style="color:#ff0000;font-size:0.7rem;">💀 FATAL ERROR 💀</span>',
          '<span style="color:#ff0000;font-size:0.5rem;"></span>',
          '<span style="color:#ff8c00;font-size:0.4rem;">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>',
          '<span style="color:#ff0000;font-size:0.6rem;">0x000000: KERNEL PANIC</span>',
          '<span style="color:#ff3131;font-size:0.4rem;"></span>',
          '<span style="color:#ff0000;font-size:0.4rem;"></span>',
          '<span style="color:#ffffff;font-size:0.5rem;">SYSTEM32: NOT FOUND</span>',
          '<span style="color:#ff0000;font-size:0.4rem;"></span>',
          '<span style="color:#ff6666;font-size:0.4rem;">🔥 ALL YOUR BASE ARE BELONG TO US 🔥</span>'
        ];
        crashMessages.forEach(function(msg) {
          var line = document.createElement('div');
          line.className = 'term-line';
          line.style.lineHeight = '1.5';
          line.innerHTML = msg;
          terminalBody.appendChild(line);
        });
        SoundManager.playError();
      }},
      { delay: 4000, action: function() {
        document.body.style.animation = 'glitch 0.2s ease-in-out infinite';
        terminalBody.style.background = 'rgba(255, 0, 0, 0.4)';
        var scrambleLine = document.createElement('div');
        scrambleLine.className = 'term-line';
        scrambleLine.style.color = 'red';
        scrambleLine.style.fontSize = '0.4rem';
        terminalBody.appendChild(scrambleLine);

        var scrambleText = ' scrambling filesystem... ';
        var chars = '!@#$%^&*()_+-=[]{}|;:<>,.?/~`';
        var i = 0;
        var scrambleInterval = setInterval(function () {
          scrambleLine.textContent += scrambleText[i % scrambleText.length];
          i++;
          if (i > 50) {
            clearInterval(scrambleInterval);
            setTimeout(revealPrank, 500);
          }
        }, 30);
      }}
    ];

    var totalDelay = 0;
    crashSequence.forEach(function (step) {
      totalDelay += step.delay;
      setTimeout(step.action, totalDelay);
    });
  }

  function revealPrank() {
    document.body.style.animation = '';

    setTimeout(function () {
      terminalBody.style.background = '';
      terminalBody.innerHTML = '';

      var revealMessages = [
        { text: '', delay: 100 },
        { text: '<span style="color:var(--yellow);font-size:0.6rem;">PSYCHE! 😜</span>', delay: 300 },
        { text: '<span style="color:var(--cyan);font-size:0.5rem;">That was a joke! This is a portfolio site, remember?</span>', delay: 800 },
        { text: '<span style="color:var(--green);font-size:0.5rem;">🛡️ System integrity: 100% intact</span>', delay: 1200 },
        { text: '<span style="color:var(--magenta);font-size:0.5rem;">💾 Your files were never in danger</span>', delay: 1600 },
        { text: '<span style="color:var(--text);font-size:0.4rem;">', delay: 2000 },
        { text: '<span style="color:var(--cyan);font-size:0.5rem;">Nice try though! Type <span class="cmd-hint">help</span> for commands.</span>', delay: 2400 },
        { text: '<span style="color:var(--yellow);font-size:0.4rem;">🎮 Ready to play games instead?</span>', delay: 2800 }
      ];

      var totalDelay = 0;
      revealMessages.forEach(function (msg) {
        totalDelay += msg.delay;
        setTimeout(function () {
          var line = document.createElement('div');
          line.className = 'term-line';
          line.innerHTML = msg.text;
          terminalBody.appendChild(line);
          terminalBody.scrollTop = terminalBody.scrollHeight;
        }, totalDelay);
      });

      setTimeout(function () {
        terminalInput.disabled = false;
        terminalInput.focus();
        SoundManager.playPowerUp();
      }, 3500);
    }, 500);
  }

  terminalInput.addEventListener('keydown', function (e) {
    if (snakeGameActive || hackActive || typeActive || memoryActive || quizActive ||
        breakoutActive || tetrisActive || pongActive || whackActive ||
        minesweeperActive || game2048Active || simonActive || reactionActive ||
        shooterActive || mathActive) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(terminalInput.value);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        terminalInput.value = '';
      }
    }
  });

  mainTerminal.addEventListener('click', function () {
    if (!snakeGameActive && !hackActive && !typeActive && !memoryActive && !quizActive &&
        !breakoutActive && !tetrisActive && !pongActive && !whackActive &&
        !minesweeperActive && !game2048Active && !simonActive && !reactionActive &&
        !shooterActive && !mathActive && bootComplete) {
      terminalInput.focus();
    }
  });

  // ===== SNAKE GAME =====
  var canvas = document.getElementById('gameCanvas');
  var ctx = canvas.getContext('2d');
  var overlay = document.getElementById('gameOverlay');
  var overlayTitle = document.getElementById('overlayTitle');
  var overlaySubtitle = document.getElementById('overlaySubtitle');
  var startBtn = document.getElementById('gameStartBtn');
  var scoreEl = document.getElementById('score');
  var hiscoreEl = document.getElementById('hiscore');
  var gamePanelClose = document.getElementById('gamePanelClose');

  var GRID = 20;
  var COLS = canvas.width / GRID;
  var ROWS = canvas.height / GRID;
  var snake, dir, nextDir, food, score, hiScore, gameLoop, running, speed;
  var snakeGameActive = false;

  hiScore = parseInt(localStorage.getItem('snakeHiScore')) || 0;
  hiscoreEl.textContent = hiScore;

  function resetSnakeGame() {
    snakeGameActive = true;
    overlayTitle.textContent = 'SNAKE';
    overlayTitle.style.color = '';
    overlayTitle.style.textShadow = '';
    overlaySubtitle.textContent = 'PRESS START OR SPACE';
    startBtn.innerHTML = '<span class="btn-arrow">&#9654;</span> START';
    overlay.classList.remove('hidden');
    drawSnakeFrame();
  }

  function initSnake() {
    snake = [
      { x: 10, y: 7 },
      { x: 9, y: 7 },
      { x: 8, y: 7 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    speed = 120;
    running = true;
    scoreEl.textContent = '0';
    placeFood();
    drawSnakeFrame();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateSnake, speed);
  }

  function placeFood() {
    var pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
    } while (snake.some(function (s) { return s.x === pos.x && s.y === pos.y; }));
    food = pos;
  }

  function updateSnake() {
    if (!running) return;

    dir = { x: nextDir.x, y: nextDir.y };
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
        snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
      snakeGameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreEl.textContent = score;
      SoundManager.playScore();
      placeFood();
      if (speed > 60) {
        speed -= 3;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateSnake, speed);
      }
    } else {
      snake.pop();
    }

    drawSnakeFrame();
  }

  function drawSnakeFrame() {
    ctx.fillStyle = '#0c0c1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var gx = 0; gx < COLS; gx++) {
      for (var gy = 0; gy < ROWS; gy++) {
        if ((gx + gy) % 2 === 0) {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
          ctx.fillRect(gx * GRID, gy * GRID, GRID, GRID);
        }
      }
    }

    if (food) {
      ctx.fillStyle = '#ff3131';
      ctx.shadowColor = 'rgba(255, 49, 49, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fillRect(food.x * GRID + 2, food.y * GRID + 2, GRID - 4, GRID - 4);
      ctx.shadowBlur = 0;
    }

    if (snake) {
      snake.forEach(function (seg, i) {
        if (i === 0) {
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = i % 2 === 0 ? '#39ff14' : '#2bcc10';
          ctx.shadowColor = i % 2 === 0 ? 'rgba(57, 255, 20, 0.5)' : 'rgba(43, 204, 16, 0.5)';
          ctx.shadowBlur = 6;
        }
        ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);
      });
      ctx.shadowBlur = 0;

      snake.forEach(function (seg, i) {
        if (i === 0) {
          ctx.fillStyle = '#0c0c1d';
          var ex1 = seg.x * GRID + 5 + dir.x * 3;
          var ey1 = seg.y * GRID + 5 + dir.y * 3;
          var ex2 = seg.x * GRID + 13 + dir.x * 3;
          var ey2 = seg.y * GRID + 13 + dir.y * 3;
          ctx.fillRect(ex1, ey1, 3, 3);
          ctx.fillRect(ex2, ey2, 3, 3);
        }
      });
    }
  }

  function snakeGameOver() {
    running = false;
    snakeGameActive = false;
    clearInterval(gameLoop);
    SoundManager.playGameOver();
    screenShake();

    if (score > hiScore) {
      hiScore = score;
      localStorage.setItem('snakeHiScore', hiScore);
      hiscoreEl.textContent = hiScore;
      Scoreboard.saveScore('snake', score);
    }

    Scoreboard.updateStats('snake', score, 0);

    overlayTitle.textContent = 'GAME OVER';
    overlayTitle.style.color = '#ff3131';
    overlayTitle.style.textShadow = '0 0 10px rgba(255,49,49,0.5), 0 0 40px rgba(255,49,49,0.2)';
    overlaySubtitle.textContent = 'SCORE: ' + score;
    startBtn.innerHTML = '<span class="btn-arrow">&#9654;</span> RETRY';
    overlay.classList.remove('hidden');

    if (score >= 100) {
      Scoreboard.unlockAchievement('snake_100');
      showAchievement('SNAKE MASTER! Score: ' + score);
    }

    Scoreboard.unlockAchievement('first_game');
  }

  function changeDir(nx, ny) {
    if (dir.x === -nx && dir.y === -ny) return;
    nextDir = { x: nx, y: ny };
  }

  function closeSnakeGame() {
    running = false;
    snakeGameActive = false;
    clearInterval(gameLoop);
    gamePanel.classList.add('hidden');
    mainTerminal.style.display = '';
    terminalInput.focus();
  }

  startBtn.addEventListener('click', function () {
    snakeGameActive = true;
    overlayTitle.style.color = '';
    overlayTitle.style.textShadow = '';
    overlay.classList.add('hidden');
    SoundManager.playGameStart();
    initSnake();
  });

  gamePanelClose.addEventListener('click', closeSnakeGame);

  document.querySelectorAll('.ctrl-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      SoundManager.playClick();
      if (!running) {
        snakeGameActive = true;
        overlayTitle.style.color = '';
        overlayTitle.style.textShadow = '';
        overlay.classList.add('hidden');
        SoundManager.playGameStart();
        initSnake();
        return;
      }
      switch (btn.getAttribute('data-dir')) {
        case 'up':    changeDir(0, -1); break;
        case 'down':  changeDir(0, 1); break;
        case 'left':  changeDir(-1, 0); break;
        case 'right': changeDir(1, 0); break;
      }
    });
  });

  var touchStartX = 0;
  var touchStartY = 0;
  canvas.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', function (e) {
    if (!running) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      changeDir(dx > 0 ? 1 : -1, 0);
    } else {
      changeDir(0, dy > 0 ? 1 : -1);
    }
  }, { passive: true });

  // ===== GLOBAL KEY HANDLER =====
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (snakeGameActive) {
        closeSnakeGame();
        return;
      }
      if (hackActive) {
        closeHack();
        return;
      }
      if (typeActive) {
        closeTypeGame();
        return;
      }
      if (memoryActive) {
        closeMemoryGame();
        return;
      }
      if (quizActive) {
        closeQuizGame();
        return;
      }
      if (breakoutActive) {
        closeBreakoutGame();
        return;
      }
      if (tetrisActive) {
        closeTetrisGame();
        return;
      }
      if (pongActive) {
        closePongGame();
        return;
      }
      if (whackActive) {
        closeWhackGame();
        return;
      }
      if (minesweeperActive) {
        closeMinesweeperGame();
        return;
      }
      if (game2048Active) {
        close2048Game();
        return;
      }
      if (simonActive) {
        closeSimonGame();
        return;
      }
      if (reactionActive) {
        closeReactionGame();
        return;
      }
      if (shooterActive) {
        closeShooterGame();
        return;
      }
      if (mathActive) {
        closeMathGame();
        return;
      }
    }

    if (!snakeGameActive) return;

    if (!running && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      snakeGameActive = true;
      overlayTitle.style.color = '';
      overlayTitle.style.textShadow = '';
      overlay.classList.add('hidden');
      initSnake();
      return;
    }

    if (!running) return;

    switch (e.key) {
      case 'ArrowUp':    e.preventDefault(); changeDir(0, -1); break;
      case 'ArrowDown':  e.preventDefault(); changeDir(0, 1); break;
      case 'ArrowLeft':  e.preventDefault(); changeDir(-1, 0); break;
      case 'ArrowRight': e.preventDefault(); changeDir(1, 0); break;
    }
  });

  // ===== TEXT GLITCH EFFECT =====
  document.querySelectorAll('.btn, a, .nav-links a').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      textGlitch(this);
      SoundManager.playClick();
    });
  });

  // ===== INIT =====
  updateDiscoveryBar();
  drawSnakeFrame();
})();
