use crate::domain::dto::organization::organization_dto::{
    CreateOrganizationRequest, OrganizationDto, UpdateOrganizationRequest,
};

use async_trait::async_trait;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

#[async_trait]
pub trait OrganizationRepository: Send + Sync {
    async fn create_organization(
        &self,
        db: &DatabaseConnection,
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String>;
    async fn get_organization_by_id(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
    ) -> Result<OrganizationDto, String>;
    async fn update_organization(
        &self,
        db: &DatabaseConnection,
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String>;
    async fn delete_organization(&self, db: &DatabaseConnection, id: Uuid) -> Result<(), String>;
    async fn list_organization(
        &self,
        db: &DatabaseConnection,
    ) -> Result<Vec<OrganizationDto>, String>;
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
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String> {
        todo!()
    }

    async fn get_organization_by_id(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
    ) -> Result<OrganizationDto, String> {
        todo!()
    }

    async fn update_organization(
        &self,
        db: &DatabaseConnection,
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String> {
        todo!()
    }

    async fn delete_organization(&self, db: &DatabaseConnection, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_organization(
        &self,
        db: &DatabaseConnection,
    ) -> Result<Vec<OrganizationDto>, String> {
        todo!()
    }
}
