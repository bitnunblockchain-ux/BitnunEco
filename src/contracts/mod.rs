use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;
use crate::console_log;

pub mod btn_token;
pub mod nft_contract;
pub mod staking;

pub use btn_token::*;
pub use nft_contract::*;
pub use staking::*;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SmartContract {
    pub address: String,
    pub owner: String,
    pub code: String,
    pub storage: HashMap<String, String>,
    pub gas_limit: u64,
}

#[wasm_bindgen]
impl SmartContract {
    #[wasm_bindgen(constructor)]
    pub fn new(owner: &str, code: &str) -> SmartContract {
        SmartContract {
            address: format!("0x{}", Uuid::new_v4().to_string().replace("-", "")),
            owner: owner.to_string(),
            code: code.to_string(),
            storage: HashMap::new(),
            gas_limit: 1000000, // 1M gas limit
        }
    }

    #[wasm_bindgen]
    pub fn execute(&mut self, function: &str, params: &str) -> String {
        console_log!("Executing contract function: {} with params: {}", function, params);
        
        match function {
            "transfer" => self.handle_transfer(params),
            "mint" => self.handle_mint(params),
            "approve" => self.handle_approve(params),
            "stake" => self.handle_stake(params),
            _ => "Function not found".to_string(),
        }
    }

    fn handle_transfer(&mut self, params: &str) -> String {
        // Parse transfer parameters: from,to,amount
        let parts: Vec<&str> = params.split(',').collect();
        if parts.len() != 3 {
            return "Invalid parameters".to_string();
        }

        let from = parts[0];
        let to = parts[1];
        let amount: u64 = parts[2].parse().unwrap_or(0);

        // Get current balances
        let from_balance: u64 = self.storage
            .get(&format!("balance_{}", from))
            .unwrap_or(&"0".to_string())
            .parse()
            .unwrap_or(0);

        if from_balance < amount {
            return "Insufficient balance".to_string();
        }

        let to_balance: u64 = self.storage
            .get(&format!("balance_{}", to))
            .unwrap_or(&"0".to_string())
            .parse()
            .unwrap_or(0);

        // Update balances
        self.storage.insert(
            format!("balance_{}", from),
            (from_balance - amount).to_string(),
        );
        self.storage.insert(
            format!("balance_{}", to),
            (to_balance + amount).to_string(),
        );

        console_log!("Transfer: {} BTN from {} to {}", amount, from, to);
        "Success".to_string()
    }

    fn handle_mint(&mut self, params: &str) -> String {
        let parts: Vec<&str> = params.split(',').collect();
        if parts.len() != 2 {
            return "Invalid parameters".to_string();
        }

        let to = parts[0];
        let amount: u64 = parts[1].parse().unwrap_or(0);

        let current_balance: u64 = self.storage
            .get(&format!("balance_{}", to))
            .unwrap_or(&"0".to_string())
            .parse()
            .unwrap_or(0);

        self.storage.insert(
            format!("balance_{}", to),
            (current_balance + amount).to_string(),
        );

        // Update total supply
        let total_supply: u64 = self.storage
            .get("total_supply")
            .unwrap_or(&"0".to_string())
            .parse()
            .unwrap_or(0);

        self.storage.insert("total_supply", (total_supply + amount).to_string());

        console_log!("Minted {} BTN to {}", amount, to);
        "Success".to_string()
    }

    fn handle_approve(&mut self, params: &str) -> String {
        let parts: Vec<&str> = params.split(',').collect();
        if parts.len() != 3 {
            return "Invalid parameters".to_string();
        }

        let owner = parts[0];
        let spender = parts[1];
        let amount: u64 = parts[2].parse().unwrap_or(0);

        self.storage.insert(
            format!("allowance_{}_{}", owner, spender),
            amount.to_string(),
        );

        console_log!("Approved {} BTN from {} to {}", amount, owner, spender);
        "Success".to_string()
    }

    fn handle_stake(&mut self, params: &str) -> String {
        let parts: Vec<&str> = params.split(',').collect();
        if parts.len() != 2 {
            return "Invalid parameters".to_string();
        }

        let user = parts[0];
        let amount: u64 = parts[1].parse().unwrap_or(0);

        let current_stake: u64 = self.storage
            .get(&format!("stake_{}", user))
            .unwrap_or(&"0".to_string())
            .parse()
            .unwrap_or(0);

        self.storage.insert(
            format!("stake_{}", user),
            (current_stake + amount).to_string(),
        );

        console_log!("Staked {} BTN for {}", amount, user);
        "Success".to_string()
    }

    #[wasm_bindgen]
    pub fn get_storage(&self, key: &str) -> String {
        self.storage.get(key).unwrap_or(&"".to_string()).clone()
    }

    #[wasm_bindgen]
    pub fn set_storage(&mut self, key: &str, value: &str) {
        self.storage.insert(key.to_string(), value.to_string());
    }
}