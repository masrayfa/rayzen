use async_trait::async_trait;
use uuid::Uuid;

use crate::domain::{entities::bookmark::Bookmark, util};

#[async_trait]
pub trait BookmarkRepository: Send + Sync {
    async fn create_bookmark(&self, bookmark: Bookmark) -> Result<Bookmark, String>;
    async fn get_bookmark_by_id(&self, id: Uuid) -> Result<Bookmark, String>;
    async fn update_bookmark(&self, bookmark: Bookmark) -> Result<Bookmark, String>;
    async fn delete_bookmark(&self, id: Uuid) -> Result<(), String>;
    async fn list_bookmarks(&self) -> Result<Vec<Bookmark>, String>;
}

pub struct BookmarkRepositoryImpl {}

impl BookmarkRepositoryImpl {
    pub fn new() -> Self {
        BookmarkRepositoryImpl {}
    }
}

#[async_trait]
impl BookmarkRepository for BookmarkRepositoryImpl {
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

    async fn list_bookmarks(&self) -> Result<Vec<Bookmark>, String> {
        todo!()
    }
}
