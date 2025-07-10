mod domain;

use domain::router;
use std::sync::{Arc, Mutex};

use rspc_tauri;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let router = router::create_router();

    tauri::Builder::default()
        .plugin(rspc_tauri::plugin(router.arced(), move |_app_handle| {
            router::ContextRouter::new()
        }))
        .run(tauri::generate_context!())
        .expect("Error while running Tauri App");
}
