use entity::{
    groups::{self, ActiveModel as GroupsActiveModel, Entity as Groups},
    workspace,
};

use async_trait::async_trait;

use sea_orm::{
    ActiveValue::Set, ColumnTrait, Condition, DatabaseConnection, DbErr, EntityTrait, QueryFilter,
};

#[async_trait]
pub trait GroupRepository: Send + Sync {
    async fn create_group(
        &self,
        db: &DatabaseConnection,
        input: GroupsActiveModel,
    ) -> Result<groups::Model, DbErr>;
    async fn get_group_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<groups::Model, DbErr>;
    async fn update_group(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: GroupsActiveModel,
    ) -> Result<groups::Model, DbErr>;
    async fn delete_group(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr>;
    async fn list_groups(&self, db: &DatabaseConnection) -> Result<Vec<groups::Model>, DbErr>;
    async fn find_by_workspace_id(
        &self,
        db: &DatabaseConnection,
        workspace_id: i32,
    ) -> Result<Vec<groups::Model>, DbErr>;
    async fn find_belonged_groups(
        &self,
        db: &DatabaseConnection,
        workspace_id: i32,
        organization_id: i32,
    ) -> Result<Vec<groups::Model>, DbErr>;
}

pub struct GroupRepositoryImpl {}

impl GroupRepositoryImpl {
    pub fn new() -> Self {
        GroupRepositoryImpl {}
    }
}

#[async_trait]
impl GroupRepository for GroupRepositoryImpl {
    async fn create_group(
        &self,
        db: &DatabaseConnection,
        input: GroupsActiveModel,
    ) -> Result<groups::Model, DbErr> {
        let groups_active_model: GroupsActiveModel = input.into();

        let result = Groups::insert(groups_active_model)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;

        let groups_model = Groups::find_by_id(result.last_insert_id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Group not found".to_string()))?;

        // Convert the model to DTO
        Ok(groups_model)
    }

    async fn get_group_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<groups::Model, DbErr> {
        let group: Option<groups::Model> = Groups::find_by_id(id)
            .one(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;

        group.ok_or(DbErr::RecordNotFound("Group not found".to_string()))
    }

    async fn update_group(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: GroupsActiveModel,
    ) -> Result<groups::Model, DbErr> {
        // Fetch the existing group to update
        let existing_group = Groups::find_by_id(id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Group not found".to_string()))?;

        let groups_active_model: GroupsActiveModel = existing_group.into();

        let updated_groups = GroupsActiveModel {
            id: Set(input.id.unwrap()),
            name: Set(input.name.unwrap()),
            workspace_id: Set(input.workspace_id.unwrap()),
            ..groups_active_model
        };

        let updated_groups = Groups::update(updated_groups)
            .filter(groups::Column::Id.eq(id))
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;

        let groups_model = Groups::find_by_id(updated_groups.id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Updated group not found".to_string()))?;

        // Convert the model to DTO
        Ok(groups_model)
    }

    async fn delete_group(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
        Groups::delete_by_id(id)
            .exec(db)
            .await
            .map_err(|e| e.to_string());
        Ok(())
    }

    async fn list_groups(&self, db: &DatabaseConnection) -> Result<Vec<groups::Model>, DbErr> {
        let groups: Vec<groups::Model> = Groups::find()
            .all(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;

        Ok(groups)
    }

    async fn find_by_workspace_id(
        &self,
        db: &DatabaseConnection,
        workspace_id: i32,
    ) -> Result<Vec<groups::Model>, DbErr> {
        println!(
            "🔍 Searching active groups with workspace_id: {}",
            workspace_id
        );

        // Debug: Check all groups in workspace (including deleted)
        let all_groups_in_workspace = Groups::find()
            .filter(groups::Column::WorkspaceId.eq(workspace_id))
            .all(db)
            .await?;

        println!(
            "📊 All groups in workspace {}: {}",
            workspace_id,
            all_groups_in_workspace.len()
        );

        let active_groups = Groups::find()
            .filter(groups::Column::WorkspaceId.eq(workspace_id))
            .all(db)
            .await
            .map_err(|e| {
                println!("❌ Query error: {}", e);
                DbErr::Custom(e.to_string())
            })?;

        println!("✅ Active groups found: {}", active_groups.len());

        Ok(active_groups)
    }

    async fn find_belonged_groups(
        &self,
        db: &DatabaseConnection,
        workspace_id: i32,
        organization_id: i32,
    ) -> Result<Vec<groups::Model>, DbErr> {
        println!(
            "🔍 Searching active groups with workspace_id: {} and organization_id: {}",
            workspace_id, organization_id,
        );

        // Query dengan join ke tabel workspaces untuk memfilter berdasarkan organization_id
        let active_groups = Groups::find()
            .inner_join(workspace::Entity)
            .filter(
                Condition::all()
                    .add(groups::Column::WorkspaceId.eq(workspace_id))
                    .add(workspace::Column::OrganizationId.eq(organization_id)),
            )
            .all(db)
            .await
            .map_err(|e| {
                println!("❌ Query error: {}", e);
                DbErr::Custom(e.to_string())
            })?;

        println!("✅ Active groups found: {}", active_groups.len());

        Ok(active_groups)
    }
}
