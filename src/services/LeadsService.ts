import { LeadStatus } from "@prisma/client"
import { ICreateLeadAttributes, ILeadsRepository, ILeadWhereParams } from "../repositories/LeadsRepository"
import { HttpError } from "../erros/HttpError"

interface IGetLeadsWithPaginationParams {
    page: number,
    pageSize: number,
    name?: string,
    status?: LeadStatus,
    sortBy: "name" | "status" | "createdAt"
    order: "asc" | "desc"
}

interface IUpdateLead {
    name?: string,
    email?: string,
    phone?: string,
    status?: LeadStatus
}

export class leadsService {
    constructor(private readonly leadsRepository: ILeadsRepository) { }
    async getAllLeadsPaginated({ name, status, page = 1, pageSize = 10, sortBy, order }: IGetLeadsWithPaginationParams) {
        const limit = pageSize
        const offset = (page - 1) * limit

        const where: ILeadWhereParams = {}

        if (name) where.name = { like: name, mode: "insensitive" }
        if (status) where.status = status

        const leads = await this.leadsRepository.find({ where, sortBy, order, limit, offset })
        const total = await this.leadsRepository.count(where)

        return {
            data: leads,
            meta: {
                page,
                pageSize,
                total: total,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    }

    async createLead(params: ICreateLeadAttributes) {
        if (!params.status) params.status = "New"
        const newLead = await this.leadsRepository.create(params)
        return newLead
    }

    async getLeadById(id: number) {
        const lead = await this.leadsRepository.findById(id)
        if (!lead) throw new HttpError(404, "Lead não encontrado!")
        return lead
    }

    

    async updateLeadById(id: number, params: IUpdateLead) {
        const leadExists = await this.leadsRepository.findById(id)
        if (!leadExists) throw new HttpError(404, "Lead não encontrado")

        if (leadExists.status === "New" && params.status !== undefined && params.status !== "Contacted") {
            throw new HttpError(400, "Um novo lead deve ser contatado antes de ter seu status atualizado para outros valores")
        }

        if (params.status && params.status === "Archived") {
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - leadExists.updatedAt.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            if (diffDays < 180) throw new HttpError(400, "Um lead só pode ser arquivado após 6 meses de inatividade!")
        }

        const leadUpdated = await this.leadsRepository.updateById(id, params)

        if(leadUpdated === null) throw new HttpError(404, "Não foi possivel fazer o update no lead")

        return leadUpdated
    }

    async deleteById(id: number) {
        const findLead = await this.leadsRepository.findById(id)

        if(!findLead){
            throw new HttpError(404, "Lead não encontrado!")
        }
        const deletedLead = await this.leadsRepository.deleteById(id)

        if(deletedLead === null) throw new HttpError(404, "Não foi possivel deletar o lead")

        return {deletedLead}
    }

}