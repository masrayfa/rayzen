use crate::domain::util;

use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

#[derive(Type, Debug, Clone, Serialize, Deserialize)]
pub struct Bookmark {
    pub base_entity: util::BaseEntity,
    pub name: String,
    pub url: String,
    pub tags: String,
    pub is_favorite: bool,
    pub group_id: Uuid,
}
