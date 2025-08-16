use std::sync::Arc;

use crate::domain::{
    dto::groups::groups_dto::{CreateGroupsDto, GroupsDto, UpdateGroupsDto},
    repository::groups_repository::{self, GroupRepository},
    router::ContextRouter,
};

use async_trait::async_trait;
use entity::groups;

pub struct GroupsServiceImpl {
    pub groups_repository: Arc<dyn GroupRepository>,
}

impl GroupsServiceImpl {
    pub fn new(groups_repository: Arc<dyn GroupRepository>) -> Self {
        GroupsServiceImpl {
            groups_repository: groups_repository,
        }
    }
}

#[async_trait]
pub trait GroupService: Send + Sync {
    async fn create_group(
        &self,
        ctx: ContextRouter,
        dto: CreateGroupsDto,
    ) -> Result<GroupsDto, String>;
    async fn get_group_by_id(&self, ctx: ContextRouter, id: i32) -> Result<GroupsDto, String>;
    async fn update_group(
        &self,
        ctx: ContextRouter,
        group: UpdateGroupsDto,
    ) -> Result<GroupsDto, String>;
    async fn delete_group(&self, ctx: ContextRouter, id: i32) -> Result<(), String>;
    async fn list_groups(&self, ctx: ContextRouter) -> Result<Vec<GroupsDto>, String>;
    async fn list_belonged_groups(
        &self,
        ctx: ContextRouter,
        workspace_id: i32,
    ) -> Result<Vec<GroupsDto>, String>;
}

#[async_trait]
impl GroupService for GroupsServiceImpl {
    async fn list_groups(&self, ctx: ContextRouter) -> Result<Vec<GroupsDto>, String> {
        let list_of_groups = self
            .groups_repository
            .list_groups(&ctx.db)
            .await
            .map_err(|e| e.to_string())?;

        Ok(list_of_groups.into_iter().map(Into::into).collect())
    }

    async fn list_belonged_groups(
        &self,
        ctx: ContextRouter,
        workspace_id: i32,
    ) -> Result<Vec<GroupsDto>, String> {
        let belonged_groups = self
            .groups_repository
            .find_by_workspace_id(&ctx.db, workspace_id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(belonged_groups.into_iter().map(Into::into).collect())
    }

    async fn get_group_by_id(&self, ctx: ContextRouter, id: i32) -> Result<GroupsDto, String> {
        let group = self
            .groups_repository
            .get_group_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(group.into())
    }

    async fn create_group(
        &self,
        ctx: ContextRouter,
        dto: CreateGroupsDto,
    ) -> Result<GroupsDto, String> {
        let created_group = self
            .groups_repository
            .create_group(&ctx.db, dto.into())
            .await
            .map_err(|e| e.to_string())?;

        Ok(created_group.into())
    }

    async fn update_group(
        &self,
        ctx: ContextRouter,
        dto: UpdateGroupsDto,
    ) -> Result<GroupsDto, String> {
        if dto.id.is_none() {
            return Err("Group ID is required for update".to_string());
        }

        // log all received data
        println!("Received update group data: {:?}", dto);

        let id = dto.id.unwrap();

        // Verify group exists (optional, but good practice)
        let _found_group = self
            .groups_repository
            .get_group_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        // Use DTO data directly for update
        let updated_group = self
            .groups_repository
            .update_group(&ctx.db, id, dto.into())
            .await
            .map_err(|e| e.to_string())?;

        println!("Updated group: {:?}", updated_group);

        Ok(updated_group.into())
    }

    async fn delete_group(&self, ctx: ContextRouter, id: i32) -> Result<(), String> {
        let deleted_group = self
            .groups_repository
            .delete_group(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }
}
