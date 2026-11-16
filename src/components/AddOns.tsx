import { addOns } from "../content";

/** Extras any sponsor can add to their tier, as a price list. */
export function AddOns() {
  const groups = [...new Set(addOns.map((a) => a.group))];
  return (
    <div className="addons">
      <div data-rise="left">
        <h3>À la carte</h3>
        <p>Add any of these to your tier. Meal prices depend on whether it's breakfast, lunch, or dinner.</p>
      </div>
      <div className="addons__groups">
        {groups.map((g) => (
          <div key={g}>
            <h4>{g}</h4>
            <ul>
              {addOns
                .filter((a) => a.group === g)
                .map((a, i) => (
                  <li key={a.name} data-rise="right" data-i={i}>
                    <span className="addons__name">{a.name}</span>
                    <span className="addons__req">{a.minTier} and up</span>
                    <span className="addons__price">{a.price}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
