use crate::domain::dto::workspace::workspace_dto::WorkspaceDto;

use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait WorkspaceService: Send + Sync {
    async fn create_organization(&self, workspace: WorkspaceDto) -> Result<WorkspaceDto, String>;
    async fn get_organization_by_id(&self, id: Uuid) -> Result<WorkspaceDto, String>;
    async fn update_organization(&self, workspace: WorkspaceDto) -> Result<WorkspaceDto, String>;
    async fn delete_organization(&self, id: Uuid) -> Result<(), String>;
    async fn list_organization(&self) -> Result<Vec<WorkspaceDto>, String>;
}

pub struct WorkspaceServiceImpl {}

impl WorkspaceServiceImpl {
    pub fn new() -> Self {
        WorkspaceServiceImpl {}
    }
}

#[async_trait]
impl WorkspaceService for WorkspaceServiceImpl {
    async fn create_organization(&self, workspace: WorkspaceDto) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn get_organization_by_id(&self, id: Uuid) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn update_organization(&self, workspace: WorkspaceDto) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn delete_organization(&self, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_organization(&self) -> Result<Vec<WorkspaceDto>, String> {
        todo!()
    }
}
