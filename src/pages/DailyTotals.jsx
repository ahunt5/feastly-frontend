import { useEffect, useState } from "react";
import "../App.css";

// Mock daily totals data
const MOCK_DAILY_TOTALS = {
  calories: 1850,
  protein: 130,
  carbs: 160,
  fat: 65,
};

export default function DailyTotalsPage() {
  console.log("DailyTotalsPage rendered");

  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDailyTotals();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const loadDailyTotals = () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      setDailyTotals(MOCK_DAILY_TOTALS);
    } catch (error) {
      console.error("Error loading daily totals:", error);
      setErrorMessage("Could not load daily totals.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <section>
        <h1>Daily Totals</h1>
        <p>View your calories and macros for the day.</p>
      </section>

      <section className="daily-totals-layout">
        <div className="daily-totals-card">
          {isLoading && <p>Loading daily totals...</p>}

          {errorMessage && <p>{errorMessage}</p>}

          {!isLoading && !errorMessage && (
            <div className="daily-totals-details">
              <p>
                <strong>Calories:</strong> {dailyTotals.calories}
              </p>
              <p>
                <strong>Protein:</strong> {dailyTotals.protein}
              </p>
              <p>
                <strong>Carbs:</strong> {dailyTotals.carbs}
              </p>
              <p>
                <strong>Fat:</strong> {dailyTotals.fat}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
