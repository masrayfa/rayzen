use crate::domain::entities::workspace::Workspace;

use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait WorkspaceRepository: Send + Sync {
    async fn create_organization(&self, workspace: Workspace) -> Result<Workspace, String>;
    async fn get_organization_by_id(&self, id: Uuid) -> Result<Workspace, String>;
    async fn update_organization(&self, workspace: Workspace) -> Result<Workspace, String>;
    async fn delete_organization(&self, id: Uuid) -> Result<(), String>;
    async fn list_organization(&self) -> Result<Vec<Workspace>, String>;
}

pub struct WorkspaceRepositoryImpl {}

impl WorkspaceRepositoryImpl {
    pub fn new() -> Self {
        WorkspaceRepositoryImpl {}
    }
}

#[async_trait]
impl WorkspaceRepository for WorkspaceRepositoryImpl {
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
