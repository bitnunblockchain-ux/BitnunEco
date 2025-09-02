use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use crate::ai::UserBehaviorPattern;
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FraudDetector {
    pub min_action_interval: f64,
    pub max_actions_per_minute: u32,
    pub device_switching_threshold: u32,
    pub timing_variance_threshold: f64,
}

#[wasm_bindgen]
impl FraudDetector {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FraudDetector {
        FraudDetector {
            min_action_interval: 50.0, // 50ms minimum between actions
            max_actions_per_minute: 120, // 2 actions per second max
            device_switching_threshold: 5, // Max 5 different devices per user
            timing_variance_threshold: 10.0, // Variance threshold for bot detection
        }
    }

    pub fn analyze_action(&self, 
        user_pattern: &UserBehaviorPattern,
        action_type: &str,
        timestamp: f64,
        device_fingerprint: &str
    ) -> f64 {
        let mut authenticity_score = 1.0;

        // Check timing patterns
        authenticity_score *= self.analyze_timing_patterns(&user_pattern.timing_patterns, timestamp);

        // Check action frequency
        authenticity_score *= self.analyze_action_frequency(&user_pattern.action_history, timestamp);

        // Check device consistency
        authenticity_score *= self.analyze_device_patterns(&user_pattern.device_fingerprints, device_fingerprint);

        // Check for bot-like behavior patterns
        authenticity_score *= self.analyze_behavior_patterns(user_pattern, action_type);

        // Apply action-specific fraud detection
        authenticity_score *= self.analyze_action_specific_patterns(action_type, user_pattern);

        authenticity_score.clamp(0.0, 1.0)
    }

    fn analyze_timing_patterns(&self, timing_patterns: &[f64], current_timestamp: f64) -> f64 {
        if timing_patterns.is_empty() {
            return 1.0;
        }

        // Check for suspiciously consistent timing
        if timing_patterns.len() > 5 {
            let mean = timing_patterns.iter().sum::<f64>() / timing_patterns.len() as f64;
            let variance = timing_patterns.iter()
                .map(|x| (x - mean).powi(2))
                .sum::<f64>() / timing_patterns.len() as f64;

            // Too consistent = likely bot
            if variance < 100.0 {
                console_log!("Suspicious timing: Low variance ({})", variance);
                return 0.3;
            }

            // Too random = likely bot
            if variance > 100000.0 {
                console_log!("Suspicious timing: High variance ({})", variance);
                return 0.4;
            }
        }

        // Check minimum interval from last action
        if let Some(&last_interval) = timing_patterns.last() {
            if last_interval < self.min_action_interval {
                console_log!("Suspicious timing: Too fast ({}ms)", last_interval);
                return 0.2;
            }
        }

        1.0
    }

    fn analyze_action_frequency(&self, action_history: &[crate::ai::ActionEvent], current_timestamp: f64) -> f64 {
        let one_minute_ago = current_timestamp - 60000.0; // 60 seconds in milliseconds
        
        let recent_actions = action_history.iter()
            .filter(|action| action.timestamp > one_minute_ago)
            .count() as u32;

        if recent_actions > self.max_actions_per_minute {
            console_log!("Suspicious frequency: {} actions in last minute", recent_actions);
            return 0.1;
        }

        // Moderate frequency is more human-like
        if recent_actions > 60 {
            return 0.5;
        }

        1.0
    }

    fn analyze_device_patterns(&self, device_fingerprints: &[String], current_device: &str) -> f64 {
        if device_fingerprints.len() > self.device_switching_threshold as usize {
            console_log!("Suspicious device switching: {} different devices", device_fingerprints.len());
            return 0.3;
        }

        // New device is slightly suspicious
        if !device_fingerprints.contains(&current_device.to_string()) {
            return 0.9;
        }

        1.0
    }

    fn analyze_behavior_patterns(&self, user_pattern: &UserBehaviorPattern, action_type: &str) -> f64 {
        // Check for repetitive behavior
        let recent_actions = user_pattern.action_history.iter()
            .rev()
            .take(10)
            .filter(|action| action.action_type == action_type)
            .count();

        if recent_actions > 8 {
            console_log!("Suspicious behavior: Too many {} actions in sequence", action_type);
            return 0.4;
        }

        // Check reputation history
        if user_pattern.reputation_score < 0.5 {
            console_log!("User has low reputation: {:.2}", user_pattern.reputation_score);
            return 0.6;
        }

        1.0
    }

    fn analyze_action_specific_patterns(&self, action_type: &str, user_pattern: &UserBehaviorPattern) -> f64 {
        match action_type {
            "click" => {
                // Clicks should have some variety in timing
                if user_pattern.timing_patterns.len() > 10 {
                    let consistent_timings = user_pattern.timing_patterns.iter()
                        .filter(|&&interval| (interval - 100.0).abs() < 10.0) // Within 10ms of 100ms
                        .count();
                    
                    if consistent_timings > user_pattern.timing_patterns.len() / 2 {
                        return 0.3; // Too consistent click timing
                    }
                }
                1.0
            },
            
            "scroll" => {
                // Scrolls should be less frequent than clicks
                let recent_scrolls = user_pattern.action_history.iter()
                    .rev()
                    .take(20)
                    .filter(|action| action.action_type == "scroll")
                    .count();
                
                if recent_scrolls > 15 {
                    return 0.5; // Too many scrolls
                }
                1.0
            },
            
            "share" => {
                // Shares should be infrequent
                let recent_shares = user_pattern.action_history.iter()
                    .rev()
                    .take(100)
                    .filter(|action| action.action_type == "share")
                    .count();
                
                if recent_shares > 5 {
                    return 0.2; // Too many shares
                }
                1.0
            },
            
            "form_submit" => {
                // Form submits should have reasonable intervals
                let recent_forms = user_pattern.action_history.iter()
                    .rev()
                    .take(10)
                    .filter(|action| action.action_type == "form_submit")
                    .count();
                
                if recent_forms > 3 {
                    return 0.3; // Too many form submits
                }
                1.0
            },
            
            _ => 0.8 // Unknown action types are slightly suspicious
        }
    }
}