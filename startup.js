document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const currentYear = 2025;
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
            // JSON is already a normal array
            notes = json;

            for (let i = 0; i < months.length; i++) {
                handleMonthCalendar(i);
            }
        })
        .catch((error) => console.error("Error loading notes:", error));

    function handleMonthCalendar(monthIndex) {
        const monthSection = document.getElementById(months[monthIndex]);
        if (!monthSection) return;

        const squares = monthSection.querySelectorAll(".calendar .square");

        squares.forEach((square) => {
            const day = parseInt(square.textContent, 10);

            const mon = monthIndex < currentMonth;
            const oth = monthIndex === currentMonth && day <= currentDay;
            const yr = today.getFullYear() === currentYear;

            if ((mon || oth) && yr) {
                square.classList.add("allowed");
                square.onclick = () => showPopup(monthIndex, day);
            } else {
                square.classList.add("disabled");
            }
        });
    }

    function showPopup(monthIndex, day) {
        const dateStr = `2025-${monthIndex + 1}-${day}`;
        const note = notes.find((n) => n.date === dateStr);

        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = "";

        if (note) {
            document.getElementById("popup-title").textContent = note.title;

            if (note.content) {
                const decodedContent = atob(note.content);

                const contentPara = document.createElement("p");
                contentPara.textContent = decodedContent;
                popupContent.appendChild(contentPara);
            }

            if (note.image) {
                const img = document.createElement("img");
                img.src = note.image;
                img.alt = "Event Image";
                img.style.width = "100%";
                img.style.borderRadius = "10px";
                popupContent.appendChild(img);
            }
        } else {
            document.getElementById("popup-title").textContent = "No Event";
            popupContent.textContent = "There is no event for this day.";
        }

        document.getElementById("popup").style.display = "block";
        document.getElementById("black").style.display = "block";
        document.body.classList.add("no-scroll");
    }
});
