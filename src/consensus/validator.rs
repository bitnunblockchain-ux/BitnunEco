use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NetworkValidator {
    pub validators: HashMap<String, ValidatorInfo>,
    pub total_stake: u64,
    pub min_stake: u64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ValidatorInfo {
    pub address: String,
    pub stake: u64,
    pub reputation: f64,
    pub actions_validated: u64,
    pub accuracy_score: f64,
}

impl NetworkValidator {
    pub fn new() -> Self {
        NetworkValidator {
            validators: HashMap::new(),
            total_stake: 0,
            min_stake: 10000, // 100 BTN minimum stake
        }
    }

    pub fn add_validator(&mut self, address: String, stake: u64) -> bool {
        if stake < self.min_stake {
            return false;
        }

        let validator = ValidatorInfo {
            address: address.clone(),
            stake,
            reputation: 1.0,
            actions_validated: 0,
            accuracy_score: 1.0,
        };

        self.validators.insert(address, validator);
        self.total_stake += stake;
        true
    }

    pub fn select_validators(&self, count: usize) -> Vec<String> {
        // Select validators based on stake weight
        let mut selected = Vec::new();
        let mut total_weight = 0u64;

        // Calculate total weight
        for validator in self.validators.values() {
            total_weight += validator.stake;
        }

        // Simple stake-weighted selection
        for (address, validator) in &self.validators {
            let probability = validator.stake as f64 / total_weight as f64;
            if probability > 0.1 && selected.len() < count { // Minimum 10% stake
                selected.push(address.clone());
            }
        }

        selected
    }

    pub fn validate_action_consensus(&mut self, 
        action_id: &str,
        validations: Vec<(String, bool)> // (validator_address, is_valid)
    ) -> bool {
        let mut valid_count = 0u64;
        let mut total_stake = 0u64;

        for (validator_address, is_valid) in validations {
            if let Some(validator) = self.validators.get_mut(&validator_address) {
                validator.actions_validated += 1;
                total_stake += validator.stake;

                if is_valid {
                    valid_count += validator.stake;
                }

                // Update validator accuracy (simplified)
                validator.accuracy_score = (validator.accuracy_score * 0.95) + (if is_valid { 0.05 } else { 0.0 });
            }
        }

        // Require majority stake consensus
        valid_count * 2 > total_stake
    }
}