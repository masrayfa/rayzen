use crate::domain::entities::groups::Groups;

use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait GroupService: Send + Sync {
    async fn create_group(&self, group: Groups) -> Result<Groups, String>;
    async fn get_group_by_id(&self, id: Uuid) -> Result<Groups, String>;
    async fn update_group(&self, group: Groups) -> Result<Groups, String>;
    async fn delete_group(&self, id: uuid::Uuid) -> Result<(), String>;
    async fn list_groups(&self) -> Result<Vec<Groups>, String>;
}

pub struct GroupsServiceImpl {}

impl GroupsServiceImpl {
    pub fn new() -> Self {
        GroupsServiceImpl {}
    }
}

#[async_trait]
impl GroupService for GroupsServiceImpl {
    async fn create_group(&self, group: Groups) -> Result<Groups, String> {
        todo!()
    }

    async fn get_group_by_id(&self, id: Uuid) -> Result<Groups, String> {
        todo!()
    }

    async fn update_group(&self, group: Groups) -> Result<Groups, String> {
        todo!()
    }

    async fn delete_group(&self, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_groups(&self) -> Result<Vec<Groups>, String> {
        todo!()
    }
}
