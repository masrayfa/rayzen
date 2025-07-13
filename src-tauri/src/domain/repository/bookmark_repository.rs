use async_trait::async_trait;
use entity::bookmark::{self, ActiveModel as BookmarkActiveModel, Entity as Bookmark};

// Import SeaORM entities and DTOs
use crate::domain::dto::bookmark::bookmark_dto::{
    BookmarkDto, CreateBookmarkRequest, UpdateBookmarkRequest,
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

#[async_trait]
pub trait BookmarkRepository: Send + Sync {
    async fn create(
        &self,
        db: &DatabaseConnection,
        input: CreateBookmarkRequest,
    ) -> Result<BookmarkDto, DbErr>;
    async fn find_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<Option<BookmarkDto>, DbErr>;
    async fn find_all(&self, db: &DatabaseConnection) -> Result<Vec<BookmarkDto>, DbErr>;
    async fn update(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: UpdateBookmarkRequest,
    ) -> Result<BookmarkDto, DbErr>;
    async fn delete(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr>;
}

pub struct BookmarkRepositoryImpl;

impl BookmarkRepositoryImpl {
    pub fn new() -> Self {
        Self
    }
}

#[async_trait]
impl BookmarkRepository for BookmarkRepositoryImpl {
    async fn create(
        &self,
        db: &DatabaseConnection,
        input: CreateBookmarkRequest,
    ) -> Result<BookmarkDto, DbErr> {
        // Convert input to ActiveModel
        let bookmark_active_model: BookmarkActiveModel = input.into();

        let result = Bookmark::insert(bookmark_active_model).exec(db).await?;

        // Find the created bookmark and convert to DTO
        let created_bookmark = Bookmark::find_by_id(result.last_insert_id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound(
                "Created bookmark not found".to_string(),
            ))?;

        Ok(created_bookmark.into())
    }

    async fn find_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<Option<BookmarkDto>, DbErr> {
        let bookmark: Option<bookmark::Model> = Bookmark::find_by_id(id).one(db).await?;
        Ok(bookmark.map(|b| b.into()))
    }

    async fn find_all(&self, db: &DatabaseConnection) -> Result<Vec<BookmarkDto>, DbErr> {
        let bookmarks = Bookmark::find().all(db).await?;
        let list_of_bookmarks = bookmarks
            .into_iter()
            .map(|b| b.into())
            .collect::<Vec<BookmarkDto>>();

        Ok(list_of_bookmarks)
    }

    async fn update(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: UpdateBookmarkRequest,
    ) -> Result<BookmarkDto, DbErr> {
        let bookmark_model = Bookmark::find_by_id(id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Bookmark not found".to_string()))?;

        let bookmark_active_model: BookmarkActiveModel = bookmark_model.into();
        let updated_model = input.apply_to_model(bookmark_active_model);

        let updated_bookmark = Bookmark::update(updated_model).exec(db).await?;
        Ok(updated_bookmark.into())
    }

    async fn delete(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
        Bookmark::delete_by_id(id).exec(db).await;
        Ok(())
    }
}
