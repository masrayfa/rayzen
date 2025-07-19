use crate::domain::util;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct OrganizationDto {
    pub id: i32,
    pub name: String,
    pub user_id: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct CreateOrganizationDto {
    pub name: String,
    pub user_id: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct UpdateOrganizationDto {
    pub id: Option<i32>,
    pub name: Option<String>,
    pub user_id: Option<i32>,
}
