use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BTNToken {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
    pub balances: HashMap<String, u64>,
    pub allowances: HashMap<String, HashMap<String, u64>>,
    pub owner: String,
    pub minting_enabled: bool,
}

#[wasm_bindgen]
impl BTNToken {
    #[wasm_bindgen(constructor)]
    pub fn new(owner: &str, initial_supply: u64) -> BTNToken {
        let mut balances = HashMap::new();
        balances.insert(owner.to_string(), initial_supply);

        BTNToken {
            name: "Bitnun Token".to_string(),
            symbol: "BTN".to_string(),
            decimals: 2, // 2 decimal places (cents)
            total_supply: initial_supply,
            balances,
            allowances: HashMap::new(),
            owner: owner.to_string(),
            minting_enabled: true,
        }
    }

    #[wasm_bindgen]
    pub fn balance_of(&self, account: &str) -> u64 {
        *self.balances.get(account).unwrap_or(&0)
    }

    #[wasm_bindgen]
    pub fn transfer(&mut self, from: &str, to: &str, amount: u64) -> bool {
        let from_balance = self.balance_of(from);
        if from_balance < amount {
            console_log!("Transfer failed: Insufficient balance");
            return false;
        }

        let to_balance = self.balance_of(to);
        
        self.balances.insert(from.to_string(), from_balance - amount);
        self.balances.insert(to.to_string(), to_balance + amount);

        console_log!("Transferred {} BTN from {} to {}", amount, from, to);
        true
    }

    #[wasm_bindgen]
    pub fn approve(&mut self, owner: &str, spender: &str, amount: u64) -> bool {
        if !self.allowances.contains_key(owner) {
            self.allowances.insert(owner.to_string(), HashMap::new());
        }

        if let Some(owner_allowances) = self.allowances.get_mut(owner) {
            owner_allowances.insert(spender.to_string(), amount);
            console_log!("Approved {} BTN from {} to {}", amount, owner, spender);
            true
        } else {
            false
        }
    }

    #[wasm_bindgen]
    pub fn allowance(&self, owner: &str, spender: &str) -> u64 {
        self.allowances
            .get(owner)
            .and_then(|owner_allowances| owner_allowances.get(spender))
            .copied()
            .unwrap_or(0)
    }

    #[wasm_bindgen]
    pub fn transfer_from(&mut self, spender: &str, from: &str, to: &str, amount: u64) -> bool {
        let allowance = self.allowance(from, spender);
        if allowance < amount {
            console_log!("Transfer from failed: Insufficient allowance");
            return false;
        }

        if !self.transfer(from, to, amount) {
            return false;
        }

        // Decrease allowance
        if let Some(owner_allowances) = self.allowances.get_mut(from) {
            owner_allowances.insert(spender.to_string(), allowance - amount);
        }

        true
    }

    #[wasm_bindgen]
    pub fn mint(&mut self, to: &str, amount: u64) -> bool {
        if !self.minting_enabled {
            console_log!("Minting disabled");
            return false;
        }

        let to_balance = self.balance_of(to);
        self.balances.insert(to.to_string(), to_balance + amount);
        self.total_supply += amount;

        console_log!("Minted {} BTN to {}", amount, to);
        true
    }

    #[wasm_bindgen]
    pub fn burn(&mut self, from: &str, amount: u64) -> bool {
        let from_balance = self.balance_of(from);
        if from_balance < amount {
            console_log!("Burn failed: Insufficient balance");
            return false;
        }

        self.balances.insert(from.to_string(), from_balance - amount);
        self.total_supply -= amount;

        console_log!("Burned {} BTN from {}", amount, from);
        true
    }

    #[wasm_bindgen]
    pub fn disable_minting(&mut self) {
        self.minting_enabled = false;
        console_log!("Minting disabled permanently");
    }

    #[wasm_bindgen]
    pub fn get_token_info(&self) -> JsValue {
        let info = TokenInfo {
            name: self.name.clone(),
            symbol: self.symbol.clone(),
            decimals: self.decimals,
            total_supply: self.total_supply,
            minting_enabled: self.minting_enabled,
        };

        serde_wasm_bindgen::to_value(&info).unwrap()
    }
}

#[derive(Serialize, Deserialize)]
struct TokenInfo {
    name: String,
    symbol: String,
    decimals: u8,
    total_supply: u64,
    minting_enabled: bool,
}