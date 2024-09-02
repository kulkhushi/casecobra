import { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from "@prisma/client"

export type AddToorderTypes ={
    color: CaseColor;
    finishes:CaseFinish;
    metrials: CaseMaterial;
    model:PhoneModel;
    configId: string;
}