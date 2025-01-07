// Skrypt licznika z efektami wizualnymi
document.addEventListener("DOMContentLoaded", () => {
  const salaryForm = document.getElementById("salaryForm");
  const counterDisplay = document.getElementById("counter");
  const overtimeSelect = document.getElementById("overtime");
  const overtimeHoursWrapper = document.getElementById("overtimeHoursWrapper");
  let intervalId;

  // Obsługa pola wyboru nadgodzin
  overtimeSelect.addEventListener("change", () => {
    if (overtimeSelect.value === "yes") {
      overtimeHoursWrapper.style.display = "block";
    } else {
      overtimeHoursWrapper.style.display = "none";
    }
  });

  // Obsługa formularza
  salaryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Pobieranie danych
    const grossSalary = parseFloat(
      document.getElementById("grossSalary").value
    );
    const startHour = document.getElementById("startHour").value;
    const overtime = document.getElementById("overtime").value;
    const overtimeHours =
      overtime === "yes"
        ? parseInt(document.getElementById("overtimeHours").value, 10)
        : 0;

    if (isNaN(grossSalary)) {
      alert("Podaj prawidłową kwotę brutto!");
      return;
    }

    // Obliczenia
    const hourlyRate = grossSalary / (8 * 5 * 4); // Zakładamy 4 tygodnie pracy w miesiącu
    const startHourInMinutes =
      parseInt(startHour.split(":")[0], 10) * 60 +
      parseInt(startHour.split(":")[1], 10);
    const workEndInMinutes = startHourInMinutes + 8 * 60 + overtimeHours * 60;

    if (intervalId) {
      clearInterval(intervalId);
    }

    let currentAmount = 0;

    intervalId = setInterval(() => {
      const now = new Date();
      const nowInMinutes = now.getHours() * 60 + now.getMinutes();

      if (
        nowInMinutes >= startHourInMinutes &&
        nowInMinutes <= workEndInMinutes
      ) {
        const elapsedMinutes = nowInMinutes - startHourInMinutes;
        const targetAmount = (elapsedMinutes / 60) * hourlyRate;

        // Płynne przejście do nowej wartości
        const increment = (targetAmount - currentAmount) / 10;
        currentAmount += increment;
        counterDisplay.textContent = currentAmount.toFixed(2);
      } else {
        counterDisplay.textContent = "0.00";
        currentAmount = 0; // Resetowanie licznika poza godzinami pracy
      }
    }, 1000); // Aktualizacja co sekundę
  });
});
