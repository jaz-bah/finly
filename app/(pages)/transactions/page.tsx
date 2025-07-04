import TransactionTable from '@/components/table/TransactionTable';
import { Suspense } from 'react';

export default function page() {
  return (
    <>
      <Suspense>
        <TransactionTable />
      </Suspense>
    </>
  )
}
