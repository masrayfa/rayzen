use crate::domain::dto::workspace::workspace_dto::{
    CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceDto,
};
use entity::workspace::{self, ActiveModel, Model};
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
            deleted_at: Some(model.deleted_at),
        }
    }
}

/// Convert CreateOrganizationDto to SeaORM ActiveModel
impl From<CreateWorkspaceDto> for ActiveModel {
    fn from(dto: CreateWorkspaceDto) -> Self {
        ActiveModel {
            name: Set(dto.name),
            organization_id: Set(dto.organization_id),
            created_at: Set(chrono::Utc::now()),
            updated_at: Set(chrono::Utc::now()),
            ..Default::default()
        }
    }
}

/// Convert UpdateOrganizationDto to partial SeaORM ActiveModel
impl UpdateWorkspaceDto {
    pub fn apply_to_model(self, mut model: workspace::ActiveModel) -> workspace::ActiveModel {
        if let Some(name) = self.name {
            model.name = Set(name);
        }
        if let Some(organization_id) = self.organization_id {
            model.organization_id = Set(organization_id);
        }
        model.updated_at = Set(chrono::Utc::now());
        model
    }
}
