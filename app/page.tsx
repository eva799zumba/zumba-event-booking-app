import { Header } from "@/components/header";
import { EventList } from "@/components/event-list";
import { getEvents } from "@/app/actions/events";
import Link from "next/link";

export default async function Page() {
  const events = await getEvents();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <EventList initialEvents={events} />
      </main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 ZUMBA 행사 예약. All rights reserved.</p>
          <p className="mt-2">문의: zumba@example.com</p>
          <Link href="/admin" className="text-primary hover:underline mt-2 inline-block">
            관리자
          </Link>
        </div>
      </footer>
    </div>
  );
}
