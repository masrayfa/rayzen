use std::sync::Arc;

use crate::{
    domain::{
        dto::user::user_dto::{CreateUserDto, UpdateUserDto},
        repository::user_repository::UserRepositoryImpl,
        service::user_service::{UserService, UserServiceImpl},
    },
    router::ContextRouter,
};
use rspc::{ErrorCode, Router, RouterBuilder};

pub fn create_users_router() -> RouterBuilder<ContextRouter> {
    Router::<ContextRouter>::new()
        .query("getUsers", |t| {
            t.resolver(|ctx: ContextRouter, _input: ()| async move {
                let repo = Arc::new(UserRepositoryImpl::new());
                let service = UserServiceImpl::new(repo);
                service
                    .list_users(ctx)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getUserById", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(UserRepositoryImpl::new());
                let service = UserServiceImpl::new(repo);
                service
                    .get_user_by_id(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("createUser", |t| {
            t.resolver(|ctx: ContextRouter, input: CreateUserDto| async move {
                let repo = Arc::new(UserRepositoryImpl::new());
                let service = UserServiceImpl::new(repo);
                service
                    .create_user(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("updateUser", |t| {
            t.resolver(|ctx: ContextRouter, input: UpdateUserDto| async move {
                let repo = Arc::new(UserRepositoryImpl::new());
                let service = UserServiceImpl::new(repo);
                service
                    .update_user(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("deleteUser", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(UserRepositoryImpl::new());
                let service = UserServiceImpl::new(repo);
                service
                    .delete_user(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
}
