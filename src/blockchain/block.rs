use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use chrono::{DateTime, Utc};
use crate::blockchain::Transaction;
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Block {
    pub index: u64,
    pub timestamp: String,
    pub transactions: Vec<Transaction>,
    pub previous_hash: String,
    pub hash: String,
    pub nonce: u64,
    pub merkle_root: String,
}

#[wasm_bindgen]
impl Block {
    #[wasm_bindgen(constructor)]
    pub fn new(index: u64, previous_hash: String, transactions: Vec<Transaction>) -> Block {
        let timestamp = Utc::now().to_rfc3339();
        let merkle_root = Self::calculate_merkle_root(&transactions);
        
        let mut block = Block {
            index,
            timestamp,
            transactions,
            previous_hash,
            hash: String::new(),
            nonce: 0,
            merkle_root,
        };

        block.hash = block.calculate_hash();
        block
    }

    pub fn genesis() -> Block {
        let genesis_tx = Transaction::new_genesis("genesis", 1000000000); // 10M BTN initial supply
        Block::new(0, "0".to_string(), vec![genesis_tx])
    }

    #[wasm_bindgen]
    pub fn calculate_hash(&self) -> String {
        let data = format!(
            "{}{}{}{}{}{}",
            self.index,
            self.timestamp,
            self.previous_hash,
            self.merkle_root,
            self.nonce,
            serde_json::to_string(&self.transactions).unwrap_or_default()
        );

        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    #[wasm_bindgen]
    pub fn mine_block(&mut self, difficulty: u32) {
        let target = "0".repeat(difficulty as usize);
        let start_time = js_sys::Date::now();

        while !self.hash.starts_with(&target) {
            self.nonce += 1;
            self.hash = self.calculate_hash();
        }

        let mining_time = js_sys::Date::now() - start_time;
        console_log!("Block mined in {}ms with nonce: {}", mining_time, self.nonce);
    }

    fn calculate_merkle_root(transactions: &[Transaction]) -> String {
        if transactions.is_empty() {
            return "0".to_string();
        }

        let mut hashes: Vec<String> = transactions
            .iter()
            .map(|tx| {
                let mut hasher = Sha256::new();
                hasher.update(tx.id.as_bytes());
                format!("{:x}", hasher.finalize())
            })
            .collect();

        while hashes.len() > 1 {
            let mut next_level = Vec::new();
            
            for chunk in hashes.chunks(2) {
                let combined = if chunk.len() == 2 {
                    format!("{}{}", chunk[0], chunk[1])
                } else {
                    format!("{}{}", chunk[0], chunk[0])
                };

                let mut hasher = Sha256::new();
                hasher.update(combined.as_bytes());
                next_level.push(format!("{:x}", hasher.finalize()));
            }

            hashes = next_level;
        }

        hashes[0].clone()
    }
}