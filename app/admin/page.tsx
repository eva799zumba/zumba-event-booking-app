import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getEvents } from '@/app/actions/events'
import { AdminEventList } from '@/components/admin/event-list'
import { SignOutButton } from '@/components/admin/sign-out-button'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/admin/sign-in')
  }

  const events = await getEvents()

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">줌바 행사 관리</h1>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              행사 목록 보기
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AdminEventList events={events} />
      </main>
    </div>
  )
}
