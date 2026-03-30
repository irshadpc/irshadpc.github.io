(function () {
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
  var MAX_DISCOVERIES = 12;

  var navDiscFill = document.getElementById('navDiscFill');
  var navDiscValue = document.getElementById('navDiscValue');
  var terminalDiscovery = document.getElementById('terminalDiscovery');

  function discover(name) {
    if (discoveries[name]) return;
    discoveries[name] = true;
    discoveryOrder.push(name);
    updateDiscoveryBar();
    checkUnlocks();
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
    if (count >= 3 && !discoveries['snake_unlock']) {
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
    if (count >= MAX_DISCOVERIES && !discoveries['complete']) {
      discoveries['complete'] = true;
      addTermLine('', '');
      addTermLine('  *** SYSTEM FULLY EXPLORED ***', 'unlock');
      addTermLine('  You have discovered everything. Respect.', 'success');
      showAchievement('100% COMPLETE - TRUE EXPLORER!');
    }
  }

  // ===== ACHIEVEMENTS =====
  var achievementEl = document.getElementById('achievementPopup');
  var achievementText = document.getElementById('achievementText');
  var achievementTimeout;

  function showAchievement(msg) {
    achievementText.textContent = msg;
    achievementEl.classList.add('show');
    clearTimeout(achievementTimeout);
    achievementTimeout = setTimeout(function () {
      achievementEl.classList.remove('show');
    }, 3000);
  }

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

  // ===== SCAN ANIMATION =====
  var profileImage = document.getElementById('profileImage');
  var scanDone = false;

  function runScan() {
    if (scanDone) {
      addTermLine('Scan already completed. Data on file.', 'info');
      return;
    }
    addTermLine('Initiating biometric scan...', 'system');
    profileImage.classList.add('scanning');

    setTimeout(function () {
      profileImage.classList.remove('scanning');
      profileImage.classList.add('scanned');
      scanDone = true;
      discover('scan');

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
    }, 1600);
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

    if (hackScore > hackBest) {
      hackBest = hackScore;
      localStorage.setItem('hackBest', hackBest);
      hackBestEl.textContent = hackBest;
    }

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
        setTimeout(nextHackWord, 300);
      } else {
        hackWordEl.className = 'hack-word wrong';
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

  // ===== TERMINAL COMMANDS =====
  var commands = {
    help: function () {
      addTermLine('Available commands:', 'system');
      addTermLine('  <span class="cmd-hint">about</span>     - Who am I');
      addTermLine('  <span class="cmd-hint">skills</span>    - Tech stack analysis');
      addTermLine('  <span class="cmd-hint">projects</span>  - Things I built');
      addTermLine('  <span class="cmd-hint">contact</span>   - How to reach me');
      addTermLine('  <span class="cmd-hint">scan</span>      - Scan the profile');
      addTermLine('  <span class="cmd-hint">matrix</span>    - Toggle matrix rain');
      addTermLine('  <span class="cmd-hint">status</span>    - Exploration progress');
      addTermLine('  <span class="cmd-hint">clear</span>     - Clear screen');
      addTermLine('  <span class="cmd-hint">exit</span>      - Return to top');
      if (discoveries['snake_unlock']) {
        addTermLine('  <span class="cmd-hint">snake</span>     - Play Snake [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">snake</span>     - ??? (explore to unlock)', 'info');
      }
      if (discoveries['hack_unlock']) {
        addTermLine('  <span class="cmd-hint">hack</span>      - Decode challenge [UNLOCKED]', 'success');
      } else {
        addTermLine('  <span class="cmd-hint">hack</span>      - ??? (explore to unlock)', 'info');
      }
      discover('help');
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
        addTermLine('  Snake unlocks at 25%', 'info');
      }
      if (!discoveries['hack_unlock']) {
        addTermLine('  Hack unlocks at 42%', 'info');
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
    helpme: function () {
      addTermLine('Did you mean <span class="cmd-hint">help</span>?', 'info');
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

  terminalInput.addEventListener('keydown', function (e) {
    if (snakeGameActive || hackActive) return;

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
    if (!snakeGameActive && !hackActive && bootComplete) {
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

    if (score > hiScore) {
      hiScore = score;
      localStorage.setItem('snakeHiScore', hiScore);
      hiscoreEl.textContent = hiScore;
    }

    overlayTitle.textContent = 'GAME OVER';
    overlayTitle.style.color = '#ff3131';
    overlayTitle.style.textShadow = '0 0 10px rgba(255,49,49,0.5), 0 0 40px rgba(255,49,49,0.2)';
    overlaySubtitle.textContent = 'SCORE: ' + score;
    startBtn.innerHTML = '<span class="btn-arrow">&#9654;</span> RETRY';
    overlay.classList.remove('hidden');

    if (score >= 100) {
      showAchievement('SNAKE MASTER! Score: ' + score);
    }
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
    initSnake();
  });

  gamePanelClose.addEventListener('click', closeSnakeGame);

  document.querySelectorAll('.ctrl-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!running) {
        snakeGameActive = true;
        overlayTitle.style.color = '';
        overlayTitle.style.textShadow = '';
        overlay.classList.add('hidden');
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

  // ===== INIT =====
  updateDiscoveryBar();
  drawSnakeFrame();
})();
