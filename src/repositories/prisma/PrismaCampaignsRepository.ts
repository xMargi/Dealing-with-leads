import { Campaign } from "@prisma/client";
import { AddLeadToCampaignAttributes, ICampaignsRepository, ICreateCampaignAttributes } from "../CampaignsRepository";
import { prisma } from "../../database";

export class PrismaCampaignsRepository implements ICampaignsRepository {
    async find(): Promise<Campaign[]> {
        return prisma.campaign.findMany()
    }
    async create(attributes: ICreateCampaignAttributes): Promise<Campaign> {
        return prisma.campaign.create({
            data: attributes
        })
    }
    async findById(id: number): Promise<Campaign | null> {
        return await prisma.campaign.findUnique({
            where: { id },
            include: {
                leads: {
                    include: { lead: true }
                }
            }
        })
    }
    async updateById(id: number, attributes: Partial<ICreateCampaignAttributes>): Promise<Campaign | null> {

        const campaignExists = await prisma.campaign.findUnique({where: {id}})
        if(!campaignExists) return null

        return prisma.campaign.update({
            data: attributes,
            where: { id }
        })
    }
    async deleteById(id: number): Promise<Campaign | null> {
      const deletedCampaign = await prisma.campaign.findUnique({where: {id}})
      if(!deletedCampaign) return null

      return prisma.campaign.delete({ where: { id } })
    }

    async addLead(attributes: AddLeadToCampaignAttributes): Promise<void> {
        await prisma.leadCampaign.create({data: attributes})
    }
   
  async updateLeadStatus(attributes: AddLeadToCampaignAttributes): Promise<void> {
    
    await prisma.leadCampaign.update({
      data: { status: attributes.status },
      where: {
        leadId_campaignId: {
          campaignId: attributes.campaignId,
          leadId: attributes.leadId,
        }
      }
    })
  }

  async removeLead(campaignId: number, leadId: number): Promise<void> {
    await prisma.leadCampaign.delete({
      where: {
        leadId_campaignId: { campaignId, leadId }
      }
    })
  }
}