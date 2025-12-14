// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Animate progress bar on load
    setTimeout(() => {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = progressFill.style.width;
        }
    }, 100);

    // Add hover effect to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Subject Selection and Challenge Path
    const subjectCards = document.querySelectorAll('.subject-card');
    const subjectSelection = document.getElementById('subject-selection');
    const challengePath = document.getElementById('challenge-path');
    const backBtn = document.getElementById('back-to-subjects');
    const pathTitle = document.getElementById('path-title');

    // Subject levels system - XP required increases significantly per level
    const subjectLevels = {
        matematicas: { xp: 450, level: 1 },
        lectura: { xp: 320, level: 1 },
        sociales: { xp: 180, level: 1 },
        naturales: { xp: 520, level: 2 },
        ingles: { xp: 90, level: 1 }
    };

    // XP required for each level (exponential growth)
    const xpPerLevel = [
        0,      // Level 0
        500,    // Level 1
        1500,   // Level 2
        3500,   // Level 3
        7000,   // Level 4
        12000   // Level 5 (max)
    ];

    const subjectData = {
        matematicas: {
            title: 'Matemáticas ICFES',
            color: '#1E88E5',
            icon: '🔢'
        },
        lectura: {
            title: 'Lectura Crítica ICFES',
            color: '#E53935',
            icon: '📖'
        },
        sociales: {
            title: 'Ciencias Sociales ICFES',
            color: '#FB8C00',
            icon: '🌍'
        },
        naturales: {
            title: 'Ciencias Naturales ICFES',
            color: '#43A047',
            icon: '🌿'
        },
        ingles: {
            title: 'Inglés ICFES',
            color: '#8E24AA',
            icon: '🔤'
        }
    };

    function getSubjectLevel(xp) {
        for (let i = xpPerLevel.length - 1; i >= 0; i--) {
            if (xp >= xpPerLevel[i]) {
                return i;
            }
        }
        return 0;
    }

    function getXpForNextLevel(currentXp, currentLevel) {
        if (currentLevel >= 5) return 0;
        return xpPerLevel[currentLevel + 1] - currentXp;
    }

    function updateSubjectHeader(subject) {
        const welcomeCard = document.querySelector('.welcome-card');
        const xpSection = document.getElementById('xp-section');
        const xpLevel = document.querySelector('.xp-level');
        const xpCurrent = document.querySelector('.xp-current');
        const xpTotal = document.querySelector('.xp-total');
        const progressFill = document.getElementById('progress-fill');
        const xpMessage = document.getElementById('xp-message');
        
        const data = subjectData[subject];
        const levelData = subjectLevels[subject];
        const level = getSubjectLevel(levelData.xp);
        const nextLevelXp = level < 5 ? xpPerLevel[level + 1] : xpPerLevel[5];
        const currentLevelXp = xpPerLevel[level];
        const xpInLevel = levelData.xp - currentLevelXp;
        const xpNeeded = nextLevelXp - currentLevelXp;
        const percentage = level < 5 ? (xpInLevel / xpNeeded) * 100 : 100;
        const xpToNext = getXpForNextLevel(levelData.xp, level);
        
        // Change welcome card color
        welcomeCard.style.background = `linear-gradient(135deg, ${data.color} 0%, ${data.color}dd 100%)`;
        
        // Update XP section
        xpLevel.textContent = `Nivel ${level} - ${data.title.replace(' ICFES', '')}`;
        xpCurrent.textContent = levelData.xp;
        xpTotal.textContent = level < 5 ? ` / ${nextLevelXp} XP` : ' XP (MAX)';
        progressFill.style.width = `${percentage}%`;
        
        if (level < 5) {
            xpMessage.textContent = `${xpToNext} XP para nivel ${level + 1}`;
        } else {
            xpMessage.textContent = '¡Nivel máximo alcanzado!';
        }
    }

    function calculateGeneralLevel() {
        let totalXp = 0;
        let totalLevels = 0;
        let subjectCount = 0;
        
        Object.keys(subjectLevels).forEach(subject => {
            totalXp += subjectLevels[subject].xp;
            totalLevels += getSubjectLevel(subjectLevels[subject].xp);
            subjectCount++;
        });
        
        const averageLevel = Math.floor(totalLevels / subjectCount);
        const averageXp = Math.floor(totalXp / subjectCount);
        
        return { level: averageLevel, xp: averageXp, totalXp: totalXp };
    }

    function resetToGeneralView() {
        const welcomeCard = document.querySelector('.welcome-card');
        const xpLevel = document.querySelector('.xp-level');
        const xpCurrent = document.querySelector('.xp-current');
        const xpTotal = document.querySelector('.xp-total');
        const progressFill = document.getElementById('progress-fill');
        const xpMessage = document.getElementById('xp-message');
        
        const generalData = calculateGeneralLevel();
        const level = generalData.level;
        const nextLevelXp = level < 5 ? xpPerLevel[level + 1] : xpPerLevel[5];
        const currentLevelXp = xpPerLevel[level];
        const xpInLevel = generalData.xp - currentLevelXp;
        const xpNeeded = nextLevelXp - currentLevelXp;
        const percentage = level < 5 ? (xpInLevel / xpNeeded) * 100 : 100;
        const xpToNext = getXpForNextLevel(generalData.xp, level);
        
        welcomeCard.style.background = 'linear-gradient(135deg, #e63946 0%, #d62839 100%)';
        xpLevel.textContent = `Nivel General ${level}`;
        xpCurrent.textContent = generalData.xp;
        xpTotal.textContent = level < 5 ? ` / ${nextLevelXp} XP` : ' XP (MAX)';
        progressFill.style.width = `${percentage}%`;
        
        if (level < 5) {
            xpMessage.textContent = `${xpToNext} XP para nivel ${level + 1}`;
        } else {
            xpMessage.textContent = '¡Nivel máximo alcanzado!';
        }
    }

    subjectCards.forEach(card => {
        card.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            const data = subjectData[subject];
            
            // Update subject header
            updateSubjectHeader(subject);
            
            // Update path title and colors
            pathTitle.textContent = data.title;
            pathTitle.style.borderBottomColor = data.color;
            
            // Update active node circle color
            const activeCircle = document.querySelector('.challenge-node.active .node-circle');
            if (activeCircle) {
                activeCircle.style.background = `linear-gradient(135deg, ${data.color} 0%, ${data.color}dd 100%)`;
            }

            // Show challenge path
            subjectSelection.style.display = 'none';
            challengePath.style.display = 'block';
        });
    });

    backBtn.addEventListener('click', function() {
        challengePath.style.display = 'none';
        subjectSelection.style.display = 'block';
        resetToGeneralView();
    });

    // Quiz System
    const quizModal = document.getElementById('quiz-modal');
    const resultsModal = document.getElementById('results-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const continueBtn = document.getElementById('continue-btn');
    const questionText = document.getElementById('question-text');
    const questionCounter = document.getElementById('question-counter');
    const optionsContainer = document.getElementById('options-container');
    const finalScore = document.getElementById('final-score');

    let currentQuestion = 0;
    let correctAnswers = 0;
    let selectedOption = null;
    let currentChallengeNode = null;
    let energy = 5;
    const MAX_ENERGY = 5;
    const ENERGY_REGEN_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
    let lastEnergyTime = Date.now();

    // Sample questions for different subjects
    const questions = {
        matematicas: [
            {
                question: "¿Cuál es el resultado de 2x + 5 = 15?",
                options: ["x = 3", "x = 5", "x = 7", "x = 10"],
                correct: 1
            },
            {
                question: "¿Cuál es el área de un círculo con radio 5?",
                options: ["25π", "10π", "15π", "20π"],
                correct: 0
            },
            {
                question: "¿Cuánto es 15% de 200?",
                options: ["20", "25", "30", "35"],
                correct: 2
            },
            {
                question: "¿Cuál es el valor de √64?",
                options: ["6", "7", "8", "9"],
                correct: 2
            },
            {
                question: "Si a² + b² = c², ¿cómo se llama este teorema?",
                options: ["Teorema de Tales", "Teorema de Pitágoras", "Teorema de Fermat", "Teorema de Euclides"],
                correct: 1
            }
        ],
        lectura: [
            {
                question: "¿Qué es una metáfora?",
                options: ["Una comparación directa", "Una figura retórica que identifica algo con otra cosa", "Un tipo de rima", "Una narración breve"],
                correct: 1
            },
            {
                question: "¿Cuál es el propósito principal de un texto argumentativo?",
                options: ["Entretener", "Informar", "Persuadir", "Describir"],
                correct: 2
            },
            {
                question: "¿Qué es un sinónimo?",
                options: ["Palabra con significado opuesto", "Palabra con significado similar", "Palabra compuesta", "Palabra derivada"],
                correct: 1
            },
            {
                question: "¿Qué tipo de texto es una biografía?",
                options: ["Narrativo", "Expositivo", "Argumentativo", "Descriptivo"],
                correct: 0
            },
            {
                question: "¿Cuál es la idea principal de un párrafo?",
                options: ["La primera oración", "El tema central", "La conclusión", "Los detalles"],
                correct: 1
            }
        ],
        sociales: [
            {
                question: "¿En qué año se descubrió América?",
                options: ["1492", "1500", "1498", "1502"],
                correct: 0
            },
            {
                question: "¿Cuál es la capital de Colombia?",
                options: ["Medellín", "Cali", "Bogotá", "Cartagena"],
                correct: 2
            },
            {
                question: "¿Qué es la democracia?",
                options: ["Gobierno de uno", "Gobierno del pueblo", "Gobierno militar", "Gobierno religioso"],
                correct: 1
            },
            {
                question: "¿Cuál es el continente más grande?",
                options: ["África", "América", "Asia", "Europa"],
                correct: 2
            },
            {
                question: "¿Quién fue Simón Bolívar?",
                options: ["Un científico", "Un libertador", "Un escritor", "Un explorador"],
                correct: 1
            }
        ],
        naturales: [
            {
                question: "¿Cuál es la fórmula química del agua?",
                options: ["H2O", "CO2", "O2", "H2O2"],
                correct: 0
            },
            {
                question: "¿Qué es la fotosíntesis?",
                options: ["Respiración de plantas", "Proceso de producción de alimento en plantas", "Reproducción vegetal", "Crecimiento de raíces"],
                correct: 1
            },
            {
                question: "¿Cuántos planetas tiene el sistema solar?",
                options: ["7", "8", "9", "10"],
                correct: 1
            },
            {
                question: "¿Qué tipo de animal es una ballena?",
                options: ["Pez", "Mamífero", "Reptil", "Anfibio"],
                correct: 1
            },
            {
                question: "¿Cuál es el órgano más grande del cuerpo humano?",
                options: ["El corazón", "El cerebro", "La piel", "El hígado"],
                correct: 2
            }
        ],
        ingles: [
            {
                question: "What is the past tense of 'go'?",
                options: ["Goed", "Went", "Gone", "Going"],
                correct: 1
            },
            {
                question: "Which word is a verb?",
                options: ["Beautiful", "Run", "Happy", "Quickly"],
                correct: 1
            },
            {
                question: "What does 'Hello' mean in Spanish?",
                options: ["Adiós", "Hola", "Gracias", "Por favor"],
                correct: 1
            },
            {
                question: "Complete: I ___ a student.",
                options: ["am", "is", "are", "be"],
                correct: 0
            },
            {
                question: "What is the plural of 'child'?",
                options: ["Childs", "Children", "Childes", "Childrens"],
                correct: 1
            }
        ]
    };

    let currentSubject = 'matematicas';
    let currentQuestions = questions.matematicas;

    // Challenge node click
    const challengeNodes = document.querySelectorAll('.challenge-node');
    challengeNodes.forEach(node => {
        node.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                // Active challenge - requires energy
                if (energy <= 0) {
                    const timeUntilNext = ENERGY_REGEN_TIME - (Date.now() - lastEnergyTime);
                    const minutesLeft = Math.ceil(timeUntilNext / 60000);
                    alert(`¡No tienes energía! Recuperarás 1 energía en ${minutesLeft} minutos.`);
                    return;
                }
                energy--;
                lastEnergyTime = Date.now();
                updateEnergyDisplay();
                currentChallengeNode = this;
                currentQuestion = 0;
                correctAnswers = 0;
                selectedOption = null;
                loadQuestion();
                quizModal.classList.add('show');
            } else if (this.classList.contains('completed')) {
                // Completed challenge - can retry with energy cost
                if (energy <= 0) {
                    const timeUntilNext = ENERGY_REGEN_TIME - (Date.now() - lastEnergyTime);
                    const minutesLeft = Math.ceil(timeUntilNext / 60000);
                    alert(`¡No tienes energía! Recuperarás 1 energía en ${minutesLeft} minutos.`);
                    return;
                }
                const confirmRetry = confirm('Este desafío ya está completado. ¿Quieres repetirlo? Costará 1 energía.');
                if (confirmRetry) {
                    energy--;
                    lastEnergyTime = Date.now();
                    updateEnergyDisplay();
                    currentChallengeNode = this;
                    currentQuestion = 0;
                    correctAnswers = 0;
                    selectedOption = null;
                    loadQuestion();
                    quizModal.classList.add('show');
                }
            }
        });
    });

    function updateEnergyDisplay() {
        document.querySelector('.energy-amount').textContent = `${energy}/${MAX_ENERGY}`;
        updateEnergyTimer();
        saveEnergyData();
    }

    function updateEnergyTimer() {
        const timerElement = document.getElementById('energy-timer');
        if (!timerElement) return;

        if (energy >= MAX_ENERGY) {
            timerElement.textContent = 'FULL';
            return;
        }

        const timePassed = Date.now() - lastEnergyTime;
        const timeRemaining = ENERGY_REGEN_TIME - timePassed;
        
        if (timeRemaining <= 0) {
            timerElement.textContent = '00:00';
            return;
        }

        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Energy regeneration system
    function initEnergySystem() {
        // Load saved energy data
        const savedEnergy = localStorage.getItem('energy');
        const savedTime = localStorage.getItem('lastEnergyTime');
        
        if (savedEnergy !== null && savedTime !== null) {
            energy = parseInt(savedEnergy);
            lastEnergyTime = parseInt(savedTime);
            
            // Calculate energy regenerated while away
            const timePassed = Date.now() - lastEnergyTime;
            const energyToAdd = Math.floor(timePassed / ENERGY_REGEN_TIME);
            
            if (energyToAdd > 0 && energy < MAX_ENERGY) {
                energy = Math.min(energy + energyToAdd, MAX_ENERGY);
                lastEnergyTime = Date.now();
                saveEnergyData();
            }
        }
        
        updateEnergyDisplay();
        startEnergyTimer();
    }

    function saveEnergyData() {
        localStorage.setItem('energy', energy.toString());
        localStorage.setItem('lastEnergyTime', lastEnergyTime.toString());
    }

    function startEnergyTimer() {
        setInterval(() => {
            // Update timer display
            updateEnergyTimer();

            if (energy < MAX_ENERGY) {
                const timePassed = Date.now() - lastEnergyTime;
                
                if (timePassed >= ENERGY_REGEN_TIME) {
                    energy++;
                    lastEnergyTime = Date.now();
                    updateEnergyDisplay();
                    
                    // Show notification
                    showEnergyNotification();
                }
            }
        }, 1000); // Check every second
    }

    function showEnergyNotification() {
        const notification = document.createElement('div');
        notification.className = 'energy-notification';
        notification.innerHTML = `
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
            </svg>
            <span>+1 Energía recuperada</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Initialize energy system
    initEnergySystem();

    function loadQuestion() {
        if (currentQuestion >= currentQuestions.length) {
            showResults();
            return;
        }

        const q = currentQuestions[currentQuestion];
        questionText.textContent = q.question;
        questionCounter.textContent = `Pregunta ${currentQuestion + 1} de ${currentQuestions.length}`;
        
        optionsContainer.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.dataset.option = index;
            btn.innerHTML = `
                <span class="option-letter">${letters[index]}</span>
                <span class="option-text">${option}</span>
            `;
            btn.addEventListener('click', selectOption);
            optionsContainer.appendChild(btn);
        });

        checkAnswerBtn.style.display = 'inline-block';
        nextQuestionBtn.style.display = 'none';
        selectedOption = null;
    }

    function selectOption(e) {
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => btn.classList.remove('selected'));
        
        const btn = e.currentTarget;
        btn.classList.add('selected');
        selectedOption = parseInt(btn.dataset.option);
    }

    checkAnswerBtn.addEventListener('click', function() {
        if (selectedOption === null) {
            alert('Por favor selecciona una respuesta');
            return;
        }

        const q = currentQuestions[currentQuestion];
        const optionBtns = document.querySelectorAll('.option-btn');
        
        optionBtns.forEach(btn => {
            btn.classList.add('disabled');
            const index = parseInt(btn.dataset.option);
            
            if (index === q.correct) {
                btn.classList.add('correct');
            } else if (index === selectedOption && selectedOption !== q.correct) {
                btn.classList.add('incorrect');
            }
        });

        if (selectedOption === q.correct) {
            correctAnswers++;
        }

        checkAnswerBtn.style.display = 'none';
        nextQuestionBtn.style.display = 'inline-block';
    });

    nextQuestionBtn.addEventListener('click', function() {
        currentQuestion++;
        loadQuestion();
    });

    function showResults() {
        quizModal.classList.remove('show');
        finalScore.textContent = `${correctAnswers}/${currentQuestions.length}`;
        
        // Update coins and XP
        const coinsEarned = correctAnswers * 10;
        const xpEarned = correctAnswers * 20;
        
        document.querySelector('.reward-amount').textContent = `+${coinsEarned} Monedas`;
        document.querySelectorAll('.reward-amount')[1].textContent = `+${xpEarned} XP`;
        
        resultsModal.classList.add('show');
    }

    closeModalBtn.addEventListener('click', function() {
        quizModal.classList.remove('show');
    });

    continueBtn.addEventListener('click', function() {
        resultsModal.classList.remove('show');
        
        // Update header coins
        const currentCoins = parseInt(document.querySelector('.coin-amount').textContent);
        const coinsEarned = correctAnswers * 10;
        const xpEarned = correctAnswers * 20;
        
        document.querySelector('.coin-amount').textContent = currentCoins + coinsEarned;
        
        // Update subject XP
        if (currentSubject && subjectLevels[currentSubject]) {
            subjectLevels[currentSubject].xp += xpEarned;
            subjectLevels[currentSubject].level = getSubjectLevel(subjectLevels[currentSubject].xp);
            updateSubjectHeader(currentSubject);
            saveSubjectLevels();
        }
        
        // Update challenge node with stars based on score
        if (currentChallengeNode) {
            updateChallengeStars(currentChallengeNode, correctAnswers, currentQuestions.length);
            
            // Mark as completed if it was active
            if (currentChallengeNode.classList.contains('active')) {
                currentChallengeNode.classList.remove('active');
                currentChallengeNode.classList.add('completed');
                
                // Remove badge
                const badge = currentChallengeNode.querySelector('.node-badge');
                if (badge) {
                    badge.remove();
                }
                
                // Update icon to checkmark
                const icon = currentChallengeNode.querySelector('.node-icon');
                if (icon) {
                    icon.innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>';
                }
                
                // Unlock next challenge
                unlockNextChallenge();
            }
        }
    });

    function updateChallengeStars(node, correct, total) {
        const starsContainer = node.querySelector('.node-stars');
        if (!starsContainer) return;
        
        const percentage = (correct / total) * 100;
        let filledStars = 0;
        
        if (percentage >= 90) filledStars = 3;
        else if (percentage >= 60) filledStars = 2;
        else if (percentage >= 40) filledStars = 1;
        
        starsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            star.setAttribute('class', i < filledStars ? 'star filled' : 'star');
            star.setAttribute('viewBox', '0 0 24 24');
            star.setAttribute('fill', i < filledStars ? '#FFD700' : '#E0E0E0');
            star.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            star.innerHTML = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
            starsContainer.appendChild(star);
        }
    }

    function unlockNextChallenge() {
        const allNodes = document.querySelectorAll('.challenge-node');
        let foundCurrent = false;
        
        allNodes.forEach(node => {
            if (foundCurrent && node.classList.contains('locked')) {
                node.classList.remove('locked');
                node.classList.add('active');
                
                // Add badge with challenge number
                const challengeNum = node.getAttribute('data-challenge');
                const badge = document.createElement('div');
                badge.className = 'node-badge';
                badge.textContent = challengeNum;
                node.querySelector('.node-circle').appendChild(badge);
                
                // Update line color before this node
                const prevLine = node.previousElementSibling;
                if (prevLine && prevLine.classList.contains('path-line')) {
                    const line = prevLine.querySelector('line');
                    if (line) {
                        line.setAttribute('stroke', '#e63946');
                    }
                }
                
                foundCurrent = false;
            }
            
            if (node === currentChallengeNode) {
                foundCurrent = true;
            }
        });
    }

    // Update questions when subject changes
    subjectCards.forEach(card => {
        card.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            currentSubject = subject;
            currentQuestions = questions[subject];
        });
    });

    // Save and load subject levels
    function saveSubjectLevels() {
        localStorage.setItem('subjectLevels', JSON.stringify(subjectLevels));
    }

    function loadSubjectLevels() {
        const saved = localStorage.getItem('subjectLevels');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.keys(loaded).forEach(key => {
                if (subjectLevels[key]) {
                    subjectLevels[key] = loaded[key];
                }
            });
        }
    }

    // Load saved levels on start
    loadSubjectLevels();
    
    // Initialize general view with calculated values
    resetToGeneralView();

    // Calendar filter for materias
    const calendarSelect = document.getElementById('calendar-select');
    const materiaCards = document.querySelectorAll('.materia-card');

    if (calendarSelect) {
        calendarSelect.addEventListener('change', function() {
            const selectedCalendar = this.value;
            
            materiaCards.forEach(card => {
                const calendars = card.getAttribute('data-calendars').split(',');
                
                if (calendars.includes(selectedCalendar)) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.animation = 'fadeIn 0.3s ease';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // Redirect to materia page when clicking on clickable materia cards
    const clickableMaterias = document.querySelectorAll('.clickable-materia');
    clickableMaterias.forEach(card => {
        card.addEventListener('click', function() {
            const materiaUrl = this.getAttribute('data-materia-url');
            if (materiaUrl) {
                window.location.href = materiaUrl;
            }
        });
    });

});


    // Tienda - Buy buttons
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.tienda-item');
            const itemName = item.querySelector('.item-name').textContent;
            const priceElement = item.querySelector('.item-price');
            const priceText = priceElement.textContent.trim();
            const price = parseInt(priceText.match(/\d+/)[0]);
            
            const currentCoins = parseInt(document.querySelector('.coin-amount').textContent);
            
            if (currentCoins >= price) {
                const confirmPurchase = confirm(`¿Quieres comprar "${itemName}" por ${price} monedas?`);
                if (confirmPurchase) {
                    // Deduct coins
                    const newCoins = currentCoins - price;
                    document.querySelector('.coin-amount').textContent = newCoins;
                    
                    // Update balance in tienda if exists
                    const balanceAmount = document.querySelector('.balance-amount');
                    if (balanceAmount) {
                        balanceAmount.textContent = newCoins;
                    }
                    
                    // Show success message
                    alert(`¡Compra exitosa! Has adquirido "${itemName}"`);
                    
                    // Apply item effect based on name
                    if (itemName.includes('Energía')) {
                        const energyAmount = document.querySelector('.energy-amount');
                        if (energyAmount) {
                            const currentEnergy = parseInt(energyAmount.textContent.split('/')[0]);
                            let newEnergy = currentEnergy;
                            
                            if (itemName.includes('1 Energía')) {
                                newEnergy = Math.min(currentEnergy + 1, 5);
                            } else if (itemName.includes('3 Energías')) {
                                newEnergy = Math.min(currentEnergy + 3, 5);
                            } else if (itemName.includes('Completa')) {
                                newEnergy = 5;
                            }
                            
                            energyAmount.textContent = `${newEnergy}/5`;
                            energy = newEnergy;
                            updateEnergyDisplay();
                        }
                    }
                }
            } else {
                alert(`No tienes suficientes monedas. Necesitas ${price - currentCoins} monedas más.`);
            }
        });
    });
