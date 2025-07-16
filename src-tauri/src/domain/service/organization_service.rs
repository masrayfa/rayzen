use crate::domain::dto::organization::organization_dto::OrganizationDto;

use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait OrganizationService: Send + Sync {
    async fn create_organization(
        &self,
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String>;
    async fn get_organization_by_id(&self, id: Uuid) -> Result<OrganizationDto, String>;
    async fn update_organization(
        &self,
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String>;
    async fn delete_organization(&self, id: Uuid) -> Result<(), String>;
    async fn list_organization(&self) -> Result<Vec<OrganizationDto>, String>;
}

pub struct OrganizationSeriviceImpl {}

impl OrganizationSeriviceImpl {
    pub fn new() -> Self {
        OrganizationSeriviceImpl {}
    }
}

#[async_trait]
impl OrganizationService for OrganizationSeriviceImpl {
    async fn create_organization(
        &self,
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String> {
        todo!()
    }

    async fn get_organization_by_id(&self, id: Uuid) -> Result<OrganizationDto, String> {
        todo!()
    }

    async fn update_organization(
        &self,
        organization: OrganizationDto,
    ) -> Result<OrganizationDto, String> {
        todo!()
    }

    async fn delete_organization(&self, id: Uuid) -> Result<(), String> {
        todo!()
    }

    async fn list_organization(&self) -> Result<Vec<OrganizationDto>, String> {
        todo!()
    }
}
