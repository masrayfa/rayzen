use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250711_115943_create_organization::Organization;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Workspace::Table)
                    .if_not_exists()
                    .col(pk_auto(Workspace::Id))
                    .col(string(Workspace::Name))
                    .col(string(Workspace::OrganizationId))
                    .foreign_key(
                        ForeignKeyCreateStatement::new()
                            .name("fk_workspace_organization")
                            .from(Workspace::Table, Workspace::OrganizationId)
                            .to(Organization::Table, Organization::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(timestamp(Workspace::CreatedAt))
                    .col(timestamp(Workspace::UpdatedAt))
                    .col(timestamp(Workspace::DeletedAt).null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Organization::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Workspace {
    Table,
    Id,
    Name,
    OrganizationId,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}
