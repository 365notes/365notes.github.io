document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();

    // Detect current year from page or default to actual year
    // Check if "Back to 2024!" button exists (only on 2026 page)
    const pageTitle = document.title;
    const currentYear = pageTitle.includes("2025") ? 2025 : pageTitle.includes("2026") ? 2026 : today.getFullYear();

    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let notes = [];

    fetch("encoded.json")
        .then((response) => response.json())
        .then((json) => {
            notes = json;

            for (let i = 0; i < months.length; i++) {
                handleMonthCalendar(i);
            }

            // Auto-scroll to current day after calendars are set up
            scrollToCurrentDay();
        })
        .catch((error) => console.error("Error loading notes:", error));

    function handleMonthCalendar(monthIndex) {
        const monthSection = document.getElementById(months[monthIndex]);
        if (!monthSection) return;

        const squares = monthSection.querySelectorAll(".square");

        squares.forEach((square) => {
            const day = parseInt(square.textContent, 10);

            const mon = monthIndex < currentMonth;
            const oth = monthIndex === currentMonth && day <= currentDay;
            const yr = today.getFullYear() > currentYear;
            const yr2 = today.getFullYear() === currentYear;

            if (yr || (yr2 && (mon || oth))) {
                square.classList.add("allowed");
                square.onclick = () => showPopup(monthIndex, day);
            } else {
                square.classList.add("disabled");
            }
        });
    }

    function scrollToCurrentDay() {
        // Only scroll if we're in the correct year
        if (today.getFullYear() !== currentYear) return;

        const monthSection = document.getElementById(months[currentMonth]);
        if (!monthSection) return;

        const squares = monthSection.querySelectorAll(".square");
        let currentDaySquare = null;

        // Find the square for the current day
        squares.forEach((square) => {
            const day = parseInt(square.textContent, 10);
            if (day === currentDay) {
                currentDaySquare = square;
            }
        });

        if (currentDaySquare) {
            // Scroll so the current day square is near the top
            const offset = 100; // pixels from top
            const elementPosition = currentDaySquare.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }

    function renderNotePopup(note) {
        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = "";

        if (!note) {
            document.getElementById("popup-title").textContent = "No Event";
            popupContent.textContent = "There is no event for this day.";
            return;
        }

        document.getElementById("popup-title").textContent = note.title;

        if (note.content) {
            const decodedContent = atob(note.content);
            popupContent.innerHTML = decodedContent;
        }

        if (note.image) {
            const img = document.createElement("img");
            img.src = note.image;
            img.alt = "Event Image";
            img.style.width = "100%";
            img.style.borderRadius = "10px";
            popupContent.appendChild(img);
        }

        document.getElementById("popup").style.display = "block";
        document.getElementById("black").style.display = "block";
        document.body.classList.add("no-scroll");
    }

    function showPopup(monthIndex, day) {
        // Each page looks for notes from its own year
        const dateStr = `${currentYear}-${monthIndex + 1}-${day}`;
        const note = notes.find((n) => n.date === dateStr);
        renderNotePopup(note);
    }

    function showRandomFromPreviousYear() {
        const previousYear = currentYear - 1;
        const previousYearNotes = notes.filter((n) => n.date.startsWith(previousYear + "-"));

        if (previousYearNotes.length === 0) {
            renderNotePopup(null);
            return;
        }

        const randomNote = previousYearNotes[Math.floor(Math.random() * previousYearNotes.length)];
        renderNotePopup(randomNote);
    }

    // Setup random button if it exists (2026 page)
    const randomBtn = document.getElementById("random-note-btn");
    if (randomBtn) {
        randomBtn.onclick = showRandomFromPreviousYear;
    }
});
