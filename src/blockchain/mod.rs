use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::console_log;

pub mod block;
pub mod transaction;
pub mod merkle;

pub use block::*;
pub use transaction::*;
pub use merkle::*;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BitnunBlockchain {
    blocks: Vec<Block>,
    pending_transactions: Vec<Transaction>,
    mining_difficulty: u32,
    mining_reward: u64,
    total_supply: u64,
    carbon_offset: u64, // CO2 saved in grams
}

#[wasm_bindgen]
impl BitnunBlockchain {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BitnunBlockchain {
        let genesis_block = Block::genesis();
        console_log!("Genesis block created: {}", genesis_block.hash);
        
        BitnunBlockchain {
            blocks: vec![genesis_block],
            pending_transactions: Vec::new(),
            mining_difficulty: 2,
            mining_reward: 1000, // 10.00 BTN in cents
            total_supply: 1000000000, // 10M BTN total supply
            carbon_offset: 0,
        }
    }

    #[wasm_bindgen]
    pub fn add_transaction(&mut self, transaction: &Transaction) -> bool {
        if self.validate_transaction(transaction) {
            self.pending_transactions.push(transaction.clone());
            console_log!("Transaction added: {}", transaction.id);
            true
        } else {
            console_log!("Invalid transaction rejected: {}", transaction.id);
            false
        }
    }

    #[wasm_bindgen]
    pub fn mine_pending_transactions(&mut self, mining_reward_address: &str) -> String {
        // Add mining reward transaction
        let reward_tx = Transaction::new_mining_reward(mining_reward_address, self.mining_reward);
        self.pending_transactions.push(reward_tx);

        let previous_hash = self.get_latest_block().hash.clone();
        let mut new_block = Block::new(
            self.blocks.len() as u64,
            previous_hash,
            self.pending_transactions.clone(),
        );

        // Proof-of-Action mining (lightweight)
        new_block.mine_block(self.mining_difficulty);
        
        // Calculate carbon offset (each block saves CO2)
        self.carbon_offset += 10; // 10g CO2 per block
        
        console_log!("Block mined: {} with {} transactions", new_block.hash, new_block.transactions.len());
        
        self.blocks.push(new_block.clone());
        self.pending_transactions.clear();

        new_block.hash
    }

    #[wasm_bindgen]
    pub fn get_balance(&self, address: &str) -> u64 {
        let mut balance = 0u64;

        for block in &self.blocks {
            for transaction in &block.transactions {
                if transaction.from_address == address {
                    balance = balance.saturating_sub(transaction.amount);
                }
                if transaction.to_address == address {
                    balance = balance.saturating_add(transaction.amount);
                }
            }
        }

        balance
    }

    #[wasm_bindgen]
    pub fn validate_chain(&self) -> bool {
        for i in 1..self.blocks.len() {
            let current_block = &self.blocks[i];
            let previous_block = &self.blocks[i - 1];

            if current_block.hash != current_block.calculate_hash() {
                console_log!("Invalid block hash at index {}", i);
                return false;
            }

            if current_block.previous_hash != previous_block.hash {
                console_log!("Invalid previous hash at index {}", i);
                return false;
            }
        }

        console_log!("Blockchain validation successful");
        true
    }

    #[wasm_bindgen]
    pub fn get_chain_stats(&self) -> JsValue {
        let stats = ChainStats {
            total_blocks: self.blocks.len(),
            total_transactions: self.blocks.iter().map(|b| b.transactions.len()).sum(),
            total_supply: self.total_supply,
            carbon_offset: self.carbon_offset,
            mining_difficulty: self.mining_difficulty,
        };

        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    fn validate_transaction(&self, transaction: &Transaction) -> bool {
        if transaction.from_address == "" {
            return true; // Mining reward or genesis
        }

        let balance = self.get_balance(&transaction.from_address);
        balance >= transaction.amount
    }

    fn get_latest_block(&self) -> &Block {
        self.blocks.last().unwrap()
    }
}

#[derive(Serialize, Deserialize)]
struct ChainStats {
    total_blocks: usize,
    total_transactions: usize,
    total_supply: u64,
    carbon_offset: u64,
    mining_difficulty: u32,
}