use std::sync::Arc;

use crate::domain::{
    dto::user::user_dto::{CreateUserDto, UpdateUserDto, UserDto},
    repository::user_repository::{self, UserRepository},
    router::ContextRouter,
};

use async_trait::async_trait;

#[async_trait]
pub trait UserService: Send + Sync {
    async fn create_user(&self, ctx: ContextRouter, dto: CreateUserDto) -> Result<UserDto, String>;
    async fn get_user_by_id(&self, ctx: ContextRouter, id: i32) -> Result<UserDto, String>;
    async fn update_user(&self, ctx: ContextRouter, dto: UpdateUserDto) -> Result<UserDto, String>;
    async fn delete_user(&self, ctx: ContextRouter, id: i32) -> Result<(), String>;
    async fn list_users(&self, ctx: ContextRouter) -> Result<Vec<UserDto>, String>;
}

pub struct UserServiceImpl {
    pub user_repository: Arc<dyn UserRepository>,
}

impl UserServiceImpl {
    pub fn new(user_repository: Arc<dyn UserRepository>) -> Self {
        UserServiceImpl { user_repository }
    }
}

#[async_trait]
impl UserService for UserServiceImpl {
    async fn create_user(&self, ctx: ContextRouter, dto: CreateUserDto) -> Result<UserDto, String> {
        let user = self
            .user_repository
            .create_user(&ctx.db, dto.into())
            .await
            .map_err(|e| e.to_string())?;

        Ok(user.into())
    }

    async fn get_user_by_id(&self, ctx: ContextRouter, id: i32) -> Result<UserDto, String> {
        let user = self
            .user_repository
            .get_user_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(user.into())
    }

    async fn update_user(&self, ctx: ContextRouter, dto: UpdateUserDto) -> Result<UserDto, String> {
        if dto.id.is_none() {
            return Err("Organization ID is required for update".to_string());
        }

        let id = dto.id.unwrap();

        let existing_user = self
            .user_repository
            .get_user_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        let updated_user = self
            .user_repository
            .update_user(&ctx.db, id, existing_user.into())
            .await
            .map_err(|e| e.to_string())?;

        Ok(updated_user.into())
    }

    async fn delete_user(&self, ctx: ContextRouter, id: i32) -> Result<(), String> {
        let _deleted_user = self
            .user_repository
            .delete_user(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    async fn list_users(&self, ctx: ContextRouter) -> Result<Vec<UserDto>, String> {
        let users = self
            .user_repository
            .list_users(&ctx.db)
            .await
            .map_err(|e| e.to_string())?;

        Ok(users.into_iter().map(Into::into).collect())
    }
}
