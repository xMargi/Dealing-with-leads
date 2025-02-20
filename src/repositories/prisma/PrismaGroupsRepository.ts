import { Group } from "@prisma/client";
import { ICreateGroupAttributes, IGroupsRepository } from "../GroupsRepository";
import { prisma } from "../../database";

export class PrismaGroupsRepository implements IGroupsRepository {
    async find(): Promise<Group[]> {
        return prisma.group.findMany()
    }
    async findById(id: number): Promise<Group | null> {
        return prisma.group.findUnique({ where: { id }, include: {leads: true} })
    }
    async create(attributes: ICreateGroupAttributes): Promise<Group> {
        return prisma.group.create({ data: attributes })
    }
    async updateById(id: number, attributes: Partial<ICreateGroupAttributes>): Promise<Group | null> {
        return prisma.group.update({ where: { id }, data: attributes })
    }
    async deleteById(id: number): Promise<Group | null> {
        return prisma.group.delete({ where: { id } })
    }

    async addLead(groupId: number, leadId: number): Promise<Group>{
        return prisma.group.update({
            where: {id: groupId},
            data: {
                leads: {
                    connect: {id: leadId}
                }
            }
        })
    }

    async removeLead(groupId: number, leadId: number): Promise<Group>{
        return prisma.group.update({
            where: { id: groupId },
            data: {
                leads: {
                    disconnect: { id: leadId },
                },
            },
        });
    }

}