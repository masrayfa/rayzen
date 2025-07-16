use async_trait::async_trait;
use entity::bookmark::{
    self, ActiveModel as BookmarkActiveModel, Entity as Bookmark, Model as BookmarkModel,
};

// Import SeaORM entities and DTOs
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

#[async_trait]
pub trait BookmarkRepository: Send + Sync {
    async fn create(
        &self,
        db: &DatabaseConnection,
        bookmark: BookmarkActiveModel,
    ) -> Result<BookmarkModel, DbErr>;
    async fn find_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<Option<BookmarkModel>, DbErr>;
    async fn find_all(&self, db: &DatabaseConnection) -> Result<Vec<BookmarkModel>, DbErr>;
    async fn update(
        &self,
        db: &DatabaseConnection,
        id: i32,
        bookmark: BookmarkActiveModel,
    ) -> Result<bookmark::Model, DbErr>;
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
        bookmark: BookmarkActiveModel,
    ) -> Result<BookmarkModel, DbErr> {
        let created_bookmark = Bookmark::insert(bookmark).exec_with_returning(db).await?;

        Ok(created_bookmark)
    }

    async fn find_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<Option<BookmarkModel>, DbErr> {
        let bookmark: Option<BookmarkModel> = Bookmark::find_by_id(id).one(db).await?;
        Ok(bookmark)
    }

    async fn find_all(&self, db: &DatabaseConnection) -> Result<Vec<BookmarkModel>, DbErr> {
        let bookmarks = Bookmark::find().all(db).await?;
        let list_of_bookmarks = bookmarks
            .into_iter()
            .map(|b| b.into())
            .collect::<Vec<BookmarkModel>>();

        Ok(list_of_bookmarks)
    }

    async fn update(
        &self,
        db: &DatabaseConnection,
        id: i32,
        bookmark: BookmarkActiveModel,
    ) -> Result<bookmark::Model, DbErr> {
        let updated_bookmark = Bookmark::update(bookmark).exec(db).await?;
        Ok(updated_bookmark)
    }

    async fn delete(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
        Bookmark::delete_by_id(id).exec(db).await;
        Ok(())
    }
}
