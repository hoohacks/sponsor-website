import { benefits, tiers } from "../content";
import { formatPrice } from "../lib/format";

/** The full comparison of every benefit at every tier, folded away until asked for. */
export function Compare() {
  return (
    <details className="compare">
      <summary>Compare every tier</summary>
      <div className="compare__scroll">
        <table>
          <caption className="visually-hidden">Benefits included at each sponsorship tier</caption>
          <thead>
            <tr>
              <th scope="col">Benefit</th>
              {tiers.map((t) => (
                <th scope="col" key={t.id}>
                  {t.name}
                  <span>{formatPrice(t.price)}</span>
                </th>
              ))}
            </tr>
          </thead>
          {benefits.map((g) => (
            <tbody key={g.group}>
              <tr className="compare__group">
                <th scope="colgroup" colSpan={6}>
                  <span>{g.group}</span>
                </th>
              </tr>
              {g.benefits.map((b) => (
                <tr key={b.label}>
                  <th scope="row">{b.label}</th>
                  {b.cells.map((c, i) => (
                    <td key={i}>
                      {c === true ? (
                        <span className="compare__yes" role="img" aria-label="Included" />
                      ) : c ? (
                        c
                      ) : (
                        <span className="compare__no" aria-label="Not included">
                          –
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </details>
  );
}
