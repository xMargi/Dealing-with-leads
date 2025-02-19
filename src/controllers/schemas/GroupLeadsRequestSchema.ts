import { z } from 'zod'

const LeadStatusSchema = z.enum([
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Unresponsive",
    "Disqualified",
    "Archived"
])

export const GetGroupLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: LeadStatusSchema.optional(),
    sortBy:  z.enum(["name", "status", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
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