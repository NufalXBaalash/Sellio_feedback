'use client'

import { TestSessionProvider } from '@/components/test-session-provider'
import TestFlow from '@/components/test-flow'

export default function Home() {
  return (
    <TestSessionProvider>
      <TestFlow />
    </TestSessionProvider>
  )
}
