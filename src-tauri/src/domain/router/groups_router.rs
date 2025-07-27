use std::sync::Arc;

use crate::{
    domain::{
        dto::groups::groups_dto::{CreateGroupsDto, UpdateGroupsDto},
        repository::groups_repository::GroupRepositoryImpl,
        service::group_service::{GroupService, GroupsServiceImpl},
    },
    router::ContextRouter,
};
use rspc::{ErrorCode, Router, RouterBuilder};

pub fn create_groups_router() -> RouterBuilder<ContextRouter> {
    Router::<ContextRouter>::new()
        .query("getGroups", |t| {
            t.resolver(|ctx: ContextRouter, _input: ()| async move {
                let repo = Arc::new(GroupRepositoryImpl::new());
                let service = GroupsServiceImpl::new(repo);
                service
                    .list_groups(ctx)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getGroupById", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(GroupRepositoryImpl::new());
                let service = GroupsServiceImpl::new(repo);
                service
                    .get_group_by_id(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getBelongedGroups", |t| {
            t.resolver(|ctx: ContextRouter, workspace_id: i32| async move {
                let repo = Arc::new(GroupRepositoryImpl::new());
                let service = GroupsServiceImpl::new(repo);
                service
                    .list_belonged_groups(ctx, workspace_id)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("createGroups", |t| {
            t.resolver(|ctx: ContextRouter, input: CreateGroupsDto| async move {
                let repo = Arc::new(GroupRepositoryImpl::new());
                let service = GroupsServiceImpl::new(repo);
                service
                    .create_group(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("updateGroup", |t| {
            t.resolver(|ctx: ContextRouter, input: UpdateGroupsDto| async move {
                let repo = Arc::new(GroupRepositoryImpl::new());
                let service = GroupsServiceImpl::new(repo);
                service
                    .update_group(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("deleteGroup", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(GroupRepositoryImpl::new());
                let service = GroupsServiceImpl::new(repo);
                service
                    .delete_group(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
}
