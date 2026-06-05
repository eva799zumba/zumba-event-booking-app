'use server'

import { db } from '@/lib/db'
import { events, registrations, type Event, type NewEvent } from '@/lib/db/schema'
import { eq, desc, ilike, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getEvents(search?: string, category?: string): Promise<Event[]> {
  let query = db.select().from(events).orderBy(desc(events.date))

  if (search || category) {
    const conditions = []
    if (search) {
      conditions.push(
        or(
          ilike(events.title, `%${search}%`),
          ilike(events.description, `%${search}%`),
          ilike(events.location, `%${search}%`)
        )
      )
    }
    if (category && category !== 'all') {
      conditions.push(eq(events.category, category))
    }
    if (conditions.length > 0) {
      return db
        .select()
        .from(events)
        .where(conditions.length === 1 ? conditions[0] : or(...conditions))
        .orderBy(desc(events.date))
    }
  }

  return query
}

export async function getEventById(id: number): Promise<Event | null> {
  const result = await db.select().from(events).where(eq(events.id, id))
  return result[0] ?? null
}

export async function createEvent(data: NewEvent): Promise<Event> {
  const result = await db.insert(events).values(data).returning()
  revalidatePath('/')
  revalidatePath('/admin')
  return result[0]
}

export async function updateEvent(id: number, data: Partial<NewEvent>): Promise<Event | null> {
  const result = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning()
  revalidatePath('/')
  revalidatePath('/admin')
  return result[0] ?? null
}

export async function deleteEvent(id: number): Promise<void> {
  await db.delete(events).where(eq(events.id, id))
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function registerForEvent(
  eventId: number,
  userData: {
    userId: string
    userName: string
    userEmail: string
    userPhone?: string
  }
): Promise<{ success: boolean; message: string; isWaitlist: boolean }> {
  const event = await getEventById(eventId)
  
  if (!event) {
    return { success: false, message: '행사를 찾을 수 없습니다.', isWaitlist: false }
  }

  if (event.isClosed) {
    return { success: false, message: '신청이 마감되었습니다.', isWaitlist: false }
  }

  // Check if already registered
  const existing = await db
    .select()
    .from(registrations)
    .where(eq(registrations.eventId, eventId))

  const userAlreadyRegistered = existing.find(r => r.userEmail === userData.userEmail)
  if (userAlreadyRegistered) {
    return { success: false, message: '이미 신청하셨습니다.', isWaitlist: false }
  }

  const currentCount = event.currentRegistrations ?? 0
  const isWaitlist = currentCount >= event.capacity

  await db.insert(registrations).values({
    eventId,
    userId: userData.userId,
    userName: userData.userName,
    userEmail: userData.userEmail,
    userPhone: userData.userPhone,
    isWaitlist,
  })

  // Update event counts
  if (isWaitlist) {
    await db
      .update(events)
      .set({ waitlistCount: (event.waitlistCount ?? 0) + 1 })
      .where(eq(events.id, eventId))
  } else {
    await db
      .update(events)
      .set({ currentRegistrations: currentCount + 1 })
      .where(eq(events.id, eventId))
  }

  revalidatePath('/')
  
  return {
    success: true,
    message: isWaitlist ? '대기 신청이 완료되었습니다.' : '신청이 완료되었습니다.',
    isWaitlist,
  }
}

export async function getRegistrationsByEvent(eventId: number) {
  return db
    .select()
    .from(registrations)
    .where(eq(registrations.eventId, eventId))
    .orderBy(registrations.createdAt)
}

export async function confirmPayment(registrationId: number): Promise<void> {
  await db
    .update(registrations)
    .set({ paymentConfirmed: true })
    .where(eq(registrations.id, registrationId))
  revalidatePath('/admin')
}

export async function cancelRegistration(registrationId: number): Promise<void> {
  const registration = await db
    .select()
    .from(registrations)
    .where(eq(registrations.id, registrationId))

  if (registration[0]) {
    const reg = registration[0]
    await db.delete(registrations).where(eq(registrations.id, registrationId))

    // Update event counts
    const event = await getEventById(reg.eventId)
    if (event) {
      if (reg.isWaitlist) {
        await db
          .update(events)
          .set({ waitlistCount: Math.max(0, (event.waitlistCount ?? 0) - 1) })
          .where(eq(events.id, reg.eventId))
      } else {
        await db
          .update(events)
          .set({ currentRegistrations: Math.max(0, (event.currentRegistrations ?? 0) - 1) })
          .where(eq(events.id, reg.eventId))
      }
    }
  }

  revalidatePath('/admin')
}
