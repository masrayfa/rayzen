use crate::domain::util;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookMark {
    pub base_entity: util::BaseEntity,
    pub name: String,
    pub url: String,
    pub tags: String,
    pub is_favorite: bool,
    pub group_id: Uuid,
}
