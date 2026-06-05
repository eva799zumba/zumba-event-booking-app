"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Banknote,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock3,
} from "lucide-react";
import type { Event } from "@/lib/db/schema";

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
}: EventDetailDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const registered = event.currentRegistrations ?? 0;
  const waitlist = event.waitlistCount ?? 0;
  const progressPercentage = (registered / event.capacity) * 100;
  const remainingSpots = event.capacity - registered;

  const getStatus = () => {
    if (event.isClosed) return "closed";
    if (registered >= event.capacity) return "full";
    return "open";
  };

  const status = getStatus();

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(event.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const getStatusInfo = () => {
    switch (status) {
      case "open":
        return {
          badge: (
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
              신청가능
            </Badge>
          ),
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          message: `${remainingSpots}자리 남았습니다`,
          canApply: true,
        };
      case "full":
        return {
          badge: (
            <Badge className="bg-amber-600 text-white hover:bg-amber-700">
              대기가능
            </Badge>
          ),
          icon: <Clock3 className="w-5 h-5 text-amber-500" />,
          message: `대기자 ${waitlist}명`,
          canApply: true,
        };
      case "closed":
        return {
          badge: (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              마감
            </Badge>
          ),
          icon: <AlertCircle className="w-5 h-5 text-muted-foreground" />,
          message: "신청이 마감되었습니다",
          canApply: false,
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleApply = () => {
    const amount = event.price;
    const bank = event.bankName;
    const account = event.accountNumber;
    const holder = event.accountHolder;
    const message = `[줌바 신청]\n\n행사: ${event.title}\n일시: ${formatDate(event.date)} ${event.time}\n\n입금 정보:\n은행: ${bank}\n계좌: ${account}\n예금주: ${holder}\n금액: ${amount.toLocaleString()}원\n\n입금 후 이름과 연락처를 문자로 보내주세요.`;
    
    if (navigator.share) {
      navigator.share({
        title: `${event.title} 신청`,
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
      alert("입금 정보가 클립보드에 복사되었습니다!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {event.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {getCategoryLabel(event.category)}
                </Badge>
                {statusInfo.badge}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Event Image */}
          <div
            className="relative h-56 rounded-lg bg-secondary overflow-hidden"
            style={{
              backgroundImage: event.image ? `url(${event.image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "oklch(0.25 0.05 340)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                {statusInfo.icon}
                <span className="text-foreground font-medium">
                  {statusInfo.message}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              행사 소개
            </h4>
            <p className="text-foreground leading-relaxed">{event.description}</p>
          </div>

          <Separator className="bg-border" />

          {/* Event Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">날짜</p>
                <p className="font-medium text-foreground">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">시간</p>
                <p className="font-medium text-foreground">{event.time} ({event.duration})</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">장소</p>
                <p className="font-medium text-foreground">{event.location}</p>
                <p className="text-xs text-muted-foreground">{event.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">강사</p>
                <p className="font-medium text-foreground">{event.instructor}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Capacity Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              참가 현황
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-foreground">신청 인원</span>
                </div>
                <span className="font-semibold text-foreground">
                  {registered} / {event.capacity}명
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">대기 인원</span>
                <span className="font-medium text-foreground">
                  {waitlist}명
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Payment Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              신청 방법
            </h4>
            <div className="p-4 rounded-lg bg-secondary space-y-3">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg text-primary">
                  {event.price.toLocaleString()}원
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">은행</span>
                  <span className="text-foreground">{event.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">계좌번호</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-foreground">{event.accountNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={copyAccountNumber}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">예금주</span>
                  <span className="text-foreground">{event.accountHolder}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                * 입금 후 이름과 연락처를 문자로 보내주세요
              </p>
            </div>
          </div>

          {/* Apply Button */}
          {statusInfo.canApply && (
            <Button
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleApply}
            >
              {status === "full" ? "대기 신청하기" : "신청하기"}
            </Button>
          )}

          {!statusInfo.canApply && (
            <Button className="w-full h-12 text-lg font-semibold" disabled>
              신청 마감
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
