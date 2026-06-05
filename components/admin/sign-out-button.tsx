'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await signOut()
        window.location.href = '/admin/sign-in'
      }}
    >
      로그아웃
    </Button>
  )
}
