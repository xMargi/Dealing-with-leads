import { HttpError } from "../erros/HttpError";
import { ICampaignsRepository } from "../repositories/CampaignsRepository";

export interface ICreateCampaign{
    name: string,
    description: string,
    startDate: Date,
    endDate: Date
}

export class campaignsService{
    constructor(private readonly campaignsRepository: ICampaignsRepository){}


    async getAllCampaigns(){
        const campaigns = await this.campaignsRepository.find()
        return campaigns
    }

    async createCampaign(attributes: ICreateCampaign ){
        const createCampaign = await this.campaignsRepository.create(attributes)
        return createCampaign
    }

    async getCampaignById(id: number){
        const findCampaign = await this.campaignsRepository.findById(id)
        if (!findCampaign) throw new HttpError(404, "Campanha não encontrada")
        return findCampaign
    }

    async updateCampaignById(id: number, attributes: Partial<ICreateCampaign>){
        const updatedCampaign = await this.campaignsRepository.updateById(id, attributes)
        if (!updatedCampaign) throw new HttpError(404, "Campanha não encontrada")
        return updatedCampaign
    }

    async deleteCampaignById(id: number){
        const deletedCampaign = await this.campaignsRepository.deleteById(id)
        if (!deletedCampaign) throw new HttpError(404, "Campanha não encotrada")

        return deletedCampaign
    }
}