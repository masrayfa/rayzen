// Organization Repository Implementation
use async_trait::async_trait;
use entity::user::{ActiveModel as UserActiveModel, Entity as User, Model as UserModel};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn create_user(
        &self,
        db: &DatabaseConnection,
        input: UserActiveModel,
    ) -> Result<UserModel, DbErr>;
    async fn get_user_by_id(&self, db: &DatabaseConnection, id: i32) -> Result<UserModel, DbErr>;
    async fn update_user(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: UserActiveModel,
    ) -> Result<UserModel, DbErr>;
    async fn delete_user(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr>;
    async fn list_users(&self, db: &DatabaseConnection) -> Result<Vec<UserModel>, DbErr>;
}

pub struct UserRepositoryImpl {}

impl UserRepositoryImpl {
    pub fn new() -> Self {
        UserRepositoryImpl {}
    }
}

#[async_trait]
impl UserRepository for UserRepositoryImpl {
    async fn create_user(
        &self,
        db: &DatabaseConnection,
        input: UserActiveModel,
    ) -> Result<UserModel, DbErr> {
        let result = User::insert(input)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        let user_model = User::find_by_id(result.last_insert_id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("User not found".to_string()))?;
        Ok(user_model)
    }

    async fn get_user_by_id(&self, db: &DatabaseConnection, id: i32) -> Result<UserModel, DbErr> {
        let user: Option<UserModel> = User::find_by_id(id)
            .one(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        user.ok_or(DbErr::RecordNotFound("User not found".to_string()))
    }

    async fn update_user(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: UserActiveModel,
    ) -> Result<UserModel, DbErr> {
        // Fetch the existing organization to update
        let existing_user = User::find_by_id(id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("User not found".to_string()))?;
        let user_active_model: UserActiveModel = existing_user.into();
        let updated_user = User::update(user_active_model)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        let user_model = User::find_by_id(updated_user.id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Updated user not found".to_string()))?;
        Ok(user_model)
    }

    async fn delete_user(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
        let _user = User::delete_by_id(id)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()));
        Ok(())
    }

    async fn list_users(&self, db: &DatabaseConnection) -> Result<Vec<UserModel>, DbErr> {
        let users: Vec<UserModel> = User::find()
            .all(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        Ok(users)
    }
}
