'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { deleteEvent, confirmPayment, cancelRegistration, getRegistrationsByEvent } from '@/app/actions/events'
import type { Event, Registration } from '@/lib/db/schema'
import { Plus, Edit, Trash2, Users, CalendarDays, MapPin, Check, X } from 'lucide-react'

interface EventListProps {
  events: Event[]
}

export function AdminEventList({ events }: EventListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [registrationsDialogOpen, setRegistrationsDialogOpen] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)

  const handleDelete = async () => {
    if (!selectedEvent) return
    await deleteEvent(selectedEvent.id)
    setDeleteDialogOpen(false)
    setSelectedEvent(null)
    router.refresh()
  }

  const handleViewRegistrations = async (event: Event) => {
    setSelectedEvent(event)
    setLoadingRegistrations(true)
    setRegistrationsDialogOpen(true)
    const regs = await getRegistrationsByEvent(event.id)
    setRegistrations(regs)
    setLoadingRegistrations(false)
  }

  const handleConfirmPayment = async (registrationId: number) => {
    await confirmPayment(registrationId)
    if (selectedEvent) {
      const regs = await getRegistrationsByEvent(selectedEvent.id)
      setRegistrations(regs)
    }
  }

  const handleCancelRegistration = async (registrationId: number) => {
    await cancelRegistration(registrationId)
    if (selectedEvent) {
      const regs = await getRegistrationsByEvent(selectedEvent.id)
      setRegistrations(regs)
    }
    router.refresh()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      basic: '기초반',
      senior: '시니어',
      party: '파티',
      toning: '근력강화',
      kids: '키즈',
      aqua: '아쿠아',
    }
    return map[category] || category
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">행사 목록</h2>
        <Link href="/admin/events/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            새 행사 등록
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">등록된 행사가 없습니다.</p>
            <Link href="/admin/events/new">
              <Button>첫 행사 등록하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.isClosed ? 'secondary' : 'default'}>
                        {event.isClosed ? '마감' : '신청가능'}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(event.category)}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(event.date)} {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.currentRegistrations ?? 0}/{event.capacity}명
                        {(event.waitlistCount ?? 0) > 0 && (
                          <span className="text-yellow-500">
                            (+대기 {event.waitlistCount}명)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRegistrations(event)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      신청자
                    </Button>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>행사 삭제</DialogTitle>
            <DialogDescription>
              &quot;{selectedEvent?.title}&quot; 행사를 정말 삭제하시겠습니까?
              이 작업은 되돌릴 수 없으며, 모든 신청 정보도 함께 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registrations Dialog */}
      <Dialog open={registrationsDialogOpen} onOpenChange={setRegistrationsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title} - 신청자 목록</DialogTitle>
            <DialogDescription>
              총 {registrations.filter(r => !r.isWaitlist).length}명 신청 / {registrations.filter(r => r.isWaitlist).length}명 대기
            </DialogDescription>
          </DialogHeader>
          {loadingRegistrations ? (
            <div className="py-8 text-center text-muted-foreground">
              로딩 중...
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              아직 신청자가 없습니다.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>입금확인</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.userName}</TableCell>
                    <TableCell>{reg.userEmail}</TableCell>
                    <TableCell>{reg.userPhone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={reg.isWaitlist ? 'secondary' : 'default'}>
                        {reg.isWaitlist ? '대기' : '신청'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {reg.paymentConfirmed ? (
                        <Badge variant="default" className="bg-green-600">확인됨</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfirmPayment(reg.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          확인
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancelRegistration(reg.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
