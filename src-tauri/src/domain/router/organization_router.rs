use std::sync::Arc;

use crate::{
    domain::{
        dto::organization::organization_dto::{CreateOrganizationDto, UpdateOrganizationDto},
        repository::organization_repository::OrganizationRepositoryImpl,
        service::organization_service::{OrganizationService, OrganizationServiceImpl},
    },
    router::ContextRouter,
};
use rspc::{ErrorCode, Router, RouterBuilder};

pub fn create_organization_router() -> RouterBuilder<ContextRouter> {
    Router::<ContextRouter>::new()
        .query("getOrganizations", |t| {
            t.resolver(|ctx: ContextRouter, _input: ()| async move {
                let repo = Arc::new(OrganizationRepositoryImpl::new());
                let service = OrganizationServiceImpl::new(repo);
                service
                    .list_organizations(ctx)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getOrganizationById", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(OrganizationRepositoryImpl::new());
                let service = OrganizationServiceImpl::new(repo);
                service
                    .get_organization_by_id(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .query("getOrganizationByUserId", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(OrganizationRepositoryImpl::new());
                let service = OrganizationServiceImpl::new(repo);
                service
                    .get_organization_by_user_id(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
        .mutation("createOrganization", |t| {
            t.resolver(
                |ctx: ContextRouter, input: CreateOrganizationDto| async move {
                    let repo = Arc::new(OrganizationRepositoryImpl::new());
                    let service = OrganizationServiceImpl::new(repo);
                    service
                        .create_organization(ctx, input)
                        .await
                        .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
                },
            )
        })
        .mutation("updateOrganization", |t| {
            t.resolver(
                |ctx: ContextRouter, input: UpdateOrganizationDto| async move {
                    let repo = Arc::new(OrganizationRepositoryImpl::new());
                    let service = OrganizationServiceImpl::new(repo);
                    service
                        .update_organization(ctx, input)
                        .await
                        .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
                },
            )
        })
        .mutation("deleteOrganization", |t| {
            t.resolver(|ctx: ContextRouter, input: i32| async move {
                let repo = Arc::new(OrganizationRepositoryImpl::new());
                let service = OrganizationServiceImpl::new(repo);
                service
                    .delete_organization(ctx, input)
                    .await
                    .map_err(|e| rspc::Error::new(ErrorCode::InternalServerError, e))
            })
        })
}
