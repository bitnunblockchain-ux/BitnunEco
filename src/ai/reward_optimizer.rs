use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::ai::{UserBehaviorPattern, GlobalBehaviorStats};
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RewardOptimizer {
    pub base_rewards: HashMap<String, u64>,
    pub difficulty_multiplier: f64,
    pub economy_balance: f64,
    pub inflation_rate: f64,
}

#[derive(Serialize, Deserialize)]
pub struct RewardOptimization {
    pub optimized_rewards: HashMap<String, u64>,
    pub difficulty_adjustment: f64,
    pub economy_health: f64,
    pub recommended_changes: Vec<String>,
}

#[wasm_bindgen]
impl RewardOptimizer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> RewardOptimizer {
        let mut base_rewards = HashMap::new();
        base_rewards.insert("click".to_string(), 5);
        base_rewards.insert("scroll".to_string(), 2);
        base_rewards.insert("share".to_string(), 25);
        base_rewards.insert("form_submit".to_string(), 50);
        base_rewards.insert("referral".to_string(), 100);
        base_rewards.insert("daily_login".to_string(), 20);

        RewardOptimizer {
            base_rewards,
            difficulty_multiplier: 1.0,
            economy_balance: 1.0, // 1.0 = balanced
            inflation_rate: 0.02, // 2% annual inflation target
        }
    }

    pub fn calculate_optimal_rewards(
        &mut self,
        user_patterns: &HashMap<String, UserBehaviorPattern>,
        global_stats: &GlobalBehaviorStats
    ) -> RewardOptimization {
        console_log!("Calculating optimal rewards for {} users", user_patterns.len());

        // Analyze current economy state
        let economy_health = self.analyze_economy_health(user_patterns, global_stats);
        
        // Calculate difficulty adjustment
        let difficulty_adjustment = self.calculate_difficulty_adjustment(global_stats);
        
        // Optimize rewards for each action type
        let optimized_rewards = self.optimize_action_rewards(user_patterns, global_stats);
        
        // Generate recommendations
        let recommendations = self.generate_recommendations(economy_health, difficulty_adjustment);

        // Update internal state
        self.difficulty_multiplier = difficulty_adjustment;
        self.economy_balance = economy_health;

        RewardOptimization {
            optimized_rewards,
            difficulty_adjustment,
            economy_health,
            recommended_changes: recommendations,
        }
    }

    fn analyze_economy_health(
        &self,
        user_patterns: &HashMap<String, UserBehaviorPattern>,
        global_stats: &GlobalBehaviorStats
    ) -> f64 {
        // Calculate total BTN being distributed
        let total_actions = global_stats.total_actions as f64;
        let average_reward = self.base_rewards.values().sum::<u64>() as f64 / self.base_rewards.len() as f64;
        let estimated_total_rewards = total_actions * average_reward;

        // Check for inflation pressure
        let inflation_pressure = if total_actions > 1000000.0 {
            1.0 + (total_actions / 1000000.0) * 0.1 // 10% pressure per million actions
        } else {
            1.0
        };

        // Check fraud impact
        let fraud_impact = 1.0 - (global_stats.fraud_rate * 0.5); // Fraud reduces economy health

        // Check user distribution
        let active_users = user_patterns.len() as f64;
        let distribution_health = if active_users > 1000.0 {
            1.0
        } else {
            active_users / 1000.0 // Scale up rewards for fewer users
        };

        let economy_health = (fraud_impact * distribution_health) / inflation_pressure;
        
        console_log!("Economy health: {:.2} (inflation: {:.2}, fraud: {:.2}, distribution: {:.2})",
                    economy_health, inflation_pressure, fraud_impact, distribution_health);

        economy_health.clamp(0.1, 2.0)
    }

    fn calculate_difficulty_adjustment(&self, global_stats: &GlobalBehaviorStats) -> f64 {
        let target_actions_per_day = 100000.0; // Target 100k actions per day
        let current_actions_rate = global_stats.total_actions as f64; // Simplified

        let difficulty_adjustment = if current_actions_rate > target_actions_per_day {
            // Too many actions, increase difficulty
            1.0 + ((current_actions_rate / target_actions_per_day) - 1.0) * 0.1
        } else {
            // Too few actions, decrease difficulty
            0.9 + (current_actions_rate / target_actions_per_day) * 0.1
        };

        console_log!("Difficulty adjustment: {:.2} (current rate: {:.0}, target: {:.0})",
                    difficulty_adjustment, current_actions_rate, target_actions_per_day);

        difficulty_adjustment.clamp(0.5, 2.0)
    }

    fn optimize_action_rewards(
        &self,
        user_patterns: &HashMap<String, UserBehaviorPattern>,
        global_stats: &GlobalBehaviorStats
    ) -> HashMap<String, u64> {
        let mut optimized_rewards = HashMap::new();

        // Count action types
        let mut action_counts: HashMap<String, u64> = HashMap::new();
        for pattern in user_patterns.values() {
            for action in &pattern.action_history {
                *action_counts.entry(action.action_type.clone()).or_insert(0) += 1;
            }
        }

        // Calculate optimal rewards for each action type
        for (action_type, base_reward) in &self.base_rewards {
            let action_frequency = *action_counts.get(action_type).unwrap_or(&0) as f64;
            let total_actions = global_stats.total_actions as f64;
            
            let frequency_ratio = if total_actions > 0.0 {
                action_frequency / total_actions
            } else {
                0.0
            };

            // Adjust rewards based on frequency (rarer actions get higher rewards)
            let frequency_multiplier = if frequency_ratio > 0.5 {
                0.8 // Very common actions get reduced rewards
            } else if frequency_ratio > 0.2 {
                1.0 // Normal frequency
            } else if frequency_ratio > 0.05 {
                1.2 // Uncommon actions get bonus
            } else {
                1.5 // Rare actions get significant bonus
            };

            // Apply economy and difficulty adjustments
            let optimized_reward = (*base_reward as f64 
                * frequency_multiplier 
                * self.economy_balance 
                * self.difficulty_multiplier) as u64;

            optimized_rewards.insert(action_type.clone(), optimized_reward.max(1)); // Minimum 1 cent

            console_log!("Optimized reward for {}: {} BTN (freq: {:.1}%, mult: {:.2})",
                        action_type, optimized_reward, frequency_ratio * 100.0, frequency_multiplier);
        }

        optimized_rewards
    }

    fn generate_recommendations(&self, economy_health: f64, difficulty_adjustment: f64) -> Vec<String> {
        let mut recommendations = Vec::new();

        if economy_health < 0.8 {
            recommendations.push("Consider reducing base reward rates to control inflation".to_string());
        } else if economy_health > 1.2 {
            recommendations.push("Economy is stable - consider increasing rewards to boost participation".to_string());
        }

        if difficulty_adjustment > 1.1 {
            recommendations.push("High activity detected - increase mining difficulty to balance rewards".to_string());
        } else if difficulty_adjustment < 0.9 {
            recommendations.push("Low activity detected - consider reducing difficulty or increasing rewards".to_string());
        }

        if recommendations.is_empty() {
            recommendations.push("Economy is well-balanced - maintain current reward structure".to_string());
        }

        recommendations
    }

    #[wasm_bindgen]
    pub fn get_current_rewards(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.base_rewards).unwrap()
    }

    #[wasm_bindgen]
    pub fn update_base_reward(&mut self, action_type: &str, reward: u64) {
        self.base_rewards.insert(action_type.to_string(), reward);
        console_log!("Updated base reward for {}: {} BTN", action_type, reward);
    }
}