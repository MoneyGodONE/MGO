use anchor_lang::prelude::*;

// Declare the program ID
declare_id!("4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump");

#[program]
pub mod mgo_community_log {
    use super::*;

    pub fn create_log(
        ctx: Context<CreateLog>,
        vow_text: String,
        is_anonymous: bool,
    ) -> Result<()> {
        let log = &mut ctx.accounts.log;
        log.user = if is_anonymous { Pubkey::default() } else { ctx.accounts.user.key() };
        log.vow_text = vow_text;
        log.timestamp = Clock::get()?.unix_timestamp;
        log.verified = false;
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
    #[account(init, payer = user, space = 8 + 32 + 280 + 8 + 1)]
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
    pub user: Pubkey,         // 32 bytes
    pub vow_text: String,     // up to 280 bytes
    pub timestamp: i64,       // 8 bytes
    pub verified: bool,       // 1 byte
}

#[error_code]
pub enum CustomError {
    #[msg("Only a signer can verify a vow log.")]
    Unauthorized,
}
