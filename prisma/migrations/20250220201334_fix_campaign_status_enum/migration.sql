/*
  Warnings:

  - The values [FolloUp_Scheduled] on the enum `LeadCampaignStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeadCampaignStatus_new" AS ENUM ('New', 'Engaged', 'FollowUp_Scheduled', 'Contacted', 'Qualified', 'Converted', 'Unresponsive', 'Disqualified', 'Re_Engaged', 'Opted_Out');
ALTER TABLE "leadCampaign" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "leadCampaign" ALTER COLUMN "status" TYPE "LeadCampaignStatus_new" USING ("status"::text::"LeadCampaignStatus_new");
ALTER TYPE "LeadCampaignStatus" RENAME TO "LeadCampaignStatus_old";
ALTER TYPE "LeadCampaignStatus_new" RENAME TO "LeadCampaignStatus";
DROP TYPE "LeadCampaignStatus_old";
ALTER TABLE "leadCampaign" ALTER COLUMN "status" SET DEFAULT 'New';
COMMIT;
