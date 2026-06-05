import { Header } from "@/components/header";
import { EventList } from "@/components/event-list";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <EventList />
      </main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 ZUMBA 행사 예약. All rights reserved.</p>
          <p className="mt-2">문의: zumba@example.com</p>
        </div>
      </footer>
    </div>
  );
}
