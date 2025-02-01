const template = "The word is bright than the sun is the word with love".split(" ");

const formatWord = (word) => {
    return `<div class="word">${[...word].map(letter => `<span class="letter">${letter}</span>`).join("")}</div>`;
};

const getRandomWord = (wordlist) => wordlist[Math.floor(Math.random() * wordlist.length)];

const newGame = () => {
    let isStarted = false;
    let timeLeft = 30; // 30 seconds countdown
    const wordContainer = document.getElementById("words");
    wordContainer.innerHTML = Array.from({ length: 100 }, () => formatWord(getRandomWord(template))).join("");

    let words = [...document.querySelectorAll(".word")];
    let currentWordIndex = 0;
    let currentLetterIndex = 0;

    const updateActiveLetter = () => {
        document.querySelectorAll(".letter.active").forEach(letter => letter.classList.remove("active"));
        document.querySelectorAll(".word.current").forEach(word => word.classList.remove("current"));

        let currentWord = words[currentWordIndex];
        if (currentWord) {
            currentWord.classList.add("current");
            let letters = [...currentWord.querySelectorAll(".letter")];
            if (currentLetterIndex < letters.length) {
                letters[currentLetterIndex].classList.add("active");
            }
        }
    };

    const updateTimer = () => {
        document.getElementById("time").innerText = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            // clearInterval(timerInterval);  // Stop the timer when it reaches 0
            let error = document.querySelectorAll(".letter.incorrect").length;
            console.log(`$Error: ${error} GameOver`);
        } else {
            timeLeft--;
        }
    };

    // Start the countdown timer when the game starts
    const startTimer = () => {
        const timerInterval = setInterval(updateTimer, 1000);
    };

    const handleKeydown = (e) => {
        if (!isStarted) {
            isStarted = true;
            startTimer();  // Start the timer when the game starts
        }

        let key = e.key;
        let currentWord = words[currentWordIndex];
        let letters = [...currentWord.querySelectorAll(".letter")];

        if (/^[a-zA-Z]$/.test(key)) {
            if (currentLetterIndex < letters.length) {
                let letter = letters[currentLetterIndex];
                if (letter.innerText === key) {
                    letter.classList.add("correct");
                } else {
                    if (letter.innerText.toLowerCase() === key.toLowerCase()) {
                        letter.title = (letter.innerText === letter.innerText.toLowerCase()) ? "Uppercase" : "Lowercase";
                    } else {
                        letter.title = "Incorrect Letter";
                    }
                    letter.classList.add("incorrect");
                }
                letter.classList.remove("active");
                currentLetterIndex++;
                updateActiveLetter();
            }
        } else if (key === " ") {
            letters.slice(currentLetterIndex).forEach(letter => letter.classList.add("incorrect"));
            currentWordIndex = Math.min(currentWordIndex + 1, words.length - 1);
            currentLetterIndex = 0;
            updateActiveLetter();
        } else if (key === "Backspace") {
            if (currentLetterIndex > 0) {
                currentLetterIndex--;
            } else if (currentWordIndex > 0) {
                currentWordIndex--;
                currentLetterIndex = words[currentWordIndex].querySelectorAll(".letter").length;
            }

            let letter = words[currentWordIndex].querySelectorAll(".letter")[currentLetterIndex];
            if (letter) {
                letter.classList.remove("correct", "incorrect");
            }
            updateActiveLetter();
        }

        document.getElementById("error-count").innerText = `Error: ${document.querySelectorAll(".letter.incorrect").length}`;
    };

    document.removeEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", handleKeydown);

    updateActiveLetter();
    document.getElementById("game").style.display = "block";  // Show the game area
};

document.getElementById("new-game-btn").addEventListener("click", () => {
    document.querySelector(".popup").style.display = "none";  // Hide the popup
    newGame();  // Start a new game
});

newGame();
