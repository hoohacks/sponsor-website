import { roles } from "../content";
import { Photo } from "./Photo";

export function Roles() {
  return (
    <section className="roles" id="roles" aria-labelledby="roles-title">
      <div className="wrap">
        <h2 id="roles-title">Show up the way that fits your team.</h2>
        <div className="roles__grid">
          {roles.map((r) => (
            <article className="role" key={r.title}>
              <Photo name={r.photo} alt={r.alt} sizes="(max-width: 1000px) 100vw, 400px" />
              <div className="role__body">
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <span className="role__tag">{r.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
