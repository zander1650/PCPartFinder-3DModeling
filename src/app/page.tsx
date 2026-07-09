import Link from "next/link";

const FEATURES = [
  {
    title: "See it running in 3D",
    body: "Your parts appear in a live 3D case as you pick them — hit power and watch the fans spin and the RGB glow before you spend a dollar.",
  },
  {
    title: "Compatibility checked",
    body: "Sockets, RAM type, PSU wattage, GPU clearance and cooler height are validated on every pick, so nothing arrives that doesn't fit.",
  },
  {
    title: "Builds that fit your budget",
    body: "Set a budget and a goal — gaming, productivity or all-round — and get a complete compatible build in one click.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <section className="text-center">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Build it. <span className="text-sky-400">See it run.</span>
          <br />
          Before you buy.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Pick compatible parts like on any part picker — then watch your exact
          build come to life in 3D with spinning fans and RGB lighting.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/builder"
            className="rounded-lg bg-sky-500 px-7 py-3 font-medium text-white transition-colors hover:bg-sky-400"
          >
            Start Building
          </Link>
          <Link
            href="/budget"
            className="rounded-lg border border-slate-700 px-7 py-3 font-medium transition-colors hover:bg-slate-900"
          >
            Get a Budget Build
          </Link>
        </div>
      </section>

      <section className="mt-24 grid gap-6 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
          </div>
        ))}
      </section>

      <p className="mt-16 text-center text-sm text-slate-500">
        Coming soon: live prices and local deals from retailer APIs.
      </p>
    </main>
  );
}
