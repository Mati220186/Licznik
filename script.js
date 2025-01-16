document.addEventListener("DOMContentLoaded", () => {
  console.log("Skrypt uruchomiony"); // Sprawdzenie, czy skrypt się ładuje

  const salaryForm = document.getElementById("salaryForm");
  const counterDisplay = document.getElementById("counter");
  let intervalId;

  if (!salaryForm || !counterDisplay) {
    console.error("Nie znaleziono formularza lub licznika w DOM!");
    return;
  }

  salaryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Formularz przesłany"); // Sprawdzenie, czy nasłuchiwanie działa

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

    // Obliczenie czasu rozpoczęcia pracy
    const startHourInMinutes =
      parseInt(startHour.split(":")[0], 10) * 60 +
      parseInt(startHour.split(":")[1], 10);

    if (intervalId) clearInterval(intervalId);

    let currentAmount = 0;

    // Licznik
    const updateCounter = () => {
      const now = new Date();
      const nowInMinutes = now.getHours() * 60 + now.getMinutes();

      if (nowInMinutes >= startHourInMinutes) {
        const elapsedMinutes = nowInMinutes - startHourInMinutes;
        currentAmount = (elapsedMinutes / 60) * hourlyRate;
        counterDisplay.textContent = `${currentAmount.toFixed(5)} PLN`;
        console.log(`Zaktualizowano licznik: ${currentAmount.toFixed(5)} PLN`);
      } else {
        counterDisplay.textContent = "0.00 PLN";
      }
    };

    updateCounter(); // Pokazuje od razu aktualną wartość
    intervalId = setInterval(updateCounter, 100); // Aktualizuje co sekundę
  });
});
