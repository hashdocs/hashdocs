import Link from 'next/link';
import Button from './_components/button';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2 p-4">
      <h1 className="text-9xl font-black text-gray-200">404</h1>

      <p className="text-lg tracking-tight text-gray-400">
        This page does not exist!
      </p>

      <Link href={`/`}>
        <Button variant="solid" size="sm">
          Go to home
        </Button>
      </Link>
    </div>
  );
}
