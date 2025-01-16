document.addEventListener("DOMContentLoaded", () => {
  console.log("Skrypt uruchomiony");

  const salaryForm = document.getElementById("salaryForm");
  const counterDisplay = document.getElementById("counter");
  let intervalId;

  if (!salaryForm || !counterDisplay) {
    console.error("Nie znaleziono formularza lub licznika w DOM!");
    return;
  }

  salaryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Formularz przesłany");

    // Pobieranie danych
    const grossSalary = parseFloat(
      document.getElementById("grossSalary").value
    );
    const startHour = document.getElementById("startHour").value;

    if (isNaN(grossSalary) || !startHour) {
      console.error("Nieprawidłowe dane wejściowe!");
      alert("Podaj prawidłową kwotę brutto i godzinę rozpoczęcia pracy!");
      return;
    }

    console.log(
      `Kwota brutto: ${grossSalary}, godzina rozpoczęcia: ${startHour}`
    );

    // Obliczanie stawki godzinowej
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const workdays = daysInMonth - 8; // Zakładamy 8 dni wolnych (soboty i niedziele)

    const hourlyRate = grossSalary / (workdays * 8);
    console.log(`Stawka godzinowa: ${hourlyRate.toFixed(5)} PLN`);

    // Obliczenie czasu rozpoczęcia pracy w minutach
    const startHourInMinutes =
      parseInt(startHour.split(":")[0], 10) * 60 +
      parseInt(startHour.split(":")[1], 10);

    if (intervalId) clearInterval(intervalId); // Zatrzymanie poprzedniego licznika, jeśli już działał

    // Obliczenie natychmiastowej kwoty od godziny rozpoczęcia pracy do teraz
    const nowInMinutes = now.getHours() * 60 + now.getMinutes();
    let currentAmount = 0;

    if (nowInMinutes >= startHourInMinutes) {
      const elapsedMinutes = nowInMinutes - startHourInMinutes; // Minuty od rozpoczęcia pracy
      currentAmount = (elapsedMinutes / 60) * hourlyRate; // Zarobiona kwota
      console.log(`Kwota wyliczona od razu: ${currentAmount.toFixed(5)} PLN`);
    }

    // Wyświetlenie kwoty wyliczonej do chwili obecnej
    counterDisplay.textContent = `${currentAmount.toFixed(5)} PLN`;

    // Rozpoczęcie płynnego liczenia od tej kwoty
    let lastUpdate = Date.now();

    const updateCounter = () => {
      const now = Date.now();
      const elapsedMilliseconds = now - lastUpdate; // Czas od ostatniej aktualizacji
      const earnedThisTick = (elapsedMilliseconds / 3600000) * hourlyRate; // Przeliczenie milisekund na godziny
      currentAmount += earnedThisTick;

      // Zaktualizowanie licznika
      counterDisplay.textContent = `${currentAmount.toFixed(5)} PLN`;
      lastUpdate = now; // Zapisanie czasu tej aktualizacji
    };

    intervalId = setInterval(updateCounter, 100); // Aktualizacja co 100 ms
  });
});
