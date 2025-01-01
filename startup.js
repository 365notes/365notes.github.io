document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const currentYear = today.getFullYear;
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
      const decodedData = JSON.parse(atob(json.data));

      notes = decodedData;
      for (let i = 0; i < months.length; i++) {
        handleMonthCalendar(i);
      }
    })
    .catch((error) => console.error("Error loading notes:", error));

  function handleMonthCalendar(monthIndex) {
    const monthSection = document.getElementById(months[monthIndex]);

    if (monthSection) {
      const squares = monthSection.querySelectorAll(".calendar .square");

      squares.forEach((square) => {
        const day = parseInt(square.textContent, 10);

        mon = monthIndex < currentMonth;
        oth = monthIndex === currentMonth && day <= currentDay;
        yr = today.getFullYear() == currentYear;
        if ((mon || oth) && yr) {
          square.classList.add("allowed");
          square.onclick = function () {
            showPopup(monthIndex, day);
          };
        } else {
          square.classList.add("disabled");
        }
      });
    }
  }

  function showPopup(monthIndex, day) {
    // Format the date as "year-month-day"
    const dateStr = `2025-${monthIndex + 1}-${day}`;

    // Find the matching note
    const note = notes.find((n) => n.date === dateStr);

    // If a note is found, display it in the popup
    if (note) {
      document.getElementById("popup-title").innerHTML = note.title;
      document.getElementById("popup-content").innerHTML = note.content;
    } else {
      document.getElementById("popup-title").innerHTML = "No Event";
      document.getElementById("popup-content").innerHTML =
        "There is no event for this day.";
    }

    // Display the popup
    document.getElementById("popup").style.display = "block";
    document.getElementById("black").style.display = "block";
    document.body.classList.add("no-scroll");
  }
});
