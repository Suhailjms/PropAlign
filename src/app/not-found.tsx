import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
      <h2 className="text-4xl font-bold mb-4 font-headline">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">Could not find the requested page.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
