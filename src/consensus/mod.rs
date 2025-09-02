use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use crate::console_log;

pub mod proof_of_action;
pub mod validator;

pub use proof_of_action::*;
pub use validator::*;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ProofOfAction {
    pub user_id: String,
    pub action_type: String,
    pub timestamp: f64,
    pub proof_hash: String,
    pub difficulty: u32,
    pub nonce: u64,
    pub authenticity_score: f64, // AI-calculated authenticity (0-1)
}

#[wasm_bindgen]
impl ProofOfAction {
    #[wasm_bindgen(constructor)]
    pub fn new(
        user_id: &str,
        action_type: &str,
        timestamp: f64,
        difficulty: u32,
    ) -> ProofOfAction {
        let mut proof = ProofOfAction {
            user_id: user_id.to_string(),
            action_type: action_type.to_string(),
            timestamp,
            proof_hash: String::new(),
            difficulty,
            nonce: 0,
            authenticity_score: 1.0,
        };

        proof.generate_proof();
        proof
    }

    #[wasm_bindgen]
    pub fn generate_proof(&mut self) {
        let target = "0".repeat(self.difficulty as usize);
        let base_data = format!("{}{}{}",
            self.user_id,
            self.action_type,
            self.timestamp
        );

        while !self.proof_hash.starts_with(&target) {
            self.nonce += 1;
            let data = format!("{}{}", base_data, self.nonce);
            
            let mut hasher = Sha256::new();
            hasher.update(data.as_bytes());
            self.proof_hash = format!("{:x}", hasher.finalize());
        }

        console_log!("Proof-of-Action generated for {} action with nonce: {}", 
                    self.action_type, self.nonce);
    }

    #[wasm_bindgen]
    pub fn validate(&self) -> bool {
        let target = "0".repeat(self.difficulty as usize);
        let data = format!("{}{}{}{}",
            self.user_id,
            self.action_type,
            self.timestamp,
            self.nonce
        );

        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        let calculated_hash = format!("{:x}", hasher.finalize());

        calculated_hash == self.proof_hash && 
        calculated_hash.starts_with(&target) &&
        self.authenticity_score >= 0.7 // Minimum authenticity threshold
    }

    #[wasm_bindgen]
    pub fn set_authenticity_score(&mut self, score: f64) {
        self.authenticity_score = score.clamp(0.0, 1.0);
    }

    #[wasm_bindgen]
    pub fn calculate_reward(&self) -> u64 {
        let base_reward = match self.action_type.as_str() {
            "click" => 5,
            "scroll" => 2,
            "share" => 25,
            "form_submit" => 50,
            "referral" => 100,
            "daily_login" => 20,
            _ => 1,
        };

        // Adjust reward based on authenticity score and difficulty
        let reward = (base_reward as f64 
            * self.authenticity_score 
            * (1.0 + (self.difficulty as f64 / 10.0))) as u64;

        reward.max(1) // Minimum 1 cent reward
    }
}