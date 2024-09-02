import { redirect, useSearchParams } from 'next/navigation';
import { NextRequest } from 'next/server';
import DesignConfiruration from './DesignConfiruration';

import {getUploadImageUrlByUser} from '@/lib/action'

const DesignPage = async({ searchParams }:{ searchParams?:{id:string} }) => {
  // const searchParams = useSearchParams();
  if(!searchParams?.id) return redirect('/configure/upload');
  const {id} = searchParams;

  const {ImageMetadata} = await getUploadImageUrlByUser({id})

 const {height,width,id:userid,imageUrl} = ImageMetadata;
  return (
    <DesignConfiruration imageUrl={imageUrl} height={height} id={userid} width={width}   />
  )
}

export default DesignPage