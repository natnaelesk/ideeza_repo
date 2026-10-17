import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <p className="text-sm font-bold tracking-wide text-[#6a2ff0] uppercase">Missing page</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">That page is not in this demo.</h1>
      <p className="mt-3 text-sm text-mist">The walkthrough is Home, Challenges, and Profile.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
