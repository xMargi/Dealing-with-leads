import { CampaignsController } from "../../controllers/CampaignsController"
import { CampaignLeadsController } from "../../controllers/CampaignsLeadsController"
import { GroupLeadsController } from "../../controllers/GroupLeadsController"
import { GroupsController } from "../../controllers/GroupsController"
import { LeadsController } from "../../controllers/LeadsController"
import { PrismaGroupsRepository } from "./PrismaGroupsRepository"
import { PrismaLeadsRepository } from "./PrismaLeadsRepository"


const leadsRepository = new PrismaLeadsRepository()
const groupsRepository = new PrismaGroupsRepository()

export const leadsController = new LeadsController(leadsRepository)
export const groupsController = new GroupsController(groupsRepository)
export const campaignsController = new CampaignsController()
export const campaignLeadsController = new CampaignLeadsController()
export const groupLeadsController = new GroupLeadsController(groupsRepository, leadsRepository)
