use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct GroupsDto {
    pub id: i32,
    pub name: String,
    pub workspace_id: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct CreateGroupsDto {
    pub name: String,
    pub workspace_id: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct UpdateGroupsDto {
    pub id: Option<i32>,
    pub name: Option<String>,
    pub workspace_id: Option<i32>,
}
