"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./event-card";
import { EventDetailDialog } from "./event-detail-dialog";
import { events, type ZumbaEvent } from "@/lib/data";
import { Search } from "lucide-react";

const categories = ["전체", "기초반", "시니어", "파티", "근력강화", "키즈", "아쿠아"];

export function EventList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedEvent, setSelectedEvent] = useState<ZumbaEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "전체" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEventClick = (event: ZumbaEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
          신나는 줌바와 함께
          <br />
          <span className="text-primary">건강한 하루</span>를 시작하세요
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          진행중인 줌바 행사를 검색하고 원하는 클래스에 바로 신청하세요
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="행사명, 장소, 내용으로 검색..."
            className="pl-12 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center px-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-border text-muted-foreground">
            {filteredEvents.length}개 행사
          </Badge>
        </div>
      </div>

      {/* Event Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => handleEventClick(event)}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            검색 결과가 없습니다.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            다른 검색어나 카테고리를 선택해보세요.
          </p>
        </div>
      )}

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
