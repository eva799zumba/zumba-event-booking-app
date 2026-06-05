'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createEvent, updateEvent } from '@/app/actions/events'
import type { Event } from '@/lib/db/schema'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'basic', label: '기초반' },
  { value: 'senior', label: '시니어' },
  { value: 'party', label: '파티' },
  { value: 'toning', label: '근력강화' },
  { value: 'kids', label: '키즈' },
  { value: 'aqua', label: '아쿠아' },
]

const LEVELS = [
  { value: '초급', label: '초급' },
  { value: '중급', label: '중급' },
  { value: '상급', label: '상급' },
  { value: '전체', label: '전체' },
]

interface EventFormProps {
  event?: Event | null
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    date: event?.date ?? '',
    time: event?.time ?? '',
    duration: event?.duration ?? '60분',
    location: event?.location ?? '',
    address: event?.address ?? '',
    instructor: event?.instructor ?? '',
    price: event?.price ?? 0,
    capacity: event?.capacity ?? 30,
    image: event?.image ?? '',
    category: event?.category ?? 'basic',
    level: event?.level ?? '전체',
    bankName: event?.bankName ?? '',
    accountNumber: event?.accountNumber ?? '',
    accountHolder: event?.accountHolder ?? '',
    isClosed: event?.isClosed ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (event) {
        await updateEvent(event.id, formData)
      } else {
        await createEvent(formData)
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{event ? '행사 수정' : '새 행사 등록'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="title">행사 제목</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="모닝 줌바 에너지"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">행사 설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="행사에 대한 상세 설명을 입력하세요"
                  />
                </div>

                <div>
                  <Label htmlFor="date">날짜</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">시간</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    placeholder="10:00 - 11:00"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">소요 시간</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    placeholder="60분"
                  />
                </div>

                <div>
                  <Label htmlFor="instructor">강사명</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                    placeholder="김지현"
                  />
                </div>

                <div>
                  <Label htmlFor="location">장소</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="강남 피트니스 센터"
                  />
                </div>

                <div>
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="서울시 강남구 테헤란로 123"
                  />
                </div>

                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">난이도</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="난이도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">가격 (원)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    required
                    min={0}
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">수용 인원</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    required
                    min={1}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="image">이미지 URL</Label>
                  <Input
                    id="image"
                    value={formData.image ?? ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/zumba-morning.png"
                  />
                </div>

                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">입금 계좌 정보</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="bankName">은행명</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        required
                        placeholder="신한은행"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">계좌번호</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        required
                        placeholder="110-123-456789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolder">예금주</Label>
                      <Input
                        id="accountHolder"
                        value={formData.accountHolder}
                        onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                        required
                        placeholder="줌바코리아"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <Switch
                    id="isClosed"
                    checked={formData.isClosed}
                    onCheckedChange={(checked) => setFormData({ ...formData, isClosed: checked })}
                  />
                  <Label htmlFor="isClosed">신청 마감</Label>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? '저장 중...' : event ? '수정하기' : '등록하기'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
