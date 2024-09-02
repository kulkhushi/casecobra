'use client'
import { Configuration } from "@prisma/client";
import { Phone } from "@/components/Phone";
import { Check, Ellipsis } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BASE_PRICE, COLORS, MODELS, PRODUCT_PRICES } from "@/components/Validator";
import { getFormatPrice } from "@/utils/helper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Confetti from 'react-dom-confetti'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SignUpModal from "@/components/Modal";
import { useMutation } from "@tanstack/react-query";
import { saveAllCofigAction } from "./action";
import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const DesignPreview = ({
  configureation,
}: {
  configureation: Configuration;
}) => {
  const {
    id,
    color,
    model,
    metrials,
    finishes,
    croopedImgUrl,
  } = configureation;

  const {replace} = useRouter();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showerror, setshowerror] = useState<string| undefined>('');
  useEffect(() => setShowConfetti(true),[])
  const tw = COLORS.find((supportedColor) => supportedColor.value === color)?.tw

  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!

 let totalPrice = BASE_PRICE;
 if(finishes == 'textured')
  totalPrice += PRODUCT_PRICES.finish.textured;
if(metrials === 'polycarbonate')
  totalPrice += PRODUCT_PRICES.material.polycarbonate;


const {isPending,mutate:saveCofig} = useMutation({
  mutationKey:['create-config-session'],
  mutationFn: saveAllCofigAction,
  onSuccess:({url})=>{
    //console.log("data",data)
    setShowConfetti(false)
    if(url){
      replace(url)
    }else{
      setshowerror("Unable to retire Payment")
    }
  },
  onError:(error)=>{
    setshowerror(error.message as string);
  }

})


const handleToCheckout=({id}:{id:string})=>{

  if(user){
    saveCofig({id})
  }else{
    localStorage.setItem('configId',id);
    setIsModalOpen(true)
  }

}

  return (
    <>
    <div aria-hidden='true' className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"> 
   

      <Confetti  config={{ elementCount: 400, spread: 200 }} active={showConfetti} /></div>
      {showerror &&     <Alert variant="destructive">      
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {showerror}
      </AlertDescription>
    </Alert> }
      <SignUpModal configId={id} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="grid grid-cols-1 lg:grid-cols-12 my-20 gap-12 items-center">
        <div className="lg:col-span-3">
          <Phone className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")} imgSrc={croopedImgUrl!} />
        </div>
        <div className="lg:col-span-9">
          <h2 className="text-3xl font-bold text-gray-900">
          Your {modelLabel} Case
          </h2>
          <div className="flex items-center text-base gap-3 mt-4">
            <Check className="text-green-600" /> In stock and ready to ship
          </div>
          <div className="grid lg:grid-cols-2 my-16">
            <div className="">
              <h4 className="text-zinc-900 font-bold">Highlights</h4>
              <ul className="mt-3 list-inside list-disc text-zinc-700">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ul>
            </div>

            <div className="">
              <h4 className="text-zinc-900 font-bold">Materials</h4>
              <ul className="mt-3 list-inside list-disc text-zinc-700">
                <li>High-quality, durable material</li>
                <li>Scratch and fingerprint resistant coating</li>
              </ul>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flow-root text-sm">
            <div className="flex items-center justify-between py-1">
              <p className="text-gray-600">Base price</p>
              <p className="font-medium text-gray-900">
                {getFormatPrice(BASE_PRICE / 100)}
              </p>
            </div>
            {finishes === "textured" && (
              <div className="flex items-center justify-between  py-1">
                <p className="text-gray-600">Textured finish</p>
                <p className="font-medium text-gray-900">{getFormatPrice(PRODUCT_PRICES.finish.textured/100)}</p>
              </div>
            )}
            {metrials === "polycarbonate" && (
              <div className="flex items-center justify-between  py-1">
                <p className="text-gray-600">{PRODUCT_PRICES.material.polycarbonate}</p>
                <p className="font-medium text-gray-900">{getFormatPrice(PRODUCT_PRICES.material.polycarbonate/100)}</p>
              </div>
            )}
              <Separator className="my-4" />
              <div className="flex items-center justify-between  py-1">
                <p className="text-gray-900">Sub Total</p>
                <p className="font-medium text-gray-950">{getFormatPrice(totalPrice/100)}</p>
              </div>
              <div>
              <Separator className="my-4" />
              <Button onClick={()=>handleToCheckout({id})} className="w-full h-7" type="button" disabled={isPending} >Procced To Checkout {' '} {isPending && (<Ellipsis className="animate-pulse" />)}</Button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
