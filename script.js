document.addEventListener("DOMContentLoaded", () => {
  const salaryForm = document.getElementById("salaryForm");
  const counterDisplay = document.getElementById("counter");
  const overtimeSelect = document.getElementById("overtime");
  const overtimeHoursWrapper = document.getElementById("overtimeHoursWrapper");
  let intervalId;

  // Funkcja obliczająca liczbę dni roboczych w danym miesiącu
  const calculateWorkdays = (year, month) => {
    const publicHolidays = [
      "01-01", // Nowy Rok
      "05-01", // Święto Pracy
      "05-03", // Święto Konstytucji
      "11-01", // Wszystkich Świętych
      "11-11", // Święto Niepodległości
      "12-25", // Boże Narodzenie (1. dzień)
      "12-26", // Boże Narodzenie (2. dzień)
    ];
    let workdays = 0;

    // Iteracja po wszystkich dniach miesiąca
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const formattedDate = date.toISOString().slice(5, 10);

      // Dodajemy tylko dni robocze (poniedziałek-piątek) i niebędące świętami
      if (
        dayOfWeek !== 0 &&
        dayOfWeek !== 6 &&
        !publicHolidays.includes(formattedDate)
      ) {
        workdays++;
      }
    }

    return workdays;
  };

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

    // Pobieranie danych z formularza
    const grossSalary = parseFloat(
      document.getElementById("grossSalary").value
    );
    const startHour = document.getElementById("startHour").value;
    const overtime = document.getElementById("overtime").value;
    let overtimeHours =
      overtime === "yes"
        ? parseInt(document.getElementById("overtimeHours").value, 10)
        : 0;

    if (isNaN(grossSalary)) {
      alert("Podaj prawidłową kwotę brutto!");
      return;
    }

    // Walidacja liczby nadgodzin (maksymalnie 5)
    if (overtimeHours > 5) {
      alert("Maksymalna liczba nadgodzin to 5!");
      overtimeHours = 5;
    }

    // Obliczenia podstawowe
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Obecny miesiąc
    const workdays = calculateWorkdays(year, month);
    const hourlyRate = grossSalary / (workdays * 8); // Stawka godzinowa netto
    const overtimeRate1 = hourlyRate * 1.5; // Dodatek 50% za pierwsze 2 nadgodziny
    const overtimeRate2 = hourlyRate * 2; // Dodatek 100% za kolejne nadgodziny
    const weekendRate = hourlyRate * 3; // Stawka 300% za weekendy/święta

    const startHourInMinutes =
      parseInt(startHour.split(":")[0], 10) * 60 +
      parseInt(startHour.split(":")[1], 10);
    const workEndInMinutes = startHourInMinutes + 8 * 60 + overtimeHours * 60;

    if (intervalId) {
      clearInterval(intervalId);
    }

    let currentAmount = 0;

    const updateCounter = () => {
      const now = new Date();
      const nowInMinutes = now.getHours() * 60 + now.getMinutes();

      if (
        nowInMinutes >= startHourInMinutes &&
        nowInMinutes <= workEndInMinutes
      ) {
        const elapsedMinutes = nowInMinutes - startHourInMinutes;

        // Obliczanie podstawowej wypłaty
        const isWeekend =
          now.getDay() === 0 || now.getDay() === 6 || isPublicHoliday(now);
        let baseEarned = 0;
        if (isWeekend) {
          baseEarned = (elapsedMinutes / 60) * weekendRate; // 300% stawki w weekend/święto
        } else {
          baseEarned = (elapsedMinutes / 60) * hourlyRate; // 100% stawki
        }

        // Obliczanie nadgodzin
        let overtimeEarned = 0;
        if (!isWeekend && overtimeHours > 0) {
          const firstTwoHours = Math.min(overtimeHours, 2);
          const remainingHours = Math.max(0, overtimeHours - 2);

          overtimeEarned += firstTwoHours * overtimeRate1; // Dodatek 50%
          overtimeEarned += remainingHours * overtimeRate2; // Dodatek 100%
        } else if (isWeekend) {
          overtimeEarned = overtimeHours * weekendRate; // 300% stawki za każdą godzinę w weekend
        }

        const totalEarned = baseEarned + overtimeEarned;

        // Płynne przejście do nowej wartości
        const increment = (totalEarned - currentAmount) / 10;
        currentAmount += increment;
        counterDisplay.textContent = currentAmount.toFixed(2);
      } else {
        counterDisplay.textContent = currentAmount.toFixed(2);
      }
    };

    // Natychmiastowe obliczenie przy pierwszym uruchomieniu
    updateCounter();

    // Aktualizacja co sekundę
    intervalId = setInterval(updateCounter, 1000);
  });
});
