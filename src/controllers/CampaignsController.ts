import { Handler } from "express";
import { prisma } from "../database";
import { CreateCampaignRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignsRequestSchema";
import { HttpError } from "../erros/HttpError";

export class CampaignsController {
    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await prisma.campaign.findMany()
            res.json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateCampaignRequestSchema.parse(req.body)

            const createCampaign = await prisma.campaign.create({
                data: body,
                include: { leads: true }
            })

            res.status(201).json(createCampaign)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const findCampaign = await prisma.campaign.findUnique({
                where: { id },
                include: {
                    leads: {
                        include: { lead: true }
                    }
                }
            })

            if (!findCampaign) throw new HttpError(404, "Campanha não encontrada")

            res.json(findCampaign)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateLeadStatusRequestSchema.parse(req.body)

            const findCampaign = await prisma.campaign.findUnique({ where: { id } })
            if (!findCampaign) throw new HttpError(404, "Campanha não encontrada")

            const updatedCampaign = await prisma.campaign.update({
                data: body,
                where: { id }
            })

            res.json(updatedCampaign)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const findCampaign = await prisma.campaign.findUnique({ where: { id } })
            if (!findCampaign) throw new HttpError(404, "Campanha não encotrada")

            const deletedCampaign = await prisma.campaign.delete({ where: { id } })

            res.json({ deletedCampaign })
        } catch (error) {
            next(error)
        }
    }

}