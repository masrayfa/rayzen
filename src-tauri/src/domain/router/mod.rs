pub mod bookmark_router;
pub mod groups_router;
pub mod organization_router;
pub mod user;
pub mod workspace_router;

use crate::domain::service::{
    bookmark_service::{BookmarkService, BookmarkServiceImpl},
    group_service::{GroupService, GroupsServiceImpl},
    organization_service::{OrganizationSeriviceImpl, OrganizationService},
    workspace_service::{WorkspaceService, WorkspaceServiceImpl},
};

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
    pub bookmark_service: Arc<dyn BookmarkService>,
    pub group_service: Arc<dyn GroupService>,
    pub organization_service: Arc<dyn OrganizationService>,
    pub workspace_service: Arc<dyn WorkspaceService>,
}

impl ContextRouter {
    pub fn new() -> Self {
        Self {
            session_id: None,
            message: Arc::new(Mutex::new("Hello World".to_string())),
            bookmark_service: Arc::new(BookmarkServiceImpl::new()),
            group_service: Arc::new(GroupsServiceImpl::new()),
            organization_service: Arc::new(OrganizationSeriviceImpl::new()),
            workspace_service: Arc::new(WorkspaceServiceImpl::new()),
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
