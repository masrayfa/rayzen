use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct GroupsByWorkspaceOrg {
    pub id: i32,
    pub name: String,
}
