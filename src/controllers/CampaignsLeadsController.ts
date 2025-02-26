import { Handler } from "express";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsRequestSchema";
import { campaignsLeadsService } from "../services/CampaignsLeadsService";

export class CampaignLeadsController {
  constructor(private readonly campaignLeadsService: campaignsLeadsService) { }
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const { where, sortBy, order, limit, offset, pageConverted } = await this.campaignLeadsService.parsePaginationAndFilters(req.query, campaignId)

      const leads = await this.campaignLeadsService.getCampaignLeads(where, sortBy, order, limit, offset)
      const total = await this.campaignLeadsService.getCampaignLeadsTotal(where)

      res.json({
        leads,
        meta: {
          page: pageConverted,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      next(error)
    }
  }

  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId
      await this.campaignLeadsService.addLeadToCampaign(req.body, campaignId)
      
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId
      const leadId = +req.params.leadId
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body)
      await this.campaignLeadsService.updateLeadCampaign(status, campaignId, leadId)
      res.json({ message: "Status do lead atualizado com sucesso!" })
    } catch (error) {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId
      const leadId = +req.params.leadId
      await this.campaignLeadsService.removeLeadCampaign(leadId, campaignId)
      res.json({ message: "Lead excluido com sucesso!" })
    } catch (error) {
      next(error)
    }
  }
}
