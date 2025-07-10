use crate::domain::entities::organization::Organization;

use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait OrganizationRepository: Send + Sync {
    async fn create_organization(&self, organization: Organization)
        -> Result<Organization, String>;
    async fn get_organization_by_id(&self, id: Uuid) -> Result<Organization, String>;
    async fn update_organization(&self, organization: Organization)
        -> Result<Organization, String>;
    async fn delete_organization(&self, id: Uuid) -> Result<(), String>;
    async fn list_organization(&self) -> Result<Vec<Organization>, String>;
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
        organization: Organization,
    ) -> Result<Organization, String> {
        todo!()
    }

    async fn get_organization_by_id(&self, id: Uuid) -> Result<Organization, String> {
        todo!()
    }

    async fn update_organization(
        &self,
        organization: Organization,
    ) -> Result<Organization, String> {
        todo!()
    }

    async fn delete_organization(&self, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_organization(&self) -> Result<Vec<Organization>, String> {
        todo!()
    }
}
