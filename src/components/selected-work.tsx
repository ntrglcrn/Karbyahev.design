const projects = [
  { title: "Commerce platform", type: "Digital commerce", tone: "bg-[#ff7657]" },
  { title: "Operations suite", type: "B2B SaaS", tone: "bg-[#c8ff00]" },
  { title: "Customer portal", type: "Fintech", tone: "bg-[#8a7cff]" },
];

export default function SelectedWork() {
  return (
    <section className="bg-[#f5f3ed] py-20 text-[#1500e1] sm:py-28" id="selected-work">
      <div className="container">
        <div className="mb-14 flex items-baseline justify-between border-t border-current pt-3 sm:mb-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em]">Selected work</p>
          <p className="text-sm">01—03</p>
        </div>

        <div className="grid gap-14 md:grid-cols-2 md:gap-x-8 md:gap-y-20">
          {projects.map(({ title, type, tone }, index) => (
            <article className={index === 2 ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-8" : ""} key={title}>
              <div className={`${tone} aspect-[4/3]`} aria-label={`${title} — image placeholder`} role="img" />
              <div className="mt-4 flex items-start justify-between gap-4 border-t border-current pt-3">
                <div>
                  <h2 className="text-2xl font-semibold leading-none tracking-[-0.045em] sm:text-3xl">{title}</h2>
                  <p className="mt-2 text-sm">{type}</p>
                </div>
                <span className="text-sm">0{index + 1}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
