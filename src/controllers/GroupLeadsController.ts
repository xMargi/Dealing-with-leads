import { Handler } from "express";
import { AddGroupLeadRequestSchema, GetGroupLeadsRequestSchema } from "./schemas/GroupLeadsRequestSchema";
import { Prisma } from "@prisma/client";
import { prisma } from "../database";
import { HttpError } from "../erros/HttpError";

export class GroupLeadsController {
    getGroupLeads: Handler = async (req, res, next) => {
        try {
            const groupId = Number(req.params.groupId)

            const group = await prisma.group.findUnique({
                where: {id: groupId}
            })

            if(!group) throw new HttpError(404, "grupo não encontrado")


            const query = GetGroupLeadsRequestSchema.parse(req.query)
            const { page = "1", pageSize = "10", name, } = query

            const pageNumber = Number(page)
            const pageSizeNumber = Number(pageSize)

            const where: Prisma.LeadWhereInput = {
                groups: {
                    some: { id: groupId }
                }
            }

            if (name) where.name = { contains: name, mode: "insensitive" }

            const leads = await prisma.lead.findMany({
                where,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                include: {
                    groups: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                }
            })

            const total = await prisma.lead.count({ where })

            res.json({
                leads,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    total,
                    totalPages: Math.ceil(total / pageSizeNumber)
                }
            })

        } catch (error) {
            next(error)
        }
    }

    addGroupLeads: Handler = async (req, res, next) => {
        try {
            const body = AddGroupLeadRequestSchema.parse(req.body)
            const groupId = Number(req.params.groupId)

            const group = await prisma.group.findUnique({
                where: {id: groupId}
            })

            if(!group) throw new HttpError(404, "Grupo não encontrado")

            await prisma.group.update({
                where: {id: groupId},
                data: {
                    leads: {
                        connect: {id: body.leadId}
                    }
                }
            })

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

                await prisma.group.update({
                    where: { id: groupId },
                    data: {
                        leads: {
                            disconnect: { id: leadId },
                        },
                    },
                });
    
                res.status(200).json({ message: "Lead removed from group successfully" });

        } catch (error) {
            next(error)
        }
    }
}