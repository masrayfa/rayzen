use crate::{
    domain::{entities::bookmark::Bookmark, service::bookmark_service::BookmarkService},
    router::ContextRouter,
};
use rspc::{Router, RouterBuilder};
use uuid::Uuid;

pub fn create_bookmark_router() -> RouterBuilder<ContextRouter> {
    Router::<ContextRouter>::new()
        .query("list", |t| {
            t(|ctx, _input: ()| {
                let service = ctx.bookmark_service.clone();
                async move {
                    service
                        .list_bookmark()
                        .await
                        .map_err(|e| rspc::Error::new(rspc::ErrorCode::InternalServerError, e))
                }
            })
        })
        .query("get", |t| {
            t(|ctx, id: String| async move {
                let uuid = Uuid::parse_str(&id).map_err(|e| {
                    rspc::Error::new(rspc::ErrorCode::BadRequest, format!("Invalid UUID: {}", e))
                })?;

                ctx.bookmark_service
                    .get_bookmark_by_id(uuid)
                    .await
                    .map_err(|e| rspc::Error::new(rspc::ErrorCode::InternalServerError, e))
            })
        })
        .mutation("create", |t| {
            t(|ctx, bookmark: Bookmark| async move {
                ctx.bookmark_service
                    .create_bookmark(bookmark)
                    .await
                    .map_err(|e| rspc::Error::new(rspc::ErrorCode::InternalServerError, e))
            })
        })
        .mutation("update", |t| {
            t(|ctx, bookmark: Bookmark| async move {
                ctx.bookmark_service
                    .update_bookmark(bookmark)
                    .await
                    .map_err(|e| rspc::Error::new(rspc::ErrorCode::InternalServerError, e))
            })
        })
        .mutation("delete", |t| {
            t(|ctx, id: String| async move {
                let uuid = Uuid::parse_str(&id).map_err(|e| {
                    rspc::Error::new(rspc::ErrorCode::BadRequest, format!("Invalid UUID: {}", e))
                })?;

                ctx.bookmark_service
                    .delete_bookmark(uuid)
                    .await
                    .map_err(|e| rspc::Error::new(rspc::ErrorCode::InternalServerError, e))
            })
        })
}
