import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-lg mb-6">Please choose a form:</p>
      <div className="flex space-x-4">
        <Link href="/request" className="hover:underline">
          Request
        </Link>
        <Link href="/review" className="hover:underline">
          Review
        </Link>
      </div>
    </div>
  );
}
