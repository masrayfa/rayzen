use crate::domain::entities::workspace::Workspace;

use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait WorkspaceService: Send + Sync {
    async fn create_organization(&self, workspace: Workspace) -> Result<Workspace, String>;
    async fn get_organization_by_id(&self, id: Uuid) -> Result<Workspace, String>;
    async fn update_organization(&self, workspace: Workspace) -> Result<Workspace, String>;
    async fn delete_organization(&self, id: Uuid) -> Result<(), String>;
    async fn list_organization(&self) -> Result<Vec<Workspace>, String>;
}

pub struct WorkspaceServiceImpl {}

impl WorkspaceServiceImpl {
    pub fn new() -> Self {
        WorkspaceServiceImpl {}
    }
}

#[async_trait]
impl WorkspaceService for WorkspaceServiceImpl {
    async fn create_organization(&self, workspace: Workspace) -> Result<Workspace, String> {
        todo!()
    }

    async fn get_organization_by_id(&self, id: Uuid) -> Result<Workspace, String> {
        todo!()
    }

    async fn update_organization(&self, workspace: Workspace) -> Result<Workspace, String> {
        todo!()
    }

    async fn delete_organization(&self, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_organization(&self) -> Result<Vec<Workspace>, String> {
        todo!()
    }
}
