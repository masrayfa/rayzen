mod db;
mod domain;

use domain::router;
use std::sync::{Arc, Mutex};

use rspc_tauri;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    // Initialize the database connection
    let database_uri =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set in the environment");
    let db = db::establish_connection(&database_uri)
        .await
        .expect("Failed to establish database connection");
    let db = Arc::new(db);

    // Create the router context with the database connection
    let router = router::create_router();

    tauri::Builder::default()
        .plugin(rspc_tauri::plugin(router.arced(), move |_app_handle| {
            router::ContextRouter::new(Arc::clone(&db))
        }))
        .run(tauri::generate_context!())
        .expect("Error while running Tauri App");
}
