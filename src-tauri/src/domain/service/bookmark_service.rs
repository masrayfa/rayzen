use crate::domain::dto::bookmark::Bookmark;

use async_trait::async_trait;
use uuid::Uuid;

// Import SeaORM entities
use entity::prelude::*;
use sea_orm::*;

#[async_trait]
pub trait BookmarkService: Send + Sync {
    async fn create_bookmark(&self, bookmark: Bookmark) -> Result<Bookmark, String>;
    async fn get_bookmark_by_id(&self, id: Uuid) -> Result<Bookmark, String>;
    async fn update_bookmark(&self, group: Bookmark) -> Result<Bookmark, String>;
    async fn delete_bookmark(&self, id: uuid::Uuid) -> Result<(), String>;
    async fn list_bookmark(&self) -> Result<Vec<Bookmark>, String>;
}

pub struct BookmarkServiceImpl {}

impl BookmarkServiceImpl {
    pub fn new() -> Self {
        BookmarkServiceImpl {}
    }
}

#[async_trait]
impl BookmarkService for BookmarkServiceImpl {
    async fn create_bookmark(&self, bookmark: Bookmark) -> Result<Bookmark, String> {
        todo!()
    }

    async fn get_bookmark_by_id(&self, id: Uuid) -> Result<Bookmark, String> {
        todo!()
    }

    async fn update_bookmark(&self, bookmark: Bookmark) -> Result<Bookmark, String> {
        todo!()
    }

    async fn delete_bookmark(&self, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_bookmark(&self) -> Result<Vec<Bookmark>, String> {
        todo!()
    }
}
