use crate::domain::util;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workspace {
    pub base_entity: util::BaseEntity,
    pub name: String,
    pub organization_id: String,
}
