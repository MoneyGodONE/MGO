use anchor_lang::prelude::*;

declare_id!("4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump");

#[program]
pub mod mgo_community_log {
    use super::*;

    pub fn create_log(
        ctx: Context<CreateLog>,
        vow_text: String,
        is_anonymous: bool,
        category: u8,
    ) -> Result<()> {
        let log = &mut ctx.accounts.log;
        log.user = if is_anonymous { Pubkey::default() } else { ctx.accounts.user.key() };
        log.vow_text = vow_text;
        log.timestamp = Clock::get()?.unix_timestamp;
        log.verified = false;
        log.category = category;
        Ok(())
    }

    pub fn verify_log(ctx: Context<VerifyLog>) -> Result<()> {
        let log = &mut ctx.accounts.log;
        require!(ctx.accounts.verifier.is_signer, CustomError::Unauthorized);
        log.verified = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateLog<'info> {
    #[account(init, payer = user, space = 8 + 32 + 280 + 8 + 1 + 1)]
    pub log: Account<'info, VowLog>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyLog<'info> {
    #[account(mut)]
    pub log: Account<'info, VowLog>,
    pub verifier: Signer<'info>,
}

#[account]
pub struct VowLog {
    pub user: Pubkey,
    pub vow_text: String,
    pub timestamp: i64,
    pub verified: bool,
    pub category: u8,
}

#[error_code]
pub enum CustomError {
    #[msg("Only a signer can verify a vow log.")]
    Unauthorized,
}

# Solana program (Rust)
pub enum VowCategory {
    Prayer,
    VolunteerWork,
    CharityDonation,
    Mentorship,
    ElderSupport,
}

# Category enum (for frontend/off-chain)

const VOW_CATEGORIES = [
  "Prayer",
  "VolunteerWork",
  "CharityDonation",
  "Mentorship",
  "ElderSupport"
];
