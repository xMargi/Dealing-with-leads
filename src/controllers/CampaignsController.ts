import { Handler } from "express";
import { CreateCampaignRequestSchema, UpdateCampaignRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsRequestSchema";
import { campaignsService } from "../services/CampaignsService";


export class CampaignsController {
    constructor(private readonly campaignService: campaignsService) { }

    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await this.campaignService.getAllCampaigns()
            res.json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateCampaignRequestSchema.parse(req.body)
            const createCampaign = await this.campaignService.createCampaign(body)

            res.status(201).json(createCampaign)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const findCampaign = await this.campaignService.getCampaignById(id)

            res.json(findCampaign)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateCampaignRequestSchema.parse(req.body)

            const updatedCampaign = await this.campaignService.updateCampaignById(id, body)
            res.json(updatedCampaign)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
           const deletedCampaign = await this.campaignService.deleteCampaignById(id)

            res.json({ deletedCampaign })
        } catch (error) {
            next(error)
        }
    }

}