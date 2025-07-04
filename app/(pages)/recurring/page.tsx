import RecurringTable from '@/components/table/RecurringTable'
import { Suspense } from 'react'

export default function page() {
  return (
    <>
      <Suspense>
        <RecurringTable />
      </Suspense>
    </>
  )
}
