use crate::router::ContextRouter;
use rspc::{Router, RouterBuilder};

pub fn create_users_router() -> RouterBuilder<ContextRouter> {
    Router::<ContextRouter>::new()
        .query("list", |t| {
            return t(|_ctx, _input: ()| async move { vec![] as Vec<()> });
        })
        .query("get", |t| t(|_ctx, id: u32| format!("User {}", id)))
}
