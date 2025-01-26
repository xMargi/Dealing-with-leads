import { z } from 'zod'

export const GetGroupLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional()
})

const LeadCampaignStatusSchema = z.enum([
    "New",
    "Engaged",
    "FolloUp_Scheduled",
    "Contacted",
    "Qualified",
    "Converted",
    "Unresponsive",
    "Disqualified",
    "Re_Engaged",
    "Opted_Out"
  ])

export const AddGroupLeadRequestSchema = z.object({
    leadId: z.number(),
    status: LeadCampaignStatusSchema.optional()
})