use super::groups_dto::{CreateGroupsDto, GroupsDto, UpdateGroupsDto};
use entity::groups;
use sea_orm::ActiveValue::Set;

/// Convert SeaORM Bookmark Model to DTO
impl From<groups::Model> for GroupsDto {
    fn from(model: groups::Model) -> Self {
        GroupsDto {
            id: model.id,
            name: model.name,
            workspace_id: model.workspace_id,
            created_at: model.created_at,
            updated_at: model.updated_at,
            deleted_at: Some(model.deleted_at),
        }
    }
}

/// Convert CreateBookmarkRequest to SeaORM ActiveModel
impl From<CreateGroupsDto> for groups::ActiveModel {
    fn from(request: CreateGroupsDto) -> Self {
        groups::ActiveModel {
            name: Set(request.name),
            workspace_id: Set(request.workspace_id),
            created_at: Set(chrono::Utc::now()),
            updated_at: Set(chrono::Utc::now()),
            deleted_at: Set(chrono::Utc::now()),
            ..Default::default()
        }
    }
}

/// Convert UpdateBookmarkInput to partial SeaORM ActiveModel
impl UpdateGroupsDto {
    pub fn apply_to_model(self, mut model: groups::ActiveModel) -> groups::ActiveModel {
        if let Some(name) = self.name {
            model.name = Set(name);
        }
        if let Some(workspace_id) = self.workspace_id {
            model.workspace_id = Set(workspace_id);
        }
        model.updated_at = Set(chrono::Utc::now());
        model
    }
}
