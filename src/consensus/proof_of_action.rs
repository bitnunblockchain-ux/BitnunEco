use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ActionValidator {
    min_time_between_actions: f64, // milliseconds
    max_actions_per_minute: u32,
    fraud_detection_enabled: bool,
}

#[wasm_bindgen]
impl ActionValidator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ActionValidator {
        ActionValidator {
            min_time_between_actions: 100.0, // 100ms minimum between actions
            max_actions_per_minute: 60,
            fraud_detection_enabled: true,
        }
    }

    #[wasm_bindgen]
    pub fn validate_action_timing(&self, 
        action_type: &str,
        current_timestamp: f64,
        last_timestamp: f64,
        actions_in_last_minute: u32
    ) -> bool {
        // Check minimum time between actions
        let time_diff = current_timestamp - last_timestamp;
        if time_diff < self.min_time_between_actions {
            console_log!("Action rejected: Too fast ({} ms)", time_diff);
            return false;
        }

        // Check max actions per minute
        if actions_in_last_minute >= self.max_actions_per_minute {
            console_log!("Action rejected: Rate limit exceeded");
            return false;
        }

        // Action-specific validation
        match action_type {
            "click" => time_diff >= 50.0,  // Min 50ms between clicks
            "scroll" => time_diff >= 500.0, // Min 500ms between scrolls
            "share" => time_diff >= 5000.0, // Min 5s between shares
            "form_submit" => time_diff >= 1000.0, // Min 1s between form submits
            _ => true,
        }
    }

    #[wasm_bindgen]
    pub fn calculate_authenticity_score(&self,
        action_type: &str,
        timing_pattern: &[f64],
        device_fingerprint: &str,
        ip_reputation: f64
    ) -> f64 {
        if !self.fraud_detection_enabled {
            return 1.0;
        }

        let mut score = 1.0;

        // Analyze timing patterns for human-like behavior
        let timing_score = self.analyze_timing_patterns(timing_pattern);
        score *= timing_score;

        // Device fingerprint consistency
        let device_score = if device_fingerprint.len() > 10 { 1.0 } else { 0.5 };
        score *= device_score;

        // IP reputation
        score *= ip_reputation.clamp(0.1, 1.0);

        // Action type specific adjustments
        let action_multiplier = match action_type {
            "click" => 0.9,      // Clicks are easier to fake
            "scroll" => 0.95,    // Scrolls are moderately easy to fake
            "share" => 1.0,      // Shares are harder to fake
            "form_submit" => 1.1, // Form submits are complex actions
            "referral" => 1.2,   // Referrals are high-value actions
            _ => 0.8,
        };

        (score * action_multiplier).clamp(0.0, 1.0)
    }

    fn analyze_timing_patterns(&self, timings: &[f64]) -> f64 {
        if timings.len() < 2 {
            return 1.0;
        }

        let mut intervals = Vec::new();
        for i in 1..timings.len() {
            intervals.push(timings[i] - timings[i-1]);
        }

        // Calculate variance - human behavior has natural variance
        let mean: f64 = intervals.iter().sum::<f64>() / intervals.len() as f64;
        let variance: f64 = intervals.iter()
            .map(|x| (x - mean).powi(2))
            .sum::<f64>() / intervals.len() as f64;

        // Too consistent = likely bot, too random = likely bot
        // Sweet spot is moderate variance
        let normalized_variance = (variance / (mean + 1.0)).clamp(0.0, 10.0);
        
        if normalized_variance < 0.1 || normalized_variance > 5.0 {
            0.3 // Likely bot behavior
        } else if normalized_variance >= 0.3 && normalized_variance <= 2.0 {
            1.0 // Human-like behavior
        } else {
            0.7 // Suspicious but not definitely bot
        }
    }
}