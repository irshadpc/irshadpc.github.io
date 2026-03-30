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

  var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var konamiIndex = 0;

  document.addEventListener('keydown', function (e) {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        document.body.style.animation = 'glitch 0.3s ease 5';
        setTimeout(function () {
          document.body.style.animation = '';
        }, 1500);
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
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
  var controlsEl = document.getElementById('gameControls');

  var GRID = 20;
  var COLS = canvas.width / GRID;
  var ROWS = canvas.height / GRID;
  var snake, dir, nextDir, food, score, hiScore, gameLoop, running, speed;

  hiScore = parseInt(localStorage.getItem('snakeHiScore')) || 0;
  hiscoreEl.textContent = hiScore;

  function init() {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    speed = 120;
    running = true;
    scoreEl.textContent = '0';
    placeFood();
    drawFrame();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, speed);
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

  function update() {
    if (!running) return;

    dir = { x: nextDir.x, y: nextDir.y };
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
        snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
      gameOver();
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
        gameLoop = setInterval(update, speed);
      }
    } else {
      snake.pop();
    }

    drawFrame();
  }

  function drawFrame() {
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

    ctx.fillStyle = '#ff3131';
    ctx.shadowColor = 'rgba(255, 49, 49, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * GRID + 2, food.y * GRID + 2, GRID - 4, GRID - 4);
    ctx.shadowBlur = 0;

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

  function gameOver() {
    running = false;
    clearInterval(gameLoop);

    if (score > hiScore) {
      hiScore = score;
      localStorage.setItem('snakeHiScore', hiScore);
      hiscoreEl.textContent = hiScore;
    }

    overlayTitle.textContent = 'GAME OVER';
    overlayTitle.style.color = '#ff3131';
    overlayTitle.style.textShadow = '0 0 10px rgba(255,49,49,0.5), 0 0 40px rgba(255,49,49,0.2)';
    overlaySubtitle.textContent = 'SCORE: ' + score + '  |  PRESS START';
    startBtn.innerHTML = '<span class="btn-arrow">&#9654;</span> RETRY';
    overlay.classList.remove('hidden');
  }

  function changeDir(nx, ny) {
    if (dir.x === -nx && dir.y === -ny) return;
    nextDir = { x: nx, y: ny };
  }

  startBtn.addEventListener('click', function () {
    overlayTitle.style.color = '';
    overlayTitle.style.textShadow = '';
    overlay.classList.add('hidden');
    init();
  });

  document.addEventListener('keydown', function (e) {
    if (!running && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      overlayTitle.style.color = '';
      overlayTitle.style.textShadow = '';
      overlay.classList.add('hidden');
      init();
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

  document.querySelectorAll('.ctrl-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!running) {
        overlayTitle.style.color = '';
        overlayTitle.style.textShadow = '';
        overlay.classList.add('hidden');
        init();
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

  drawFrame();
})();
