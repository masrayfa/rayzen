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
    async fn list_workspace(
        &self,
        ctx: ContextRouter,
        organization_id: i32,
    ) -> Result<Vec<WorkspaceDto>, String>;
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
        let workspace = self
            .workspace_repository
            .create_workspace(&ctx.db, dto.into())
            .await
            .map_err(|e| e.to_string())?;

        Ok(workspace.into())
    }

    async fn get_workspace_by_id(
        &self,
        ctx: ContextRouter,
        id: i32,
    ) -> Result<WorkspaceDto, String> {
        let workspace = self
            .workspace_repository
            .get_workspace_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(workspace.into())
    }

    async fn update_workspace(
        &self,
        ctx: ContextRouter,
        dto: UpdateWorkspaceDto,
    ) -> Result<WorkspaceDto, String> {
        if dto.id.is_none() {
            return Err("Organization ID is required for update".to_string());
        }

        let id = dto.id.unwrap();

        let updated_workspace = self
            .workspace_repository
            .update_workspace(&ctx.db, id, dto.into())
            .await
            .map_err(|e| e.to_string())?;

        Ok(updated_workspace.into())
    }

    async fn delete_workspace(&self, ctx: ContextRouter, id: i32) -> Result<(), String> {
        let _deleted_workspace = self
            .workspace_repository
            .delete_workspace(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    async fn list_workspace(
        &self,
        ctx: ContextRouter,
        organization_id: i32,
    ) -> Result<Vec<WorkspaceDto>, String> {
        let workspaces = self
            .workspace_repository
            .list_workspace(&ctx.db, organization_id)
            .await
            .map_err(|e| e.to_string())?;

        println!("Workspaces found: {:?}", workspaces);

        Ok(workspaces.into_iter().map(Into::into).collect())
    }
}
