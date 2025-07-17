use crate::domain::dto;

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

/// Convert UpdateBookmarkDto to partial SeaORM ActiveModel
impl From<UpdateBookmarkDto> for BookmarkActiveModel {
    fn from(dto: UpdateBookmarkDto) -> Self {
        let mut model = BookmarkActiveModel {
            ..Default::default()
        };

        if let Some(name) = dto.name {
            model.name = Set(name);
        }
        if let Some(url) = dto.url {
            model.url = Set(url);
        }
        if let Some(tags) = dto.tags {
            model.tags = Set(tags);
        }
        if let Some(is_favorite) = dto.is_favorite {
            model.is_favorite = Set(is_favorite);
        }
        if let Some(group_id) = dto.group_id {
            model.group_id = Set(group_id);
        }

        model.updated_at = Set(chrono::Utc::now());
        model
    }
}

// impl From<BookmarkModel> for BookmarkActiveModel {
//     fn from(dto: UpdateBookmarkDto) -> Self {
//         let mut model = BookmarkActiveModel {
//             ..Default::default()
//         };

//         if let Some(name) = dto.name {
//             model.name = Set(name);
//         }
//         if let Some(url) = dto.url {
//             model.url = Set(url);
//         }
//         if let Some(tags) = dto.tags {
//             model.tags = Set(tags);
//         }
//         if let Some(is_favorite) = dto.is_favorite {
//             model.is_favorite = Set(is_favorite);
//         }
//         if let Some(group_id) = dto.group_id {
//             model.group_id = Set(group_id);
//         }

//         model.updated_at = Set(chrono::Utc::now());
//         model
//     }
// }
