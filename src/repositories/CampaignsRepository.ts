import { Campaign  } from "@prisma/client";

export type LeadCampaignStatus = "New"|  "Engaged"| "FollowUp_Scheduled"| "Contacted"| "Qualified"| "Converted"| "Unresponsive"| "Disqualified"| "Re_Engaged"| "Opted_Out"


export interface ICreateCampaignAttributes{
    name: string,
    description: string
    startDate: Date
    endDate?: Date
}

export interface AddLeadToCampaignAttributes {
    campaignId: number
    leadId: number
    status: LeadCampaignStatus
}

export interface ICampaignsRepository{
    find: () => Promise<Campaign[]>
    create: (attributes: ICreateCampaignAttributes) => Promise<Campaign | null>
    findById: (id: number) => Promise<Campaign | null>
    updateById: (id: number, attributes: Partial<ICreateCampaignAttributes>) => Promise<Campaign | null>
    deleteById: (id: number) => Promise<Campaign | null>
    addLead: (attributes: AddLeadToCampaignAttributes) => Promise<void>
    updateLeadStatus: (attributes: AddLeadToCampaignAttributes) => Promise<void>
    removeLead: (campaignId: number, leadId: number) => Promise<void>
}