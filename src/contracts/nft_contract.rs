use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BitnunNFT {
    pub name: String,
    pub symbol: String,
    pub next_token_id: u64,
    pub tokens: HashMap<u64, NFTMetadata>,
    pub owners: HashMap<u64, String>,
    pub approved: HashMap<u64, String>,
    pub operator_approvals: HashMap<String, HashMap<String, bool>>,
    pub carbon_offset_per_nft: u64, // CO2 offset in grams
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NFTMetadata {
    pub token_id: u64,
    pub name: String,
    pub description: String,
    pub image: String,
    pub attributes: HashMap<String, String>,
    pub carbon_offset: u64,
    pub minted_at: f64,
    pub creator: String,
}

#[wasm_bindgen]
impl BitnunNFT {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BitnunNFT {
        BitnunNFT {
            name: "Bitnun Sustainable NFT".to_string(),
            symbol: "BNFT".to_string(),
            next_token_id: 1,
            tokens: HashMap::new(),
            owners: HashMap::new(),
            approved: HashMap::new(),
            operator_approvals: HashMap::new(),
            carbon_offset_per_nft: 100, // 100g CO2 offset per NFT
        }
    }

    #[wasm_bindgen]
    pub fn mint(&mut self, to: &str, name: &str, description: &str, image: &str) -> u64 {
        let token_id = self.next_token_id;
        self.next_token_id += 1;

        let mut attributes = HashMap::new();
        attributes.insert("sustainability".to_string(), "carbon-negative".to_string());
        attributes.insert("blockchain".to_string(), "bitnun".to_string());
        attributes.insert("token_standard".to_string(), "BNFT-721".to_string());

        let metadata = NFTMetadata {
            token_id,
            name: name.to_string(),
            description: description.to_string(),
            image: image.to_string(),
            attributes,
            carbon_offset: self.carbon_offset_per_nft,
            minted_at: js_sys::Date::now(),
            creator: to.to_string(),
        };

        self.tokens.insert(token_id, metadata);
        self.owners.insert(token_id, to.to_string());

        console_log!("Minted NFT #{} to {} with {}g CO2 offset", 
                    token_id, to, self.carbon_offset_per_nft);
        token_id
    }

    #[wasm_bindgen]
    pub fn transfer(&mut self, from: &str, to: &str, token_id: u64) -> bool {
        if !self.is_approved_or_owner(from, token_id) {
            console_log!("Transfer failed: Not approved or owner");
            return false;
        }

        self.owners.insert(token_id, to.to_string());
        self.approved.remove(&token_id); // Clear approval

        console_log!("Transferred NFT #{} from {} to {}", token_id, from, to);
        true
    }

    #[wasm_bindgen]
    pub fn approve(&mut self, owner: &str, approved: &str, token_id: u64) -> bool {
        if self.owner_of(token_id) != Some(owner.to_string()) {
            console_log!("Approve failed: Not the owner");
            return false;
        }

        self.approved.insert(token_id, approved.to_string());
        console_log!("Approved {} for NFT #{}", approved, token_id);
        true
    }

    #[wasm_bindgen]
    pub fn set_approval_for_all(&mut self, owner: &str, operator: &str, approved: bool) {
        if !self.operator_approvals.contains_key(owner) {
            self.operator_approvals.insert(owner.to_string(), HashMap::new());
        }

        if let Some(owner_approvals) = self.operator_approvals.get_mut(owner) {
            owner_approvals.insert(operator.to_string(), approved);
        }

        console_log!("Set approval for all: {} -> {} = {}", owner, operator, approved);
    }

    #[wasm_bindgen]
    pub fn owner_of(&self, token_id: u64) -> Option<String> {
        self.owners.get(&token_id).cloned()
    }

    #[wasm_bindgen]
    pub fn get_approved(&self, token_id: u64) -> Option<String> {
        self.approved.get(&token_id).cloned()
    }

    #[wasm_bindgen]
    pub fn is_approved_for_all(&self, owner: &str, operator: &str) -> bool {
        self.operator_approvals
            .get(owner)
            .and_then(|approvals| approvals.get(operator))
            .copied()
            .unwrap_or(false)
    }

    fn is_approved_or_owner(&self, spender: &str, token_id: u64) -> bool {
        if let Some(owner) = self.owner_of(token_id) {
            return spender == owner ||
                   self.get_approved(token_id) == Some(spender.to_string()) ||
                   self.is_approved_for_all(&owner, spender);
        }
        false
    }

    #[wasm_bindgen]
    pub fn token_metadata(&self, token_id: u64) -> JsValue {
        if let Some(metadata) = self.tokens.get(&token_id) {
            serde_wasm_bindgen::to_value(metadata).unwrap()
        } else {
            JsValue::NULL
        }
    }

    #[wasm_bindgen]
    pub fn total_carbon_offset(&self) -> u64 {
        self.tokens.values().map(|nft| nft.carbon_offset).sum()
    }

    #[wasm_bindgen]
    pub fn tokens_by_owner(&self, owner: &str) -> Vec<u64> {
        self.owners
            .iter()
            .filter(|(_, token_owner)| *token_owner == owner)
            .map(|(token_id, _)| *token_id)
            .collect()
    }

    #[wasm_bindgen]
    pub fn get_collection_stats(&self) -> JsValue {
        let stats = CollectionStats {
            total_nfts: self.tokens.len(),
            total_carbon_offset: self.total_carbon_offset(),
            unique_owners: self.owners.values().collect::<std::collections::HashSet<_>>().len(),
            next_token_id: self.next_token_id,
        };

        serde_wasm_bindgen::to_value(&stats).unwrap()
    }
}

#[derive(Serialize, Deserialize)]
struct CollectionStats {
    total_nfts: usize,
    total_carbon_offset: u64,
    unique_owners: usize,
    next_token_id: u64,
}