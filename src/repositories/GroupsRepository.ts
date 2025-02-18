import { Group } from "@prisma/client"

export interface ICreateGroupAttributes{
    name: string,
    description: string
}

export interface IGroupsRepository {
    find: () => Promise<Group[]>
    findById: (id: number) => Promise<Group | null>
    create: (attributes: ICreateGroupAttributes) => Promise<Group>
    updateById: (id: number, attributes: Partial<ICreateGroupAttributes>) => Promise<Group | null>
    deleteById: (id: number) => Promise<Group | null>
}