use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::console_log;

#[wasm_bindgen]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct P2PNetwork {
    pub node_id: String,
    pub peers: HashMap<String, PeerConnection>,
    pub max_peers: usize,
    pub is_bootstrapping: bool,
    pub bootstrap_peers: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PeerConnection {
    pub peer_id: String,
    pub websocket: Option<String>, // WebSocket URL
    pub last_seen: f64,
    pub reputation: f64,
    pub is_validator: bool,
}

#[wasm_bindgen]
impl P2PNetwork {
    #[wasm_bindgen(constructor)]
    pub fn new(node_id: &str) -> P2PNetwork {
        P2PNetwork {
            node_id: node_id.to_string(),
            peers: HashMap::new(),
            max_peers: 50,
            is_bootstrapping: false,
            bootstrap_peers: vec![
                "wss://bitnun-bootstrap-1.replit.app/ws".to_string(),
                "wss://bitnun-bootstrap-2.replit.app/ws".to_string(),
            ],
        }
    }

    #[wasm_bindgen]
    pub fn start_networking(&mut self) {
        console_log!("Starting P2P networking for node: {}", self.node_id);
        self.is_bootstrapping = true;
        
        // In a real implementation, this would connect to bootstrap nodes
        // For now, we'll simulate a successful bootstrap
        self.simulate_bootstrap();
    }

    #[wasm_bindgen]
    pub fn connect_to_peer(&mut self, peer_url: &str, peer_id: &str) -> bool {
        if self.peers.len() >= self.max_peers {
            console_log!("Max peers reached, rejecting connection to {}", peer_id);
            return false;
        }

        let peer = PeerConnection {
            peer_id: peer_id.to_string(),
            websocket: Some(peer_url.to_string()),
            last_seen: js_sys::Date::now(),
            reputation: 1.0,
            is_validator: false,
        };

        self.peers.insert(peer_id.to_string(), peer);
        console_log!("Connected to peer: {} at {}", peer_id, peer_url);
        
        // Send handshake message
        self.send_handshake(peer_id);
        true
    }

    #[wasm_bindgen]
    pub fn broadcast_message(&self, message_type: &str, data: &str) {
        let message = NetworkMessage {
            message_type: message_type.to_string(),
            from: self.node_id.clone(),
            to: "broadcast".to_string(),
            data: data.to_string(),
            timestamp: js_sys::Date::now(),
        };

        console_log!("Broadcasting {} message to {} peers", message_type, self.peers.len());
        
        // In a real implementation, this would send to all connected WebSockets
        for (peer_id, _) in &self.peers {
            self.send_message_to_peer(peer_id, &message);
        }
    }

    #[wasm_bindgen]
    pub fn send_transaction(&self, transaction_data: &str) {
        self.broadcast_message("transaction", transaction_data);
    }

    #[wasm_bindgen]
    pub fn send_block(&self, block_data: &str) {
        self.broadcast_message("block", block_data);
    }

    #[wasm_bindgen]
    pub fn request_sync(&self) {
        self.broadcast_message("sync_request", &self.node_id);
    }

    fn send_handshake(&self, peer_id: &str) {
        let handshake = HandshakeMessage {
            node_id: self.node_id.clone(),
            version: "1.0.0".to_string(),
            capabilities: vec![
                "proof_of_action".to_string(),
                "smart_contracts".to_string(),
                "nft_support".to_string(),
            ],
            best_block: 0, // Would be actual best block height
        };

        let data = serde_json::to_string(&handshake).unwrap_or_default();
        let message = NetworkMessage {
            message_type: "handshake".to_string(),
            from: self.node_id.clone(),
            to: peer_id.to_string(),
            data,
            timestamp: js_sys::Date::now(),
        };

        self.send_message_to_peer(peer_id, &message);
    }

    fn send_message_to_peer(&self, peer_id: &str, message: &NetworkMessage) {
        // In a real implementation, this would use WebSocket API
        console_log!("Sending {} message to peer {}", message.message_type, peer_id);
        
        // Simulate message sending
        if let Some(peer) = self.peers.get(peer_id) {
            if peer.websocket.is_some() {
                // Would actually send via WebSocket here
                console_log!("Message sent successfully to {}", peer_id);
            }
        }
    }

    fn simulate_bootstrap(&mut self) {
        // Simulate successful bootstrap with mock peers
        for i in 0..5 {
            let peer_id = format!("peer_{}", i);
            let peer = PeerConnection {
                peer_id: peer_id.clone(),
                websocket: Some(format!("wss://peer-{}.bitnun.network/ws", i)),
                last_seen: js_sys::Date::now(),
                reputation: 0.8 + (i as f64 * 0.05),
                is_validator: i < 3, // First 3 peers are validators
            };
            
            self.peers.insert(peer_id, peer);
        }

        self.is_bootstrapping = false;
        console_log!("Bootstrap completed with {} peers", self.peers.len());
    }

    #[wasm_bindgen]
    pub fn get_network_stats(&self) -> JsValue {
        let stats = NetworkStats {
            node_id: self.node_id.clone(),
            connected_peers: self.peers.len(),
            validator_peers: self.peers.values().filter(|p| p.is_validator).count(),
            is_bootstrapping: self.is_bootstrapping,
            average_reputation: if !self.peers.is_empty() {
                self.peers.values().map(|p| p.reputation).sum::<f64>() / self.peers.len() as f64
            } else {
                0.0
            },
        };

        serde_wasm_bindgen::to_value(&stats).unwrap()
    }
}

#[derive(Serialize, Deserialize)]
struct NetworkMessage {
    message_type: String,
    from: String,
    to: String,
    data: String,
    timestamp: f64,
}

#[derive(Serialize, Deserialize)]
struct HandshakeMessage {
    node_id: String,
    version: String,
    capabilities: Vec<String>,
    best_block: u64,
}

#[derive(Serialize, Deserialize)]
struct NetworkStats {
    node_id: String,
    connected_peers: usize,
    validator_peers: usize,
    is_bootstrapping: bool,
    average_reputation: f64,
}