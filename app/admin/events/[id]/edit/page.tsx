import { redirect, notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getEventById } from '@/app/actions/events'
import { EventForm } from '@/components/admin/event-form'

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/admin/sign-in')
  }

  const { id } = await params
  const event = await getEventById(parseInt(id))

  if (!event) {
    notFound()
  }

  return <EventForm event={event} />
}
