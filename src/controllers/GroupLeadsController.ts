import { Handler } from "express";
import { AddGroupLeadRequestSchema, GetGroupLeadsRequestSchema } from "./schemas/GroupLeadsRequestSchema";
import { prisma } from "../database";
import { HttpError } from "../erros/HttpError";
import { IGroupsRepository } from "../repositories/GroupsRepository";
import { ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository";

export class GroupLeadsController {
    constructor(private readonly groupsRepository: IGroupsRepository, private readonly leadRepository: ILeadsRepository){
        
    }
    getGroupLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)

            const group = await prisma.group.findUnique({
                where: {id: groupId}
            })

            if(!group) throw new HttpError(404, "grupo não encontrado")


            const query = GetGroupLeadsRequestSchema.parse(req.query)
            const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

            const limit = Number(pageSize)
            const offset = (Number(page) - 1) * limit

            const where: ILeadWhereParams = {groupId}

            if (name) where.name = { like: name, mode: "insensitive" }

            const leads = await this.leadRepository.find({
                where, 
                sortBy, 
                order, 
                limit, 
                offset, 
                include: {groups: true} })

            const total = await this.leadRepository.count(where)

            res.json({
                leads,
                meta: {
                    page: Number(page),
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

            const group = await prisma.group.findUnique({
                where: {id: groupId}
            })

            if(!group) throw new HttpError(404, "Grupo não encontrado")
                await this.groupsRepository.addLead(groupId, leadId)

            res.status(201).json({message: "Lead added to group successfully"})

        } catch (error) {
            next(error)
        }
    }

    removeGroupLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)
            const leadId = Number(req.params.leadId)

             const group = await prisma.group.findUnique({
                where: { id: groupId },
            });

            if (!group) throw new HttpError(404, "grupo não encontrado")
                await this.groupsRepository.removeLead(groupId, leadId)
                res.status(200).json({ message: "Lead removed from group successfully" });

        } catch (error) {
            next(error)
        }
    }
}