import { Handler } from "express";
import { AddGroupLeadRequestSchema, GetGroupLeadsRequestSchema } from "./schemas/GroupLeadsRequestSchema";
import { prisma } from "../database";
import { HttpError } from "../erros/HttpError";
import { GroupsLeadsService } from "../services/GroupsLeadsService";

export class GroupLeadsController {
    constructor(private readonly groupsLeadsService: GroupsLeadsService){
        
    }
    getGroupLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)

            const group = await this.groupsLeadsService.getGroupById(groupId)
            if(!group) throw new HttpError(404, "grupo não encontrado")

                const {where, sortBy, order, limit, offset, pageConverted} = await this.groupsLeadsService.parsePaginationAndFilters(req.query, groupId)
                const leads = await this.groupsLeadsService.getAllLeads(where, sortBy, order, limit, offset)
                const total = await this.groupsLeadsService.groupLeadsCountTotal(where)

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

    addGroupLeads: Handler = async (req, res, next) => {
        try {
            const {leadId} = AddGroupLeadRequestSchema.parse(req.body)
            const groupId = Number(req.params.groupId)

            const group = await this.groupsLeadsService.getGroupById(groupId)
            if(!group) throw new HttpError(404, "Grupo não encontrado")

            await this.groupsLeadsService.addLeadToGroup(leadId, groupId)

            res.status(201).json({message: "Lead added to group successfully"})
        } catch (error) {
            next(error)
        }
    }

    removeGroupLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const leadId = Number(req.params.leadId)

            const group = await this.groupsLeadsService.getGroupById(groupId)

            if (!group) throw new HttpError(404, "grupo não encontrado")
            await this.groupsLeadsService.removeLeadToGroupById(groupId, leadId)

            res.status(200).json({ message: "Lead removed from group successfully" });
        } catch (error) {
            next(error)
        }
    }
}