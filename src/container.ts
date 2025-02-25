import { CampaignsController } from "./controllers/CampaignsController"
import { CampaignLeadsController } from "./controllers/CampaignsLeadsController"
import { GroupLeadsController } from "./controllers/GroupLeadsController"
import { GroupsController } from "./controllers/GroupsController"
import { LeadsController } from "./controllers/LeadsController"
import { PrismaCampaignsRepository } from "./repositories/prisma/PrismaCampaignsRepository"
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository"
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository"
import { campaignsService } from "./services/CampaignsService"
import { GroupsLeadsService } from "./services/GroupsLeadsService"
import { groupsService } from "./services/GroupsService"
import { leadsService } from "./services/LeadsService"
''


const leadsRepository = new PrismaLeadsRepository()
const groupsRepository = new PrismaGroupsRepository()
const campaignsRepository = new PrismaCampaignsRepository()
const LeadsService = new leadsService(leadsRepository)
const GroupsService = new groupsService(groupsRepository)
const CampaignsService = new campaignsService(campaignsRepository)
const GroupLeadsService = new GroupsLeadsService(leadsRepository, groupsRepository)

export const leadsController = new LeadsController(LeadsService)
export const groupsController = new GroupsController(GroupsService)
export const campaignsController = new CampaignsController(CampaignsService)
export const campaignLeadsController = new CampaignLeadsController(campaignsRepository, leadsRepository)
export const groupLeadsController = new GroupLeadsController(GroupLeadsService)
