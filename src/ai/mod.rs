use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::console_log;

pub mod fraud_detector;
pub mod reward_optimizer;

pub use fraud_detector::*;
pub use reward_optimizer::*;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AIConsensus {
    pub fraud_detector: FraudDetector,
    pub reward_optimizer: RewardOptimizer,
    pub action_patterns: HashMap<String, UserBehaviorPattern>,
    pub global_stats: GlobalBehaviorStats,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserBehaviorPattern {
    pub user_id: String,
    pub action_history: Vec<ActionEvent>,
    pub timing_patterns: Vec<f64>,
    pub device_fingerprints: Vec<String>,
    pub reputation_score: f64,
    pub total_actions: u64,
    pub suspicious_events: u32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ActionEvent {
    pub action_type: String,
    pub timestamp: f64,
    pub authenticity_score: f64,
    pub device_fingerprint: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GlobalBehaviorStats {
    pub total_users: u64,
    pub total_actions: u64,
    pub fraud_rate: f64,
    pub average_authenticity: f64,
    pub peak_activity_times: Vec<f64>,
}

#[wasm_bindgen]
impl AIConsensus {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AIConsensus {
        AIConsensus {
            fraud_detector: FraudDetector::new(),
            reward_optimizer: RewardOptimizer::new(),
            action_patterns: HashMap::new(),
            global_stats: GlobalBehaviorStats {
                total_users: 0,
                total_actions: 0,
                fraud_rate: 0.05, // 5% baseline fraud rate
                average_authenticity: 0.85,
                peak_activity_times: vec![],
            },
        }
    }

    #[wasm_bindgen]
    pub fn analyze_action(&mut self, 
        user_id: &str, 
        action_type: &str, 
        timestamp: f64,
        device_fingerprint: &str
    ) -> f64 {
        // Get or create user pattern
        let user_pattern = self.action_patterns
            .entry(user_id.to_string())
            .or_insert_with(|| UserBehaviorPattern {
                user_id: user_id.to_string(),
                action_history: Vec::new(),
                timing_patterns: Vec::new(),
                device_fingerprints: Vec::new(),
                reputation_score: 1.0,
                total_actions: 0,
                suspicious_events: 0,
            });

        // Detect fraud
        let authenticity_score = self.fraud_detector.analyze_action(
            user_pattern,
            action_type,
            timestamp,
            device_fingerprint,
        );

        // Record the action
        let action_event = ActionEvent {
            action_type: action_type.to_string(),
            timestamp,
            authenticity_score,
            device_fingerprint: device_fingerprint.to_string(),
        };

        user_pattern.action_history.push(action_event);
        user_pattern.total_actions += 1;

        // Update timing patterns
        if let Some(last_action) = user_pattern.action_history.iter().rev().nth(1) {
            user_pattern.timing_patterns.push(timestamp - last_action.timestamp);
        }

        // Update device fingerprints
        if !user_pattern.device_fingerprints.contains(&device_fingerprint.to_string()) {
            user_pattern.device_fingerprints.push(device_fingerprint.to_string());
        }

        // Update reputation based on authenticity
        user_pattern.reputation_score = (user_pattern.reputation_score * 0.95) + (authenticity_score * 0.05);

        // Flag suspicious behavior
        if authenticity_score < 0.5 {
            user_pattern.suspicious_events += 1;
            console_log!("Suspicious activity detected for user: {}", user_id);
        }

        // Update global stats
        self.global_stats.total_actions += 1;
        self.global_stats.average_authenticity = 
            (self.global_stats.average_authenticity * 0.999) + (authenticity_score * 0.001);

        console_log!("AI Analysis - User: {}, Action: {}, Authenticity: {:.2}", 
                    user_id, action_type, authenticity_score);

        authenticity_score
    }

    #[wasm_bindgen]
    pub fn optimize_rewards(&mut self) -> JsValue {
        let optimization = self.reward_optimizer.calculate_optimal_rewards(
            &self.action_patterns,
            &self.global_stats,
        );

        serde_wasm_bindgen::to_value(&optimization).unwrap()
    }

    #[wasm_bindgen]
    pub fn get_user_reputation(&self, user_id: &str) -> f64 {
        self.action_patterns
            .get(user_id)
            .map(|pattern| pattern.reputation_score)
            .unwrap_or(1.0)
    }

    #[wasm_bindgen]
    pub fn is_user_suspicious(&self, user_id: &str) -> bool {
        if let Some(pattern) = self.action_patterns.get(user_id) {
            pattern.reputation_score < 0.6 || 
            pattern.suspicious_events > 10 ||
            (pattern.suspicious_events as f64 / pattern.total_actions as f64) > 0.3
        } else {
            false
        }
    }

    #[wasm_bindgen]
    pub fn get_ai_stats(&self) -> JsValue {
        let stats = AIStats {
            total_users_analyzed: self.action_patterns.len(),
            total_actions_processed: self.global_stats.total_actions,
            current_fraud_rate: self.global_stats.fraud_rate,
            average_authenticity: self.global_stats.average_authenticity,
            suspicious_users: self.action_patterns.values()
                .filter(|p| p.reputation_score < 0.6)
                .count(),
        };

        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    #[wasm_bindgen]
    pub fn reset_user_reputation(&mut self, user_id: &str) {
        if let Some(pattern) = self.action_patterns.get_mut(user_id) {
            pattern.reputation_score = 1.0;
            pattern.suspicious_events = 0;
            console_log!("Reset reputation for user: {}", user_id);
        }
    }
}

#[derive(Serialize, Deserialize)]
struct AIStats {
    total_users_analyzed: usize,
    total_actions_processed: u64,
    current_fraud_rate: f64,
    average_authenticity: f64,
    suspicious_users: usize,
}