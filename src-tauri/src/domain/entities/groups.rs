use crate::domain::util;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Groups {
    pub base_entity: util::BaseEntity,
    pub name: String,
    pub workspace_id: Uuid,
}
