use super::bookmark_dto::{BookmarkDto, CreateBookmarkDto, UpdateBookmarkDto};
use entity::bookmark::{ActiveModel as BookmarkActiveModel, Model as BookmarkModel};
use sea_orm::ActiveValue::Set;

/// Convert SeaORM Bookmark Model to DTO
impl From<BookmarkModel> for BookmarkDto {
    fn from(model: BookmarkModel) -> Self {
        BookmarkDto {
            id: model.id,
            name: model.name,
            url: model.url,
            tags: model.tags,
            is_favorite: model.is_favorite,
            group_id: model.group_id,
            created_at: model.created_at,
            updated_at: model.updated_at,
            deleted_at: Some(model.deleted_at),
        }
    }
}

/// Convert CreateBookmarkRequest to SeaORM ActiveModel
impl From<CreateBookmarkDto> for BookmarkActiveModel {
    fn from(dto: CreateBookmarkDto) -> Self {
        BookmarkActiveModel {
            name: Set(dto.name),
            url: Set(dto.url),
            tags: Set(dto.tags),
            is_favorite: Set(dto.is_favorite),
            group_id: Set(dto.group_id),
            created_at: Set(chrono::Utc::now()),
            updated_at: Set(chrono::Utc::now()),
            deleted_at: Set(chrono::Utc::now()),
            ..Default::default()
        }
    }
}

/// Convert UpdateBookmarkInput to partial SeaORM ActiveModel
impl UpdateBookmarkDto {
    pub fn apply_to_model(self, mut model: BookmarkActiveModel) -> BookmarkActiveModel {
        if let Some(name) = self.name {
            model.name = Set(name);
        }
        if let Some(url) = self.url {
            model.url = Set(url);
        }
        if let Some(tags) = self.tags {
            model.tags = Set(tags);
        }
        if let Some(is_favorite) = self.is_favorite {
            model.is_favorite = Set(is_favorite);
        }
        if let Some(group_id) = self.group_id {
            model.group_id = Set(group_id);
        }
        model.updated_at = Set(chrono::Utc::now());
        model
    }
}
