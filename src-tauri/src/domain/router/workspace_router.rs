use std::sync::Arc;

use crate::{
    domain::{
        dto::workspace::workspace_dto::{CreateWorkspaceDto, UpdateWorkspaceDto},
        repository::workspace_repository::WorkspaceRepositoryImpl,
        service::workspace_service::{WorkspaceService, WorkspaceServiceImpl},
    },
    router::ContextRouter,
};
use rspc::{ErrorCode, Router, RouterBuilder};

pub fn create_workspace_router() -> RouterBuilder<ContextRouter> {
    Router::<ContextRouter>::new()
        .query("getWorkspaces", |t| {
            t.resolver(|ctx: ContextRouter, _input: ()| async move {
                let repo = Arc::new(WorkspaceRepositoryImpl::new());
                let service = WorkspaceServiceImpl::new(repo);
                service
                    .list_workspace(ctx)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("createWorkspace", |t| {
            t.resolver(|ctx: ContextRouter, input: CreateWorkspaceDto| async move {
                let repo = Arc::new(WorkspaceRepositoryImpl::new());
                let service = WorkspaceServiceImpl::new(repo);
                service
                    .create_workspace(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("updateWorkspace", |t| {
            t.resolver(|ctx: ContextRouter, input: UpdateWorkspaceDto| async move {
                let repo = Arc::new(WorkspaceRepositoryImpl::new());
                let service = WorkspaceServiceImpl::new(repo);
                service
                    .update_workspace(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("deleteWorkspace", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(WorkspaceRepositoryImpl::new());
                let service = WorkspaceServiceImpl::new(repo);
                service
                    .delete_workspace(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
}
