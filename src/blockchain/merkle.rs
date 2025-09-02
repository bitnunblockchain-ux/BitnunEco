use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MerkleTree {
    pub root: String,
    pub leaves: Vec<String>,
}

impl MerkleTree {
    pub fn new(data: Vec<String>) -> Self {
        let root = Self::calculate_root(&data);
        MerkleTree {
            root,
            leaves: data,
        }
    }

    fn calculate_root(data: &[String]) -> String {
        if data.is_empty() {
            return "0".to_string();
        }

        let mut hashes: Vec<String> = data
            .iter()
            .map(|item| {
                let mut hasher = Sha256::new();
                hasher.update(item.as_bytes());
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

    pub fn verify_proof(&self, leaf: &str, proof: &[String]) -> bool {
        let mut hash = {
            let mut hasher = Sha256::new();
            hasher.update(leaf.as_bytes());
            format!("{:x}", hasher.finalize())
        };

        for proof_element in proof {
            let mut hasher = Sha256::new();
            hasher.update(format!("{}{}", hash, proof_element).as_bytes());
            hash = format!("{:x}", hasher.finalize());
        }

        hash == self.root
    }
}