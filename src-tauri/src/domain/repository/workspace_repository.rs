use crate::domain::dto::workspace::workspace_dto::WorkspaceDto;

use async_trait::async_trait;
use entity::workspace::{
    self, ActiveModel as WorkspaceActiveModel, Entity as Workspace, Model as WorkspaceModel,
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

#[async_trait]
pub trait WorkspaceRepository: Send + Sync {
    async fn create_workspace(
        &self,
        db: &DatabaseConnection,
        input: WorkspaceActiveModel,
    ) -> Result<WorkspaceModel, DbErr>;
    async fn get_workspace_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<WorkspaceModel, DbErr>;
    async fn update_workspace(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: WorkspaceActiveModel,
    ) -> Result<WorkspaceModel, DbErr>;
    async fn delete_workspace(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr>;
    async fn list_workspace(&self, db: &DatabaseConnection) -> Result<Vec<WorkspaceModel>, DbErr>;
}

pub struct WorkspaceRepositoryImpl {}

impl WorkspaceRepositoryImpl {
    pub fn new() -> Self {
        WorkspaceRepositoryImpl {}
    }
}

#[async_trait]
impl WorkspaceRepository for WorkspaceRepositoryImpl {
    async fn create_workspace(
        &self,
        db: &DatabaseConnection,
        input: WorkspaceActiveModel,
    ) -> Result<WorkspaceModel, DbErr> {
        let result = Workspace::insert(input)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        let organization_model = Workspace::find_by_id(result.last_insert_id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Organization not found".to_string()))?;
        Ok(organization_model)
    }

    async fn get_workspace_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<WorkspaceModel, DbErr> {
        let result = Workspace::find_by_id(id)
            .one(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;

        result.ok_or(DbErr::RecordNotFound("Workspace not found".to_string()))
    }

    async fn update_workspace(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: WorkspaceActiveModel,
    ) -> Result<WorkspaceModel, DbErr> {
        let existing_workspace = Workspace::find_by_id(id).one(db).await?;

        let existing_workspace_active_model: WorkspaceActiveModel =
            existing_workspace.unwrap().into();

        let updated_workspace = WorkspaceActiveModel {
            name: input.name,
            ..existing_workspace_active_model
        };

        // 2nd Version
        // let updated_bookmark: BookmarkModel =
        //     BookmarkActiveModel::update(updated_bookmark, db).await?;
        let updated_workspace: WorkspaceModel =
            Workspace::update(updated_workspace).exec(db).await?;

        println!("Bookmarkupdated: {:?}", updated_workspace);
        Ok(updated_workspace)
    }

    async fn delete_workspace(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
        Workspace::delete_by_id(id)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()));
        Ok(())
    }

    async fn list_workspace(&self, db: &DatabaseConnection) -> Result<Vec<WorkspaceModel>, DbErr> {
        let workspaces: Vec<WorkspaceModel> = Workspace::find()
            .all(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;

        Ok(workspaces)
    }
}
