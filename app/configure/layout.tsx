import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Step } from '@/components/Step'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
   <div className='bg-slate-100 flex-1 flex flex-col'>
     <MaxWidthWrapper className='flex-1 flex flex-col'>
      <Step/>
        {children}
    </MaxWidthWrapper>
   </div>
  )
}

export default layout