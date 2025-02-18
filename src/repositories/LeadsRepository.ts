import { Lead } from "@prisma/client";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Unresponsive" | "Disqualified" | "Archived"


export interface ILeadWhereParams{
    name?: {
        like?: string
        equals?: string
        mode?: "default" | "insensitive"
    }
    status?: LeadStatus
}

export interface IFindLeadsParams{
    where?: ILeadWhereParams
    sortBy?: "name" | "status" | "createdAt"
    order?: "asc" | "desc"
    limit?: number
    offset?: number
}

export interface ICreateLeadAttributes{
    name: string
    email: string
    phone: string
    status: LeadStatus
}


export interface ILeadsRepository {
    find: (params: IFindLeadsParams) => Promise<Lead[]>
    findById: (id: number) => Promise<Lead | null>
    count: (where: ILeadWhereParams) => Promise<number>
    create: (attributes: ICreateLeadAttributes) => Promise<Lead>
    updateById: (id: number, attributes: Partial<ICreateLeadAttributes>) => Promise<Lead | null>
    deleteById: (id: number) => Promise<Lead | null>
    

}