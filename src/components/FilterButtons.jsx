import { useState, useEffect } from "react";

export default function FilterButtons({ onFilterChange }) {
  const [options, setOptions] = useState({ diets: [], allergies: [], cuisines: [] });
  const [selected, setSelected] = useState({ diets: new Set(), allergies: new Set(), cuisines: new Set() });

  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error("Failed to fetch filters:", err));
  }, []);

  const toggle = (category, item) => {
    setSelected((prev) => {
      const next = new Set(prev[category]);
      next.has(item) ? next.delete(item) : next.add(item);
      const updated = { ...prev, [category]: next };

      // Notify parent with plain arrays
      onFilterChange?.({
        diets: [...updated.diets],
        allergies: [...updated.allergies],
        cuisines: [...updated.cuisines],
      });

      return updated;
    });
  };

  const sections = [
    { key: "diets", label: "Diets" },
    { key: "allergies", label: "Allergies" },
    { key: "cuisines", label: "Cuisines" },
  ];

  return (
    <div className="filter-panel">
      {sections.map(({ key, label }) => (
        <div key={key} className="filter-section">
          <h3>{label}</h3>
          <div className="button-group">
            {options[key].map((item) => {
              const isSelected = selected[key].has(item);
              return (
                <button
                  key={item}
                  onClick={() => toggle(key, item)}
                  className={`filter-btn ${isSelected ? "active" : ""}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
