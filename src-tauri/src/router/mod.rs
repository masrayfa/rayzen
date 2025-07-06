pub mod user;

use std::{
    env,
    path::PathBuf,
    sync::{Arc, Mutex},
};

use rspc::{Config, Router};
use tauri::webview::Cookie;

pub struct ContextRouter {
    // db: Arc<PrismaClient>,
    pub session_id: Option<String>,
    // cookie: Cookie,
    pub message: Arc<Mutex<String>>,
}

pub fn create_router() -> Router<ContextRouter> {
    let users_router = user::create_users_router();

    let binding_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../src/types/binding.ts");
    println!(
        "TypeScript bindings will be exported to: {:?}",
        binding_path
    );

    let config = if cfg!(debug_assertions) {
        // Export bindings only in development
        Config::new()
            .set_ts_bindings_header("/* eslint-disable */")
            .export_ts_bindings(binding_path)
    } else {
        Config::new()
    };

    Router::<ContextRouter>::new()
        .config(config)
        .query("version", |t| t(|_ctx, _: ()| "1.0.0"))
        .merge("users.", users_router)
        .build()
}
