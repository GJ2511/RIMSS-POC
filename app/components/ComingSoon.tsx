// components/ComingSoon.tsx
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Coming Soon</h1>
        <p className="text-sm text-slate-600 mb-6">
          We&apos;re working on this feature. It will be available shortly.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
