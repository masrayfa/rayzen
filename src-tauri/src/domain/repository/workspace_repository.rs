use crate::domain::dto::workspace::workspace_dto::WorkspaceDto;

use async_trait::async_trait;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

#[async_trait]
pub trait WorkspaceRepository: Send + Sync {
    async fn create_organization(
        &self,
        db: &DatabaseConnection,
        workspace: WorkspaceDto,
    ) -> Result<WorkspaceDto, String>;
    async fn get_organization_by_id(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
    ) -> Result<WorkspaceDto, String>;
    async fn update_organization(
        &self,
        db: &DatabaseConnection,
        workspace: WorkspaceDto,
    ) -> Result<WorkspaceDto, String>;
    async fn delete_organization(&self, db: &DatabaseConnection, id: Uuid) -> Result<(), String>;
    async fn list_organization(&self, db: &DatabaseConnection)
        -> Result<Vec<WorkspaceDto>, String>;
}

pub struct WorkspaceRepositoryImpl {}

impl WorkspaceRepositoryImpl {
    pub fn new() -> Self {
        WorkspaceRepositoryImpl {}
    }
}

#[async_trait]
impl WorkspaceRepository for WorkspaceRepositoryImpl {
    async fn create_organization(
        &self,
        db: &DatabaseConnection,
        workspace: WorkspaceDto,
    ) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn get_organization_by_id(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
    ) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn update_organization(
        &self,
        db: &DatabaseConnection,
        workspace: WorkspaceDto,
    ) -> Result<WorkspaceDto, String> {
        todo!()
    }

    async fn delete_organization(&self, db: &DatabaseConnection, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_organization(
        &self,
        db: &DatabaseConnection,
    ) -> Result<Vec<WorkspaceDto>, String> {
        todo!()
    }
}
