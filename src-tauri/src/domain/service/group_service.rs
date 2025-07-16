use crate::domain::dto::groups::groups_dto::GroupsDto;

use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait GroupService: Send + Sync {
    async fn create_group(&self, group: GroupsDto) -> Result<GroupsDto, String>;
    async fn get_group_by_id(&self, id: i32) -> Result<GroupsDto, String>;
    async fn update_group(&self, group: GroupsDto) -> Result<GroupsDto, String>;
    async fn delete_group(&self, id: i32) -> Result<(), String>;
    async fn list_groups(&self) -> Result<Vec<GroupsDto>, String>;
}

pub struct GroupsServiceImpl {}

impl GroupsServiceImpl {
    pub fn new() -> Self {
        GroupsServiceImpl {}
    }
}

#[async_trait]
impl GroupService for GroupsServiceImpl {
    async fn create_group(&self, group: GroupsDto) -> Result<GroupsDto, String> {
        todo!()
    }

    async fn get_group_by_id(&self, id: i32) -> Result<GroupsDto, String> {
        todo!()
    }

    async fn update_group(&self, group: GroupsDto) -> Result<GroupsDto, String> {
        todo!()
    }

    async fn delete_group(&self, id: i32) -> Result<(), String> {
        todo!()
    }

    async fn list_groups(&self) -> Result<Vec<GroupsDto>, String> {
        todo!()
    }
}
