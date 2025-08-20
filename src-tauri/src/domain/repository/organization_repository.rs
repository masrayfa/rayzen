// Organization Repository Implementation
use async_trait::async_trait;
use entity::{
    organization::{self, ActiveModel as OrganizationActiveModel, Entity as Organization},
    user::Column,
};
use sea_orm::{prelude::Expr, Condition, DatabaseConnection, DbErr, EntityTrait, QueryFilter};

#[async_trait]
pub trait OrganizationRepository: Send + Sync {
    async fn create_organization(
        &self,
        db: &DatabaseConnection,
        input: OrganizationActiveModel,
    ) -> Result<organization::Model, DbErr>;
    async fn get_organization_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<organization::Model, DbErr>;
    async fn get_organization_by_user_id(
        &self,
        db: &DatabaseConnection,
        user_id: i32,
    ) -> Result<Vec<organization::Model>, DbErr>;
    async fn update_organization(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: OrganizationActiveModel,
    ) -> Result<organization::Model, DbErr>;
    async fn delete_organization(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr>;
    async fn list_organizations(
        &self,
        db: &DatabaseConnection,
    ) -> Result<Vec<organization::Model>, DbErr>;
}

pub struct OrganizationRepositoryImpl {}

impl OrganizationRepositoryImpl {
    pub fn new() -> Self {
        OrganizationRepositoryImpl {}
    }
}

#[async_trait]
impl OrganizationRepository for OrganizationRepositoryImpl {
    async fn create_organization(
        &self,
        db: &DatabaseConnection,
        input: OrganizationActiveModel,
    ) -> Result<organization::Model, DbErr> {
        let result = Organization::insert(input)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        let organization_model = Organization::find_by_id(result.last_insert_id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Organization not found".to_string()))?;
        Ok(organization_model)
    }

    async fn get_organization_by_id(
        &self,
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<organization::Model, DbErr> {
        let organization: Option<organization::Model> = Organization::find_by_id(id)
            .one(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        organization.ok_or(DbErr::RecordNotFound("Organization not found".to_string()))
    }

    async fn get_organization_by_user_id(
        &self,
        db: &DatabaseConnection,
        user_id: i32,
    ) -> Result<Vec<organization::Model>, DbErr> {
        let condition = Condition::all().add(Expr::col(Column::Id).eq(user_id));

        let organizations = Organization::find().filter(condition).all(db).await?;

        let organizations = organizations
            .into_iter()
            .map(|org| org.into())
            .collect::<Vec<organization::Model>>();

        Ok(organizations)
    }

    async fn update_organization(
        &self,
        db: &DatabaseConnection,
        id: i32,
        input: OrganizationActiveModel,
    ) -> Result<organization::Model, DbErr> {
        // Fetch the existing organization to update
        let existing_organization = Organization::find_by_id(id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound("Organization not found".to_string()))?;
        let organization_active_model: OrganizationActiveModel = existing_organization.into();
        let updated_organization = Organization::update(organization_active_model)
            .exec(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        let organization_model = Organization::find_by_id(updated_organization.id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound(
                "Updated organization not found".to_string(),
            ))?;
        Ok(organization_model)
    }

    async fn delete_organization(&self, db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
        Organization::delete_by_id(id)
            .exec(db)
            .await
            .map_err(|e| e.to_string());
        Ok(())
    }

    async fn list_organizations(
        &self,
        db: &DatabaseConnection,
    ) -> Result<Vec<organization::Model>, DbErr> {
        let organizations: Vec<organization::Model> = Organization::find()
            .all(db)
            .await
            .map_err(|e| DbErr::Custom(e.to_string()))?;
        Ok(organizations)
    }
}
