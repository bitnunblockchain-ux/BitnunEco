use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StakingContract {
    pub stakes: HashMap<String, StakeInfo>,
    pub total_staked: u64,
    pub reward_rate: f64, // Annual percentage yield
    pub min_stake: u64,
    pub lock_period: f64, // Lock period in milliseconds
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StakeInfo {
    pub amount: u64,
    pub staked_at: f64,
    pub last_reward_claim: f64,
    pub total_rewards_claimed: u64,
}

#[wasm_bindgen]
impl StakingContract {
    #[wasm_bindgen(constructor)]
    pub fn new() -> StakingContract {
        StakingContract {
            stakes: HashMap::new(),
            total_staked: 0,
            reward_rate: 0.125, // 12.5% APY
            min_stake: 10000, // 100 BTN minimum
            lock_period: 7.0 * 24.0 * 60.0 * 60.0 * 1000.0, // 7 days in milliseconds
        }
    }

    #[wasm_bindgen]
    pub fn stake(&mut self, user: &str, amount: u64) -> bool {
        if amount < self.min_stake {
            console_log!("Stake failed: Amount below minimum {}", self.min_stake);
            return false;
        }

        let current_time = js_sys::Date::now();
        
        if let Some(existing_stake) = self.stakes.get_mut(user) {
            // Add to existing stake
            existing_stake.amount += amount;
            console_log!("Added {} BTN to existing stake for {}", amount, user);
        } else {
            // Create new stake
            let stake_info = StakeInfo {
                amount,
                staked_at: current_time,
                last_reward_claim: current_time,
                total_rewards_claimed: 0,
            };
            self.stakes.insert(user.to_string(), stake_info);
            console_log!("Created new stake of {} BTN for {}", amount, user);
        }

        self.total_staked += amount;
        true
    }

    #[wasm_bindgen]
    pub fn unstake(&mut self, user: &str, amount: u64) -> bool {
        if let Some(stake_info) = self.stakes.get_mut(user) {
            let current_time = js_sys::Date::now();
            
            // Check lock period
            if current_time - stake_info.staked_at < self.lock_period {
                console_log!("Unstake failed: Still in lock period");
                return false;
            }

            if stake_info.amount < amount {
                console_log!("Unstake failed: Insufficient staked amount");
                return false;
            }

            stake_info.amount -= amount;
            self.total_staked -= amount;

            // Remove stake if amount becomes 0
            if stake_info.amount == 0 {
                self.stakes.remove(user);
                console_log!("Removed complete stake for {}", user);
            }

            console_log!("Unstaked {} BTN for {}", amount, user);
            true
        } else {
            console_log!("Unstake failed: No stake found for {}", user);
            false
        }
    }

    #[wasm_bindgen]
    pub fn calculate_rewards(&self, user: &str) -> u64 {
        if let Some(stake_info) = self.stakes.get(user) {
            let current_time = js_sys::Date::now();
            let time_since_last_claim = current_time - stake_info.last_reward_claim;
            
            // Convert milliseconds to years for APY calculation
            let years = time_since_last_claim / (365.25 * 24.0 * 60.0 * 60.0 * 1000.0);
            
            let rewards = (stake_info.amount as f64 * self.reward_rate * years) as u64;
            rewards
        } else {
            0
        }
    }

    #[wasm_bindgen]
    pub fn claim_rewards(&mut self, user: &str) -> u64 {
        let rewards = self.calculate_rewards(user);
        
        if rewards > 0 {
            if let Some(stake_info) = self.stakes.get_mut(user) {
                stake_info.last_reward_claim = js_sys::Date::now();
                stake_info.total_rewards_claimed += rewards;
                
                console_log!("Claimed {} BTN rewards for {}", rewards, user);
                return rewards;
            }
        }

        console_log!("No rewards to claim for {}", user);
        0
    }

    #[wasm_bindgen]
    pub fn get_stake_info(&self, user: &str) -> JsValue {
        if let Some(stake_info) = self.stakes.get(user) {
            let info = UserStakeInfo {
                amount: stake_info.amount,
                staked_at: stake_info.staked_at,
                pending_rewards: self.calculate_rewards(user),
                total_rewards_claimed: stake_info.total_rewards_claimed,
                can_unstake: js_sys::Date::now() - stake_info.staked_at >= self.lock_period,
            };
            serde_wasm_bindgen::to_value(&info).unwrap()
        } else {
            JsValue::NULL
        }
    }

    #[wasm_bindgen]
    pub fn get_pool_stats(&self) -> JsValue {
        let stats = PoolStats {
            total_staked: self.total_staked,
            reward_rate: self.reward_rate,
            min_stake: self.min_stake,
            total_stakers: self.stakes.len(),
        };

        serde_wasm_bindgen::to_value(&stats).unwrap()
    }
}

#[derive(Serialize, Deserialize)]
struct UserStakeInfo {
    amount: u64,
    staked_at: f64,
    pending_rewards: u64,
    total_rewards_claimed: u64,
    can_unstake: bool,
}

#[derive(Serialize, Deserialize)]
struct PoolStats {
    total_staked: u64,
    reward_rate: f64,
    min_stake: u64,
    total_stakers: usize,
}