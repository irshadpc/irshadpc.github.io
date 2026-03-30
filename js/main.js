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
  var text = 'Built from thought. Finished with care.';
  var charIndex = 0;

  function typeWriter() {
    if (charIndex < text.length) {
      typewriterEl.textContent += text.charAt(charIndex);
      charIndex++;
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
        addXP(50);
        showAchievement('SECRET CODE! +50 XP');
        setTimeout(function () {
          document.body.style.animation = '';
        }, 1500);
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // ===== XP SYSTEM =====
  var totalXP = 0;
  var xpLevel = 1;
  var navXpValue = document.getElementById('navXpValue');
  var xpBarFill = document.getElementById('xpBarFill');
  var statLvl = document.getElementById('statLvl');
  var statLvlNum = document.getElementById('statLvlNum');
  var statExp = document.getElementById('statExp');
  var statExpNum = document.getElementById('statExpNum');

  function xpForLevel(lvl) {
    return lvl * 100;
  }

  function addXP(amount, sourceEl) {
    totalXP += amount;
    var needed = xpForLevel(xpLevel);
    while (totalXP >= needed) {
      totalXP -= needed;
      xpLevel++;
      needed = xpForLevel(xpLevel);
      showAchievement('LEVEL UP! LVL ' + xpLevel);
    }

    navXpValue.textContent = totalXP + '/' + needed;
    var pct = Math.min((totalXP / needed) * 100, 100);
    xpBarFill.style.width = pct + '%';

    statLvlNum.textContent = xpLevel;
    statLvl.style.width = Math.min(xpLevel * 10, 100) + '%';
    statExpNum.textContent = totalXP;
    statExp.style.width = pct + '%';

    if (sourceEl) {
      showXPPopup(amount, sourceEl);
    }
  }

  function showXPPopup(amount, el) {
    var rect = el.getBoundingClientRect();
    var popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = '+' + amount + ' XP';
    popup.style.left = rect.left + rect.width / 2 - 20 + 'px';
    popup.style.top = rect.top - 10 + 'px';
    document.body.appendChild(popup);
    setTimeout(function () { popup.remove(); }, 800);
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

  // ===== COLLECTIBLES =====
  var collectibleColors = ['#00f0ff', '#ff00ff', '#39ff14', '#ffe600', '#ff3131'];
  var collectibleShapes = ['&#9632;', '&#9670;', '&#9733;', '&#9679;'];
  var collectibleCount = 0;

  function spawnCollectible() {
    var el = document.createElement('div');
    el.className = 'collectible';
    var color = collectibleColors[Math.floor(Math.random() * collectibleColors.length)];
    var shape = collectibleShapes[Math.floor(Math.random() * collectibleShapes.length)];
    var size = Math.floor(Math.random() * 10 + 14);
    el.innerHTML = shape;
    el.style.color = color;
    el.style.fontSize = size + 'px';
    el.style.left = (Math.random() * 80 + 10) + '%';
    el.style.top = (Math.random() * 70 + 15) + '%';
    el.style.animationDelay = (Math.random() * 2) + 's';

    el.addEventListener('click', function () {
      if (el.classList.contains('collected')) return;
      el.classList.add('collected');
      var xpGain = Math.floor(Math.random() * 15 + 5);
      addXP(xpGain, el);
      collectibleCount++;
      if (collectibleCount === 1) {
        showAchievement('FIRST COLLECT! Explore more!');
      } else if (collectibleCount === 10) {
        showAchievement('COLLECTOR x10! +25 BONUS XP');
        addXP(25);
      } else if (collectibleCount === 25) {
        showAchievement('MASTER COLLECTOR x25!');
      }
      setTimeout(function () { el.remove(); }, 400);
    });

    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.remove();
    }, 8000);
  }

  setInterval(function () {
    if (document.querySelectorAll('.collectible').length < 3) {
      spawnCollectible();
    }
  }, 4000);

  setTimeout(spawnCollectible, 2000);
  setTimeout(spawnCollectible, 3500);

  // ===== PROFILE IMAGE CLICK =====
  var profileImage = document.getElementById('profileImage');
  var imageClickHint = document.getElementById('imageClickHint');
  var profileClicks = 0;
  var profileMessages = [
    'Hey! That tickles!',
    'Stop poking me!',
    'Still here!',
    'Okay, you found me!',
    '+10 XP for curiosity!',
    'You really like clicking!',
    'Have you tried the terminal?',
    'Type "help" in the terminal!',
    'Try "snake" for a surprise!',
    'Konami code: Up Up Down Down...'
  ];

  profileImage.addEventListener('click', function () {
    profileClicks++;
    profileImage.classList.remove('clicked');
    void profileImage.offsetWidth;
    profileImage.classList.add('clicked');

    if (imageClickHint && !imageClickHint.classList.contains('hidden')) {
      imageClickHint.classList.add('hidden');
      addXP(5, profileImage);
      showAchievement('CURIOUS CLICKER +5 XP');
    } else {
      addXP(3, profileImage);
    }

    var msg = profileMessages[Math.min(profileClicks - 1, profileMessages.length - 1)];
    addTermLine(msg, 'info');
  });

  // ===== INTERACTIVE TERMINAL =====
  var terminalInput = document.getElementById('terminalInput');
  var terminalOutput = document.getElementById('terminalOutput');
  var terminalBody = document.getElementById('terminalBody');
  var gamePanel = document.getElementById('gamePanel');
  var mainTerminal = document.getElementById('mainTerminal');
  var commandHistory = [];
  var historyIndex = -1;
  var terminalUsed = false;

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

  var commands = {
    help: function () {
      addTermLine('Available commands:', 'system');
      addTermLine('  <span class="cmd-hint">about</span>     - Who am I');
      addTermLine('  <span class="cmd-hint">skills</span>    - My tech stack');
      addTermLine('  <span class="cmd-hint">projects</span>  - Things I built');
      addTermLine('  <span class="cmd-hint">contact</span>   - Reach me');
      addTermLine('  <span class="cmd-hint">snake</span>     - Play a game!');
      addTermLine('  <span class="cmd-hint">matrix</span>    - Toggle matrix rain');
      addTermLine('  <span class="cmd-hint">clear</span>     - Clear terminal');
      addTermLine('  <span class="cmd-hint">exit</span>      - Back to top');
      addTermLine('  <span class="cmd-hint">easter</span>    - ???');
      addXP(2);
    },
    about: function () {
      addTermLine('IRSHAD PC // SOFTWARE ENGINEER', 'system');
      addTermLine('An enthusiastic thinker and engineer with a deep');
      addTermLine('appreciation for mathematics and computer science.');
      addTermLine('I love building things that live on the internet.');
      addTermLine('My goal is always pixel-perfect, performant experiences.');
      addTermLine('LOCATION: India | EMAIL: irshadpc@yahoo.in', 'info');
      addXP(3);
    },
    skills: function () {
      addTermLine('TECH STACK:', 'system');
      addTermLine('  FRONTEND  &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9617;  React, Vue, TypeScript, JS');
      addTermLine('  BACKEND   &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9617;&#9617;  Node.js, Python, Go');
      addTermLine('  DATABASE  &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9617;&#9617;&#9617;  PostgreSQL, MongoDB, Redis');
      addTermLine('  DEVOPS    &#9608;&#9608;&#9608;&#9608;&#9608;&#9617;&#9617;&#9617;&#9617;  Docker, AWS, CI/CD');
      addTermLine('  MOBILE    &#9608;&#9608;&#9608;&#9608;&#9617;&#9617;&#9617;&#9617;&#9617;  React Native, Flutter');
      addXP(3);
    },
    projects: function () {
      addTermLine('FEATURED PROJECTS:', 'system');
      addTermLine('  [01] Portfolio v3    - This retro site!');
      addTermLine('  [02] Open Source     - github.com/irshadpc');
      addTermLine('  [03] Side Projects   - Always exploring');
      addTermLine('Type <span class="cmd-hint">github</span> to visit my profile.', 'info');
      addXP(3);
    },
    contact: function () {
      addTermLine('REACH ME AT:', 'system');
      addTermLine('  Email: <a href="mailto:irshadpc@yahoo.in">irshadpc@yahoo.in</a>');
      addTermLine('  LinkedIn: <a href="https://www.linkedin.com/in/irshad-pc-1aaa3814" target="_blank">irshad-pc</a>');
      addTermLine('  GitHub: <a href="https://github.com/irshadpc" target="_blank">irshadpc</a>');
      addTermLine('  Twitter: <a href="https://twitter.com/_irshadpc" target="_blank">@_irshadpc</a>');
      addXP(3);
    },
    snake: function () {
      addTermLine('Launching SNAKE... Use arrow keys to play!', 'success');
      addTermLine('Press ESC to exit back to terminal.', 'info');
      gamePanel.classList.remove('hidden');
      mainTerminal.style.display = 'none';
      addXP(10);
      showAchievement('GAME UNLOCKED! +10 XP');
      resetSnakeGame();
    },
    matrix: function () {
      addTermLine('Matrix rain: not yet implemented. Stay tuned!', 'info');
      addXP(2);
    },
    clear: function () {
      clearTerminal();
      addXP(1);
    },
    exit: function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      addTermLine('Returning to base...', 'system');
      addXP(1);
    },
    github: function () {
      addTermLine('Opening GitHub...', 'info');
      window.open('https://github.com/irshadpc', '_blank');
      addXP(2);
    },
    easter: function () {
      var msgs = [
        'The cake is a lie.',
        'There is no spoon.',
        'Do a barrel roll!',
        'All your base are belong to us.',
        'The answer is 42.',
        'Konami code works here too...'
      ];
      addTermLine(msgs[Math.floor(Math.random() * msgs.length)], 'info');
      addXP(5);
      showAchievement('EASTER EGG! +5 XP');
    },
    sudo: function () {
      addTermLine('Nice try. Access denied.', 'error');
      addXP(2);
    },
    hello: function () {
      addTermLine('Hello, fellow explorer! Keep going!', 'success');
      addXP(2);
    },
    ls: function () {
      addTermLine('about.txt  skills.dat  projects/  contact.md  snake.exe  secret.zip', 'system');
      addXP(2);
    },
    cat: function (args) {
      if (args && args.indexOf('secret') !== -1) {
        addTermLine('ACCESS DENIED. Try harder.', 'error');
        addXP(5);
        showAchievement('FOUND SECRET FILE! +5 XP');
      } else {
        addTermLine('Usage: cat &lt;filename&gt;', 'info');
      }
    },
    whoami: function () {
      addTermLine('You are Player One. An explorer of this digital realm.', 'system');
      addXP(2);
    },
    date: function () {
      addTermLine(new Date().toLocaleString(), 'system');
      addXP(1);
    },
    xp: function () {
      addTermLine('Level: ' + xpLevel + ' | XP: ' + totalXP + '/' + xpForLevel(xpLevel) + ' | Collectibles: ' + collectibleCount, 'info');
      addXP(1);
    }
  };

  function processCommand(input) {
    var parts = input.trim().toLowerCase().split(/\s+/);
    var cmd = parts[0];
    var args = parts.slice(1).join(' ');

    if (!cmd) return;

    if (!terminalUsed) {
      terminalUsed = true;
      addXP(5);
      showAchievement('TERMINAL ACTIVATED! +5 XP');
    }

    commandHistory.unshift(input);
    historyIndex = -1;

    if (commands[cmd]) {
      addCmdEcho(input);
      commands[cmd](args);
    } else {
      addCmdEcho(input);
      addTermLine('Command not found: ' + escapeHtml(cmd) + '. Type <span class="cmd-hint">help</span>', 'error');
      addXP(1);
    }
  }

  terminalInput.addEventListener('keydown', function (e) {
    if (snakeGameActive) {
      return;
    }

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
    if (!snakeGameActive) {
      terminalInput.focus();
    }
  });

  // ===== SNAKE GAME (in terminal) =====
  var canvas = document.getElementById('gameCanvas');
  var ctx = canvas.getContext('2d');
  var overlay = document.getElementById('gameOverlay');
  var overlayTitle = document.getElementById('overlayTitle');
  var overlaySubtitle = document.getElementById('overlaySubtitle');
  var startBtn = document.getElementById('gameStartBtn');
  var scoreEl = document.getElementById('score');
  var hiscoreEl = document.getElementById('hiscore');
  var controlsEl = document.getElementById('gameControls');
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

    var xpEarned = Math.floor(score / 2);
    addXP(xpEarned);

    overlayTitle.textContent = 'GAME OVER';
    overlayTitle.style.color = '#ff3131';
    overlayTitle.style.textShadow = '0 0 10px rgba(255,49,49,0.5), 0 0 40px rgba(255,49,49,0.2)';
    overlaySubtitle.textContent = 'SCORE: ' + score + ' | +' + xpEarned + ' XP';
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
    if (e.key === 'Escape' && snakeGameActive) {
      closeSnakeGame();
      return;
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

  // ===== SECTION VISIT XP =====
  var visitedSections = {};
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          if (!visitedSections[id]) {
            visitedSections[id] = true;
            addXP(5);
            if (id === 'about') {
              showAchievement('SECTION EXPLORED: ABOUT +5 XP');
              setTimeout(function () { terminalInput.focus(); }, 500);
            }
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ===== INIT =====
  addXP(0);
  drawSnakeFrame();
})();
