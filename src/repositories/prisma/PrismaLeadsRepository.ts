import { Lead } from "@prisma/client";
import { ICreateLeadAttributes, IFindLeadsParams, ILeadsRepository, ILeadWhereParams } from "../LeadsRepository";
import { prisma } from "../../database";

export class PrismaLeadsRepository implements ILeadsRepository {
    async find(params: IFindLeadsParams): Promise<Lead[]> {
        return prisma.lead.findMany({
            where: {
                name: {
                    contains: params.where?.name?.like,
                    equals: params.where?.name?.equals,
                    mode: params.where?.name?.mode
                },
                status: params.where?.status,
                groups: {
                    some: {
                        id: params.where?.groupId
                    }
                }
            },
            orderBy: {[params.sortBy ?? "name"]: params.order},
            skip: params.offset,
            take: params.limit,
            include: {
                groups: params.include?.groups,
                campaigns: params.include?.campaings
            }
        })
    }

    async findById(id: number): Promise<Lead | null> {
        return prisma.lead.findUnique({
            where: {id},
            include: {
                campaigns: true,
                groups: true
            }
        })
    }

    async count(where: ILeadWhereParams): Promise<number>{
        return prisma.lead.count({where: {
            name: {
                contains: where?.name?.like,
                equals: where?.name?.equals,
                mode: where?.name?.mode
            },
            status: where?.status,
            groups: {
                some: {
                    id: where?.groupId
                }
            }
        },})
    }

    async create(attributes: ICreateLeadAttributes): Promise<Lead> {
        return prisma.lead.create({ data: attributes})
    }

    async updateById(id: number, attributes: Partial<ICreateLeadAttributes>): Promise<Lead>{

        return prisma.lead.update({
            where: {id},
            data: attributes
        })
    }

    deleteById(id: number): Promise<Lead> {
        return prisma.lead.delete({ where: {id}})
    }
}