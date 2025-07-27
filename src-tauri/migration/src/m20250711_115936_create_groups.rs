use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250711_115948_create_workspace::Workspace;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Groups::Table)
                    .if_not_exists()
                    .col(pk_auto(Groups::Id))
                    .col(string(Groups::Name))
                    .col(integer(Groups::WorkspaceId))
                    .foreign_key(
                        ForeignKeyCreateStatement::new()
                            .name("fk_groups_workspace")
                            .from(Groups::Table, Groups::WorkspaceId)
                            .to(Workspace::Table, Workspace::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(timestamp(Groups::CreatedAt))
                    .col(timestamp(Groups::UpdatedAt))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Groups::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Groups {
    Table,
    Id,
    Name,
    WorkspaceId,
    CreatedAt,
    UpdatedAt,
}
