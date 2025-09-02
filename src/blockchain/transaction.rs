use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
    pub from_address: String,
    pub to_address: String,
    pub amount: u64,
    pub timestamp: String,
    pub transaction_type: String,
    pub action_proof: Option<String>, // Cryptographic proof of user action
    pub carbon_offset: u64, // CO2 saved in grams
}

#[wasm_bindgen]
impl Transaction {
    #[wasm_bindgen(constructor)]
    pub fn new(
        from_address: &str,
        to_address: &str,
        amount: u64,
        transaction_type: &str,
    ) -> Transaction {
        Transaction {
            id: Uuid::new_v4().to_string(),
            from_address: from_address.to_string(),
            to_address: to_address.to_string(),
            amount,
            timestamp: Utc::now().to_rfc3339(),
            transaction_type: transaction_type.to_string(),
            action_proof: None,
            carbon_offset: 10, // Each transaction saves 10g CO2
        }
    }

    #[wasm_bindgen]
    pub fn new_action_mining(
        user_address: &str,
        action_type: &str,
        reward_amount: u64,
        action_proof: &str,
    ) -> Transaction {
        Transaction {
            id: Uuid::new_v4().to_string(),
            from_address: "".to_string(), // System reward
            to_address: user_address.to_string(),
            amount: reward_amount,
            timestamp: Utc::now().to_rfc3339(),
            transaction_type: format!("action_mining_{}", action_type),
            action_proof: Some(action_proof.to_string()),
            carbon_offset: 5, // Action mining saves 5g CO2
        }
    }

    pub fn new_mining_reward(miner_address: &str, reward_amount: u64) -> Transaction {
        Transaction {
            id: Uuid::new_v4().to_string(),
            from_address: "".to_string(),
            to_address: miner_address.to_string(),
            amount: reward_amount,
            timestamp: Utc::now().to_rfc3339(),
            transaction_type: "mining_reward".to_string(),
            action_proof: None,
            carbon_offset: 15, // Mining rewards save 15g CO2
        }
    }

    pub fn new_genesis(genesis_address: &str, initial_supply: u64) -> Transaction {
        Transaction {
            id: "genesis".to_string(),
            from_address: "".to_string(),
            to_address: genesis_address.to_string(),
            amount: initial_supply,
            timestamp: Utc::now().to_rfc3339(),
            transaction_type: "genesis".to_string(),
            action_proof: None,
            carbon_offset: 0,
        }
    }

    #[wasm_bindgen]
    pub fn set_action_proof(&mut self, proof: &str) {
        self.action_proof = Some(proof.to_string());
    }

    #[wasm_bindgen]
    pub fn is_valid(&self) -> bool {
        !self.id.is_empty() 
            && !self.to_address.is_empty() 
            && self.amount > 0
    }
}