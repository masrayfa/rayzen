use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250712_104206_create_user::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Organization::Table)
                    .if_not_exists()
                    .col(pk_auto(Organization::Id))
                    .col(string(Organization::Name))
                    .col(integer(Organization::UserId))
                    .foreign_key(
                        ForeignKeyCreateStatement::new()
                            .name("fk_organization_user")
                            .from(Organization::Table, Organization::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(timestamp(Organization::CreatedAt))
                    .col(timestamp(Organization::UpdatedAt))
                    .col(timestamp(Organization::DeletedAt).null())
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
pub enum Organization {
    Table,
    Id,
    Name,
    UserId,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}
