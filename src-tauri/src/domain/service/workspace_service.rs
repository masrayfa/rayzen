use crate::domain::dto::workspace::workspace_dto::WorkspaceDto;

use async_trait::async_trait;

#[async_trait]
pub trait WorkspaceService: Send + Sync {
    async fn create_organization(&self, workspace: WorkspaceDto) -> Result<WorkspaceDto, String>;
    async fn get_organization_by_id(&self, id: i32) -> Result<WorkspaceDto, String>;
    async fn update_organization(&self, workspace: WorkspaceDto) -> Result<WorkspaceDto, String>;
    async fn delete_organization(&self, id: i32) -> Result<(), String>;
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

    async fn get_organization_by_id(&self, id: i32) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn update_organization(&self, workspace: WorkspaceDto) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn delete_organization(&self, id: i32) -> Result<(), String> {
        todo!()
    }

    async fn list_organization(&self) -> Result<Vec<WorkspaceDto>, String> {
        todo!()
    }
}
