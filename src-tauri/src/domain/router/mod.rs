pub mod bookmark_router;
pub mod groups_router;
pub mod organization_router;
pub mod user;
pub mod workspace_router;

use crate::domain::service::{
    bookmark_service::{BookmarkService, BookmarkServiceImpl},
    group_service::{GroupService, GroupsServiceImpl},
    organization_service::OrganizationService,
    workspace_service::{WorkspaceService, WorkspaceServiceImpl},
};

use std::{
    env,
    path::PathBuf,
    sync::{Arc, Mutex},
};

use rspc::{Config, Router};
use sea_orm::DatabaseConnection;
use tauri::webview::Cookie;

pub struct ContextRouter {
    pub db: Arc<DatabaseConnection>,
    pub session_id: Option<String>,
    pub message: Arc<Mutex<String>>,
}

impl ContextRouter {
    pub fn new(db: Arc<DatabaseConnection>) -> Self {
        Self {
            db: db.clone(),
            session_id: None,
            message: Arc::new(Mutex::new("Hello World".to_string())),
        }
    }
}

pub fn create_router() -> Router<ContextRouter> {
    let users_router = user::create_users_router();
    let organization_router = organization_router::create_organization_router();
    let workspace_router = workspace_router::create_workspace_router();
    let bookmark_router = bookmark_router::create_bookmark_router();
    let groups_router = groups_router::create_groups_router();

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
        .merge("organization.", organization_router)
        .merge("workspace.", workspace_router)
        .merge("bookmark.", bookmark_router)
        .merge("groups.", groups_router)
        .build()
}
