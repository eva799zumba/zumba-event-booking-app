"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ZUMBA</h1>
              <p className="text-xs text-muted-foreground">행사 예약</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-foreground font-medium hover:text-primary transition-colors">
              행사목록
            </Link>
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              관리자
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
