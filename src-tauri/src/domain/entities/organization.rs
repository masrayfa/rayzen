use crate::domain::util;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Organization {
    pub base_entity: util::BaseEntity,
    pub name: String,
    pub access_control: String,
}
