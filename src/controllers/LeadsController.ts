import { Handler } from "express";
import { CreateLeadRequestSchema, getLeadsRequestSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema";
import { leadsService } from "../services/LeadsService";

export class LeadsController {
    constructor(private readonly leadsService: leadsService){}

    index: Handler = async (req, res, next) => {
        try {
            const query = getLeadsRequestSchema.parse(req.query)
            const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

            const result = await this.leadsService.getAllLeadsPaginated({
                name, 
                status,
                page: +page,
                pageSize: +pageSize,
                sortBy,
                order
            })

            res.json({result})
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateLeadRequestSchema.parse(req.body)
           const newLead = await this.leadsService.createLead(body)
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const lead = await this.leadsService.getLeadById(+req.params.id)
            res.json(lead)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateLeadRequestSchema.parse(req.body)
            const leadUpdated = await this.leadsService.updateLeadById(id, body)

            res.json(leadUpdated)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {

        try {
            const id = Number(req.params.id)
            const deletedLead = await this.leadsService.deleteById(id)

            res.json(deletedLead)
        } catch (error) {
            next(error)
        }
    }
}