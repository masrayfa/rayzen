use std::sync::Arc;

use crate::domain::{
    dto::workspace::workspace_dto::{CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceDto},
    repository::workspace_repository::WorkspaceRepository,
    router::ContextRouter,
};

use async_trait::async_trait;

#[async_trait]
pub trait WorkspaceService: Send + Sync {
    async fn create_workspace(
        &self,
        ctx: ContextRouter,
        dto: CreateWorkspaceDto,
    ) -> Result<WorkspaceDto, String>;
    async fn get_workspace_by_id(
        &self,
        ctx: ContextRouter,
        id: i32,
    ) -> Result<WorkspaceDto, String>;
    async fn update_workspace(
        &self,
        ctx: ContextRouter,
        dto: UpdateWorkspaceDto,
    ) -> Result<WorkspaceDto, String>;
    async fn delete_workspace(&self, ctx: ContextRouter, id: i32) -> Result<(), String>;
    async fn list_workspace(&self, ctx: ContextRouter) -> Result<Vec<WorkspaceDto>, String>;
}

pub struct WorkspaceServiceImpl {
    pub workspace_repository: Arc<dyn WorkspaceRepository>,
}

impl WorkspaceServiceImpl {
    pub fn new(workspace_repository: Arc<dyn WorkspaceRepository>) -> Self {
        WorkspaceServiceImpl {
            workspace_repository,
        }
    }
}

#[async_trait]
impl WorkspaceService for WorkspaceServiceImpl {
    async fn create_workspace(
        &self,
        ctx: ContextRouter,
        dto: CreateWorkspaceDto,
    ) -> Result<WorkspaceDto, String> {
        self.workspace_repository.create_organization(db, workspace)
    }

    async fn get_workspace_by_id(
        &self,
        ctx: ContextRouter,
        id: i32,
    ) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn update_workspace(
        &self,
        ctx: ContextRouter,
        workspace: UpdateWorkspaceDto,
    ) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn delete_workspace(&self, ctx: ContextRouter, id: i32) -> Result<(), String> {
        todo!()
    }

    async fn list_workspace(&self, ctx: ContextRouter) -> Result<Vec<WorkspaceDto>, String> {
        todo!()
    }
}
