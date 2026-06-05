import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { EventForm } from '@/components/admin/event-form'

export default async function NewEventPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/admin/sign-in')
  }

  return <EventForm />
}
