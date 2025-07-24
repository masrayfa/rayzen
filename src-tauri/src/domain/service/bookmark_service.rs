use std::sync::Arc;

use crate::domain::{
    dto::bookmark::bookmark_dto::{BookmarkDto, CreateBookmarkDto, UpdateBookmarkDto},
    repository::bookmark_repository::BookmarkRepository,
    router::ContextRouter,
};

use async_trait::async_trait;

pub struct BookmarkServiceImpl {
    pub bookmark_repository: Arc<dyn BookmarkRepository>,
}

impl BookmarkServiceImpl {
    pub fn new(bookmark_repository: Arc<dyn BookmarkRepository>) -> Self {
        BookmarkServiceImpl {
            bookmark_repository,
        }
    }
}

#[async_trait]
pub trait BookmarkService: Send + Sync {
    async fn create_bookmark(
        &self,
        ctx: ContextRouter,
        dto: CreateBookmarkDto,
    ) -> Result<BookmarkDto, String>;
    async fn get_bookmark_by_id(&self, ctx: ContextRouter, id: i32) -> Result<BookmarkDto, String>;
    async fn search_bookmarks(
        &self,
        ctx: ContextRouter,
        query: &str,
    ) -> Result<Vec<BookmarkDto>, String>;
    async fn update_bookmark(
        &self,
        ctx: ContextRouter,
        dto: UpdateBookmarkDto,
    ) -> Result<BookmarkDto, String>;
    async fn delete_bookmark(&self, ctx: ContextRouter, id: i32) -> Result<(), String>;
    async fn list_bookmark(&self, ctx: ContextRouter) -> Result<Vec<BookmarkDto>, String>;
}

#[async_trait]
impl BookmarkService for BookmarkServiceImpl {
    async fn create_bookmark(
        &self,
        ctx: ContextRouter,
        dto: CreateBookmarkDto,
    ) -> Result<BookmarkDto, String> {
        let created_bookmark = self
            .bookmark_repository
            .create(&ctx.db, dto.into())
            .await
            .map_err(|e| e.to_string())?;

        Ok(created_bookmark.into())
    }

    async fn get_bookmark_by_id(&self, ctx: ContextRouter, id: i32) -> Result<BookmarkDto, String> {
        let bookmark = self
            .bookmark_repository
            .find_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?
            .ok_or_else(|| "Bookmark not found".to_string())?;

        Ok(bookmark.into())
    }

    async fn search_bookmarks(
        &self,
        ctx: ContextRouter,
        query: &str,
    ) -> Result<Vec<BookmarkDto>, String> {
        let bookmarks = self
            .bookmark_repository
            .search(&ctx.db, query)
            .await
            .map_err(|e| e.to_string())?;

        Ok(bookmarks.into_iter().map(Into::into).collect())
    }

    async fn update_bookmark(
        &self,
        ctx: ContextRouter,
        dto: UpdateBookmarkDto,
    ) -> Result<BookmarkDto, String> {
        // Ensure the ID is provided in the DTO
        if dto.id.is_none() {
            return Err("Bookmark ID is required for update".to_string());
        }

        let id = dto.id.unwrap();

        let found_bookmark = self
            .bookmark_repository
            .find_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?
            .ok_or_else(|| "Bookmark not found".to_string())?;

        let updated_bookmark = self
            .bookmark_repository
            .update(&ctx.db, id, found_bookmark.into())
            .await
            .map_err(|e| e.to_string())?;

        Ok(updated_bookmark.into())
    }

    async fn delete_bookmark(&self, ctx: ContextRouter, id: i32) -> Result<(), String> {
        self.bookmark_repository
            .delete(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    async fn list_bookmark(&self, ctx: ContextRouter) -> Result<Vec<BookmarkDto>, String> {
        let bookmarks = self
            .bookmark_repository
            .find_all(&ctx.db)
            .await
            .map_err(|e| e.to_string())?;

        Ok(bookmarks.into_iter().map(Into::into).collect())
    }
}
