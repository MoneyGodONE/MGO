use anchor_lang::prelude::*;

declare_id!("YourCrowdfundProgram11111111111111111111111111111");

#[program]
pub mod mgo_crowdfund {
    use super::*;

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        goal: u64,
        deadline: i64,
        title: String,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.creator = *ctx.accounts.creator.key;
        campaign.goal = goal;
        campaign.deadline = deadline;
        campaign.title = title;
        campaign.total_pledged = 0;
        campaign.claimed = false;
        Ok(())
    }

    pub fn pledge(ctx: Context<Pledge>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(campaign.deadline > Clock::get()?.unix_timestamp, CrowdfundError::CampaignEnded);
        campaign.total_pledged += amount;
        // Transfer MGO SPL Token here (omitted for brevity)
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(campaign.creator == *ctx.accounts.creator.key, CrowdfundError::Unauthorized);
        require!(campaign.total_pledged >= campaign.goal, CrowdfundError::GoalNotReached);
        require!(!campaign.claimed, CrowdfundError::AlreadyClaimed);
        campaign.claimed = true;
        // Transfer pledged tokens to creator (omitted)
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(init, payer = creator, space = 8 + 128)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Pledge<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub pledger: Signer<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
}

#[account]
pub struct Campaign {
    pub creator: Pubkey,
    pub title: String,
    pub goal: u64,
    pub deadline: i64,
    pub total_pledged: u64,
    pub claimed: bool,
}

#[error_code]
pub enum CrowdfundError {
    #[msg("Campaign has already ended.")]
    CampaignEnded,
    #[msg("You are not authorized to claim this campaign.")]
    Unauthorized,
    #[msg("Funding goal has not been reached.")]
    GoalNotReached,
    #[msg("Funds already claimed.")]
    AlreadyClaimed,
}

