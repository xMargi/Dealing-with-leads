import { Handler } from "express";
import { CreateCampaignRequestSchema, UpdateCampaignRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsRequestSchema";
import { HttpError } from "../erros/HttpError";
import { ICampaignsRepository, ICreateCampaignAttributes } from "../repositories/CampaignsRepository";

export class CampaignsController {
    constructor(private readonly campaignsRepository: ICampaignsRepository){}

    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await this.campaignsRepository.find()
            res.json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateCampaignRequestSchema.parse(req.body)

            const createCampaign = await this.campaignsRepository.create(body)

            res.status(201).json(createCampaign)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const findCampaign = await this.campaignsRepository.findById(id)

            if (!findCampaign) throw new HttpError(404, "Campanha não encontrada")

            res.json(findCampaign)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateCampaignRequestSchema.parse(req.body)

            const updatedCampaign = await this.campaignsRepository.updateById(id, body)

            if (!updatedCampaign) throw new HttpError(404, "Campanha não encontrada")
    
            

            res.json(updatedCampaign)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const deletedCampaign = await this.campaignsRepository.deleteById(id)
            
            if (!deletedCampaign) throw new HttpError(404, "Campanha não encotrada")


            res.json({ deletedCampaign })
        } catch (error) {
            next(error)
        }
    }

}