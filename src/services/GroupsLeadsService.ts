import { GetGroupLeadsRequestSchema } from "../controllers/schemas/GroupLeadsRequestSchema";
import { prisma } from "../database";
import { HttpError } from "../erros/HttpError";
import { IGroupsRepository } from "../repositories/GroupsRepository";
import { ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository";

export type typeSortBy = "name" | "status" | "createdAt"
export type typeOrder = "asc" | "desc"

export class GroupsLeadsService {
    constructor(private readonly leadRepository: ILeadsRepository, private readonly groupsRepository: IGroupsRepository){}
    async getGroupById(groupId: number) {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
        });

        if (!group) throw new HttpError(404, "Grupo não encontrado");

        return group;
    }

    async parsePaginationAndFilters(query: any, groupId: number){
        const validatedQuery = GetGroupLeadsRequestSchema.parse(query)
            const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = validatedQuery
            const pageConverted = +page

            const limit = Number(pageSize)
            const offset = (Number(page) - 1) * limit

            const where: ILeadWhereParams = {groupId}

            if (name) where.name = { like: name, mode: "insensitive" }

            return {where, sortBy, order, limit, offset, pageConverted}
    }

    async getAllLeads(where: ILeadWhereParams, sortBy: typeSortBy, order: typeOrder, limit: number, offset: number){
        const leads = await this.leadRepository.find({
            where, 
            sortBy, 
            order, 
            limit, 
            offset, 
            include: {groups: true} })

        return leads
    }

    async groupLeadsCountTotal(where: ILeadWhereParams){
        const total = await this.leadRepository.count(where)
        return total
    }

    async addLeadToGroup(leadId: number, groupId: number){
        const addLead = await this.groupsRepository.addLead(groupId, leadId)
        return addLead
    }

    async removeLeadToGroupById(groupId: number, leadId: number){
        const removeLeadToGroup = await this.groupsRepository.removeLead(groupId, leadId)
        return removeLeadToGroup

    }
}