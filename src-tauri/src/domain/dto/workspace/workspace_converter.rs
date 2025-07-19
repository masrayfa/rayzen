use crate::domain::dto::workspace::workspace_dto::{
    CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceDto,
};
use entity::workspace::{ActiveModel, Model};
use sea_orm::ActiveValue::Set;

/// Convert SeaORM Organization Model to DTO
impl From<Model> for WorkspaceDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            organization_id: model.organization_id,
            created_at: model.created_at,
            updated_at: model.updated_at,
            deleted_at: model.deleted_at,
        }
    }
}

/// Convert CreateOrganizationDto to SeaORM ActiveModel
impl From<CreateWorkspaceDto> for ActiveModel {
    fn from(dto: CreateWorkspaceDto) -> Self {
        ActiveModel {
            name: Set(dto.name),
            user_id: Set(dto.user_id),
            created_at: Set(chrono::Utc::now()),
            updated_at: Set(chrono::Utc::now()),
            deleted_at: Set(chrono::Utc::now()),
            ..Default::default()
        }
    }
}

/// Convert UpdateOrganizationDto to partial SeaORM ActiveModel
impl UpdateOrganizationDto {
    pub fn apply_to_model(self, mut model: organization::ActiveModel) -> organization::ActiveModel {
        if let Some(name) = self.name {
            model.name = Set(name);
        }
        if let Some(user_id) = self.user_id {
            model.user_id = Set(user_id);
        }
        model.updated_at = Set(chrono::Utc::now());
        model
    }
}

// /// Convert Organization Model to ActiveModel (for updates)
// impl From<organization::Model> for organization::ActiveModel {
//     fn from(model: organization::Model) -> Self {
//         organization::ActiveModel {
//             id: Set(model.id),
//             name: Set(model.name),
//             user_id: Set(model.user_id),
//             created_at: Set(model.created_at),
//             updated_at: Set(model.updated_at),
//             deleted_at: Set(model.deleted_at),
//         }
//     }
// }
