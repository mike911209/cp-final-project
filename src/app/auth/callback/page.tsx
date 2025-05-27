'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import Loading from '@/components/ui/loading'

export default function OAuthCallback() {
  const router = useRouter()
  const { checkAuthState, user } = useUser()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const verifier = typeof window !== 'undefined'
    ? localStorage.getItem('code_verifier')
    : null

  // 1. 先確認 Cognito login state，拿到 user 與 idToken
  useEffect(() => {
    checkAuthState()
  }, [checkAuthState])

  // 2. code + verifier + idToken 都到位後再呼叫你的 Lambda
  useEffect(() => {
    // 取你的 idToken（取決於你在 Context 裡怎麼存）
    // const idToken = user?.signInUserSession?.idToken?.jwtToken
    if (!code || !verifier) return

    fetch(
      'https://kiciu82fdd.execute-api.us-east-1.amazonaws.com/prod/calendar/auth',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          code:code,
          code_verifier: verifier,
        }),
      }
    )
      .then(async res => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status} – ${text}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('tokens:', data)
        // 可以把 tokens 存到 Context / localStorage
        router.replace('/calendar')
      })
      .catch(err => {
        console.error('OAuth callback error:', err)
        // TODO: 顯示 UI 錯誤訊息
      })
  }, [code, verifier, user, router])

  return <Loading />
}
