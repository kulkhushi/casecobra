'use client'

import { RedirectToSignIn, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ModalActionType ={
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isModalOpen: boolean;
    configId?: string
}

export default function SignUpModal({isModalOpen,setIsModalOpen,configId}:ModalActionType) {

  return (
    <Dialog  open={isModalOpen} onOpenChange={setIsModalOpen}>
      {/* <DialogTrigger asChild >
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Please Login</DialogTitle>
          <DialogDescription>
           Please Login To Procced!
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="destructive">Cancel</Button>
         {/* <Button onClick={() => setIsModalOpen(false)} variant="primary">Save</Button> */}
        <SignInButton >
        <Button variant="default">Sign Up</Button>
        </SignInButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
