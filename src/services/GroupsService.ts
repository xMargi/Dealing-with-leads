import { HttpError } from "../erros/HttpError";
import { IGroupsRepository } from "../repositories/GroupsRepository";

export interface ICreateGroup {
    name: string,
    description: string
}

export interface IUpdateGroup {
    name?: string,
    description?: string
}

export class groupsService {
    constructor(private readonly groupsRepository: IGroupsRepository) { }

    async getAllGroups() {
        const groups = await this.groupsRepository.find()

        return groups
    }

    async createGroup(attributes: ICreateGroup) {
        const newGroup = await this.groupsRepository.create(attributes)
        return newGroup
    }

    async getGroupById(id: number) {
        const group = await this.groupsRepository.findById(id)

        if (!group) throw new HttpError(404, "Grupo não encontrado")

        return group
    }

    async updateGroupById(attributes: IUpdateGroup, id: number) {
        const updatedGroup = await this.groupsRepository.updateById(id, attributes)
        if (!updatedGroup) throw new HttpError(404, "grupo não encontrado")

        return updatedGroup
    }

    async deleteGroupById(id: number) {
        const deletedGroup = await this.groupsRepository.deleteById(id)

        if (!deletedGroup) throw new HttpError(404, "grupo não encontrado")

        return deletedGroup
    }

}