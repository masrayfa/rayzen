use std::sync::Arc;

use rspc::*;

// Import DTOs with Specta support
use crate::domain::{
    dto::bookmark::bookmark_dto::{CreateBookmarkDto, UpdateBookmarkDto},
    repository::bookmark_repository::*,
    router::ContextRouter,
    service::bookmark_service::{BookmarkService, BookmarkServiceImpl},
};

/// Create bookmark router with type-safe procedures
pub fn create_bookmark_router() -> RouterBuilder<ContextRouter> {
    Router::new()
        .query("list", |t| {
            t.resolver(|ctx: ContextRouter, _input: ()| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .list_bookmark(ctx)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getById", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .get_bookmark_by_id(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("search", |t| {
            t.resolver(|ctx: ContextRouter, input: String| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .search_bookmarks(ctx, &input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getByGroup", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .get_by_group(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("create", |t| {
            t.resolver(|ctx: ContextRouter, input: CreateBookmarkDto| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .create_bookmark(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("update", |t| {
            t.resolver(|ctx: ContextRouter, input: UpdateBookmarkDto| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .update_bookmark(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("delete", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .delete_bookmark(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
}
