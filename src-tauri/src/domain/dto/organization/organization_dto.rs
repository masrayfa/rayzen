use crate::domain::util;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct OrganizationDto {
    pub id: i32,
    pub name: String,
    pub workspace_id: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct CreateOrganizationRequest {
    pub name: String,
    pub workspace_id: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct UpdateOrganizationRequest {
    pub name: Option<String>,
    pub workspace_id: Option<i32>,
}
