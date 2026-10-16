import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-24 text-center">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6a2ff0] uppercase">Missing page</p>
      <h1 className="mt-3 font-display text-4xl">This route is off the board.</h1>
      <Link href="/" className="btn-primary mt-8">
        Back to the roadmap
      </Link>
    </div>
  );
}
