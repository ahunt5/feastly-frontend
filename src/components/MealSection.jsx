export default function MealSection({ title, meals, onAdd }) {
  return (
    <section>
      <div>
        <div>
          <h2>{title}</h2>
        </div>

        <button type="button" onClick={onAdd}>
          Add {title}
        </button>
      </div>

      {meals.length === 0 ? (
        <div>
          <p>No items yet</p>
        </div>
      ) : (
        <div>
          {meals.map((meal, index) => (
            <div key={meal.id}>
              <span>{index + 1}. </span>
              <p>{meal.name || `${title} meal`}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
