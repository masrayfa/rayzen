mod router;

use std::sync::{Arc, Mutex};

use rspc_tauri;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let router = router::create_router();

    tauri::Builder::default()
        .plugin(rspc_tauri::plugin(router.arced(), move |_app_handle| {
            router::ContextRouter {
                session_id: None,
                message: Arc::new(Mutex::new("Hello World".to_string())),
            }
        }))
        .run(tauri::generate_context!())
        .expect("Error while running Tauri App");
}
