use rspc::*;

// Import DTOs with Specta support
use crate::domain::{repository::bookmark_repository::*, router::ContextRouter};
use sea_orm::DatabaseConnection;

/// Create bookmark router with type-safe procedures
pub fn create_bookmark_router() -> Router<ContextRouter> {
    Router::new()
        .query("getBookmarks", |t| {
            t.resolver(|ctx, _input: ()| async move {
                let repo = BookmarkRepositoryImpl::new();
                repo.find_all(&ctx)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e.to_string()))
            })
        })
        .query("getBookmark", |t| {
            t.resolver(|ctx, input: i32| async move {
                let repo = BookmarkRepositoryImpl::new();
                repo.find_by_id(&ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e.to_string()))
            })
        })
        .mutation("createBookmark", |t| {
            t.resolver(|ctx, input: CreateBookmarkInput| async move {
                let repo = BookmarkRepositoryImpl::new();
                repo.create(&ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e.to_string()))
            })
        })
        .mutation("updateBookmark", |t| {
            t.resolver(|ctx, input: (i32, UpdateBookmarkInput)| async move {
                let repo = BookmarkRepositoryImpl::new();
                repo.update(&ctx, input.0, input.1)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e.to_string()))
            })
        })
        .mutation("deleteBookmark", |t| {
            t.resolver(|ctx, input: i32| async move {
                let repo = BookmarkRepositoryImpl::new();
                repo.delete(&ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e.to_string()))
            })
        })
}
