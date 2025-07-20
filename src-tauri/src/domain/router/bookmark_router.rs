use std::sync::Arc;

use entity::bookmark;
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
        .query("getBookmarks", |t| {
            t.resolver(|ctx: ContextRouter, _input: ()| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .list_bookmark(ctx)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getBookmarkById", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .get_bookmark_by_id(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("createBookmark", |t| {
            t.resolver(|ctx: ContextRouter, input: CreateBookmarkDto| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .create_bookmark(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("updateBookmark", |t| {
            t.resolver(|ctx: ContextRouter, input: UpdateBookmarkDto| async move {
                let repo = Arc::new(BookmarkRepositoryImpl::new());
                let service = BookmarkServiceImpl::new(repo);

                service
                    .update_bookmark(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("deleteBookmark", |t| {
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
