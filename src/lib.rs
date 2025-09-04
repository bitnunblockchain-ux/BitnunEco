use wasm_bindgen::prelude::*;
use web_sys::console;

mod blockchain;
mod consensus;
mod contracts;
mod network;
mod ai;

pub use blockchain::*;
pub use consensus::*;
pub use contracts::*;
pub use network::*;
pub use ai::*;

// Main WASM entry point
#[wasm_bindgen(start)]
pub fn main() {
    console::log_1(&"Bitnun WASM Node initialized".into());
}

// Panic hook for better error messages
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn error(msg: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (web_sys::console::log_1(&format!($($t)*).into()))
}

pub(crate) use console_log;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;