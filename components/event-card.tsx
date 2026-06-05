"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Event } from "@/lib/db/schema";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const registered = event.currentRegistrations ?? 0;
  const progressPercentage = (registered / event.capacity) * 100;

  const getStatus = () => {
    if (event.isClosed) return "closed";
    if (registered >= event.capacity) return "full";
    return "open";
  };

  const status = getStatus();

  const getStatusBadge = () => {
    switch (status) {
      case "open":
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">신청가능</Badge>;
      case "full":
        return <Badge className="bg-amber-600 text-white hover:bg-amber-700">대기가능</Badge>;
      case "closed":
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">마감</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      basic: '기초반',
      senior: '시니어',
      party: '파티',
      toning: '근력강화',
      kids: '키즈',
      aqua: '아쿠아',
    };
    return map[category] || category;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-card border-border"
      onClick={onClick}
    >
      <div className="relative h-48 bg-secondary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: event.image ? `url(${event.image})` : undefined,
            backgroundColor: "oklch(0.25 0.05 340)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-border text-foreground">
            {getCategoryLabel(event.category)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">{getStatusBadge()}</div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">{event.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {registered}/{event.capacity}명
              </span>
            </div>
            <span className="text-lg font-bold text-primary">
              {event.price.toLocaleString()}원
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </Card>
  );
}
