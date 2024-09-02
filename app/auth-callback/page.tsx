"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getAuthStatus } from "./action";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [getconfigId, SetconfigId] = useState<string | null>("");
  const { replace } = useRouter();

  useEffect(() => {
    const configId = localStorage.getItem("configId");
    SetconfigId(configId);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => await getAuthStatus(),
    retry: true,
    retryDelay: 600,
  });

  if (data?.success !== undefined) {
    if (getconfigId) {
      localStorage.removeItem("configurationId");
      replace(`/configure/preview?id=${getconfigId}`);
    } else {
      replace("/");
    }
  }

  return (
    <div className="w-full mt-24 flex justify-center">
      {isLoading && (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Logging you in...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      )}
    </div>
  );
};

export default Page;
