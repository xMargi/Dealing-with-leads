import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "../controllers/schemas/CampaignsRequestSchema";
import { AddLeadToCampaignAttributes, ICampaignsRepository, LeadCampaignStatus } from "../repositories/CampaignsRepository";
import { ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository";
import { typeOrder, typeSortBy } from "./GroupsLeadsService";


export class campaignsLeadsService {
    constructor(private readonly campaignRepository: ICampaignsRepository, private readonly leadsRepository: ILeadsRepository) { }

    async parsePaginationAndFilters(query: any, campaignId: number) {
        const validatedQuery = GetCampaignLeadsRequestSchema.parse(query)
        const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = validatedQuery

        const pageConverted = +page

        const limit = Number(pageSize)
        const offset = (Number(page) - 1) * limit

        const where: ILeadWhereParams = { campaignId, campaignStatus: status }

        if (name) where.name = { like: name, mode: "insensitive" }

        return { where, sortBy, order, limit, offset, pageConverted }
    }

    async getCampaignLeads(where: ILeadWhereParams, sortBy: typeSortBy, order: typeOrder, limit: number, offset: number) {
        const leads = await this.leadsRepository.find({
            where,
            sortBy,
            order,
            limit,
            offset,
            include: { campaings: true }
        })

        return leads
    }

    async getCampaignLeadsTotal(where: ILeadWhereParams) {
        const total = await this.leadsRepository.count(where)
        return total
    }

    async addLeadToCampaign(attributes: AddLeadToCampaignAttributes, idCampaign: number ) {
        const campaignId = idCampaign
        const { leadId, status = "New" } = AddLeadRequestSchema.parse(attributes)
        const campaignAddLead = await this.campaignRepository.addLead({ campaignId, leadId, status })
        return {leadId, status, campaignId, campaignAddLead}
    }

    async updateLeadCampaign(attributes: LeadCampaignStatus, campaignId: number, leadId: number){

        const { status } = UpdateLeadStatusRequestSchema.parse(attributes)
        const updatedLeadCampaign = await this.campaignRepository.updateLeadStatus({ campaignId, leadId, status })
        return updatedLeadCampaign
    }

    async removeLeadCampaign(leadId: number, campaignId: number){
        const removedLeadCampaign = await this.campaignRepository.removeLead(campaignId, leadId)
        return removedLeadCampaign
    }
}