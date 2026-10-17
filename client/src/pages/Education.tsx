// -----------------------------------------------------------------------------
// Education.tsx — the /education page.
// Author: Shuai Ju
//
// Concepts introduced here:
//   • Deriving a value inside `.map()` before returning JSX. When the callback
//     needs a local variable, use a full function body with `return (...)`
//     instead of the concise arrow form `(x) => (...)`.
//   • Ternary expression `cond ? a : b` for picking between two values inline.
//   • Semantic HTML: <ol> ("ordered list") is used because the timeline has a
//     meaningful order (most recent first). Assistive tech announces it as a
//     numbered list.
// -----------------------------------------------------------------------------

type Qualification = {
  id: string;
  diploma: string;
  institution: string;
  startYear: number;
  endYear: number;
  detail: string;
};

const QUALIFICATIONS: Qualification[] = [
  {
    id: 'SET',
    diploma: 'Software Engineering Technology',
    institution: 'Centennial College',
    startYear: 2025,
    endYear: 2027,
    detail: 'Currently in Semester 3 of the Software Engineering Technology program at Centennial College, with a focus on software development and engineering principles.'
  },
  {
    id: 'IS',
    diploma: 'Information Systems',
    institution: 'Centennial College',
    startYear: 2002,
    endYear: 2005,
    detail: 'Diploma in Information Systems Management from Centennial College, with a focus on the business side.'
  },
  

];

export default function Education() {
  return (
    <section>
      <h1 className="section-title">Education</h1>
      <p className="lead">
        Formal qualifications and certifications, most recent first.
      </p>

      {/* `list-none` removes the default numbering (we render the year
          ourselves), and `grid gap-4` stacks the entries with even spacing. */}
      <ol className="list-none p-0 mt-6 grid gap-4">
        {QUALIFICATIONS.map((item) => {
          const yearLabel =
            item.startYear === item.endYear
              ? `${item.startYear}`
              : `${item.startYear} – ${item.endYear}`;

          return (
            // Two-column layout above sm; single column below. `sm:` is
            // Tailwind's "small breakpoint and up" prefix.
            <li
              key={item.id}
              className="card grid gap-5 items-start grid-cols-1 sm:grid-cols-[140px_1fr]"
            >
              <div className="font-bold text-accent text-[1.05rem]">{yearLabel}</div>
              <div>
                <h3 className="mb-1">{item.diploma}</h3>
                <p className="text-text mb-1">{item.institution}</p>
                <p className="mb-0">{item.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
