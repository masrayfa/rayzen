use super::user_dto::{CreateUserDto, UpdateUserDto, UserDto};
use entity::user;
use sea_orm::ActiveValue::Set;

/// Convert SeaORM User Model to DTO
impl From<user::Model> for UserDto {
    fn from(model: user::Model) -> Self {
        UserDto {
            id: model.id,
            name: model.name,
            email: model.email,
            created_at: model.created_at,
            updated_at: model.updated_at,
        }
    }
}

/// Convert CreateUserDto to SeaORM ActiveModel
impl From<CreateUserDto> for user::ActiveModel {
    fn from(request: CreateUserDto) -> Self {
        user::ActiveModel {
            name: Set(request.name),
            email: Set(request.email),
            created_at: Set(chrono::Utc::now()),
            updated_at: Set(chrono::Utc::now()),
            ..Default::default()
        }
    }
}

/// Convert UpdateUserDto to partial SeaORM ActiveModel
impl UpdateUserDto {
    pub fn apply_to_model(self, mut model: user::ActiveModel) -> user::ActiveModel {
        if let Some(name) = self.name {
            model.name = Set(name);
        }
        if let Some(email) = self.email {
            model.email = Set(email);
        }
        model.updated_at = Set(chrono::Utc::now());
        model
    }
}
