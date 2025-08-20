use crate::domain::{
    dto::organization::organization_dto::{
        CreateOrganizationDto, OrganizationDto, UpdateOrganizationDto,
    },
    repository::organization_repository::OrganizationRepository,
    router::ContextRouter,
};
use async_trait::async_trait;
use std::sync::Arc;

pub struct OrganizationServiceImpl {
    pub organization_repository: Arc<dyn OrganizationRepository>,
}

impl OrganizationServiceImpl {
    pub fn new(organization_repository: Arc<dyn OrganizationRepository>) -> Self {
        OrganizationServiceImpl {
            organization_repository,
        }
    }
}

#[async_trait]
pub trait OrganizationService: Send + Sync {
    async fn create_organization(
        &self,
        ctx: ContextRouter,
        dto: CreateOrganizationDto,
    ) -> Result<OrganizationDto, String>;
    async fn get_organization_by_id(
        &self,
        ctx: ContextRouter,
        id: i32,
    ) -> Result<OrganizationDto, String>;
    async fn get_organization_by_user_id(
        &self,
        ctx: ContextRouter,
        user_id: i32,
    ) -> Result<Vec<OrganizationDto>, String>;
    async fn update_organization(
        &self,
        ctx: ContextRouter,
        organization: UpdateOrganizationDto,
    ) -> Result<OrganizationDto, String>;
    async fn delete_organization(&self, ctx: ContextRouter, id: i32) -> Result<(), String>;
    async fn list_organizations(&self, ctx: ContextRouter) -> Result<Vec<OrganizationDto>, String>;
}

#[async_trait]
impl OrganizationService for OrganizationServiceImpl {
    async fn list_organizations(&self, ctx: ContextRouter) -> Result<Vec<OrganizationDto>, String> {
        let list_of_organizations = self
            .organization_repository
            .list_organizations(&ctx.db)
            .await
            .map_err(|e| e.to_string())?;
        Ok(list_of_organizations.into_iter().map(Into::into).collect())
    }

    async fn get_organization_by_id(
        &self,
        ctx: ContextRouter,
        id: i32,
    ) -> Result<OrganizationDto, String> {
        let organization = self
            .organization_repository
            .get_organization_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;
        Ok(organization.into())
    }

    async fn get_organization_by_user_id(
        &self,
        ctx: ContextRouter,
        user_id: i32,
    ) -> Result<Vec<OrganizationDto>, String> {
        let organization = self
            .organization_repository
            .get_organization_by_user_id(&ctx.db, user_id)
            .await
            .map_err(|e| e.to_string())?;

        Ok(organization.into_iter().map(Into::into).collect())
    }

    async fn create_organization(
        &self,
        ctx: ContextRouter,
        dto: CreateOrganizationDto,
    ) -> Result<OrganizationDto, String> {
        let created_organization = self
            .organization_repository
            .create_organization(&ctx.db, dto.into())
            .await
            .map_err(|e| e.to_string())?;
        Ok(created_organization.into())
    }

    async fn update_organization(
        &self,
        ctx: ContextRouter,
        dto: UpdateOrganizationDto,
    ) -> Result<OrganizationDto, String> {
        if dto.id.is_none() {
            return Err("Organization ID is required for update".to_string());
        }
        let id = dto.id.unwrap();
        let found_organization = self
            .organization_repository
            .get_organization_by_id(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;
        let updated_organization = self
            .organization_repository
            .update_organization(&ctx.db, id, found_organization.into())
            .await
            .map_err(|e| e.to_string())?;
        Ok(updated_organization.into())
    }

    async fn delete_organization(&self, ctx: ContextRouter, id: i32) -> Result<(), String> {
        let _deleted_organization = self
            .organization_repository
            .delete_organization(&ctx.db, id)
            .await
            .map_err(|e| e.to_string())?;
        Ok(())
    }
}
