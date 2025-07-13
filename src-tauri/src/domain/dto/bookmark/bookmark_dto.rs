use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use specta::Type;

/// Bookmark DTO for frontend communication
#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct BookmarkDto {
    pub id: i32,
    pub name: String,
    pub url: String,
    pub tags: String,
    pub is_favorite: bool,
    pub group_id: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct CreateBookmarkRequest {
    pub name: String,
    pub url: String,
    pub tags: String,
    pub is_favorite: bool,
    pub group_id: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct UpdateBookmarkRequest {
    pub name: Option<String>,
    pub url: Option<String>,
    pub tags: Option<String>,
    pub is_favorite: Option<bool>,
    pub group_id: Option<i32>,
}
