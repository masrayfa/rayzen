use async_trait::async_trait;
use uuid::Uuid;

use crate::domain::{entities::bookmark::BookMark, util};

#[async_trait]
pub trait BookMarkRepository: Send + Sync {
    async fn create_bookmark(&self, bookmark: BookMark) -> Result<BookMark, String>;
    async fn get_bookmark_by_id(&self, id: Uuid) -> Result<BookMark, String>;
    async fn update_bookmark(&self, bookmark: BookMark) -> Result<BookMark, String>;
    async fn delete_bookmark(&self, id: Uuid) -> Result<(), String>;
    async fn list_bookmarks(&self) -> Result<Vec<BookMark>, String>;
}

impl BookMarkRepository for BookMark {
    async fn create_bookmark(&self, bookmark: BookMark) -> Result<BookMark, String> {
        todo!()
    }

    async fn get_bookmark_by_id(&self, id: Uuid) -> Result<BookMark, String> {
        todo!()
    }

    async fn update_bookmark(&self, bookmark: BookMark) -> Result<BookMark, String> {
        todo!()
    }

    async fn delete_bookmark(&self, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_bookmarks(&self) -> Result<Vec<BookMark>, String> {
        todo!()
    }
}
