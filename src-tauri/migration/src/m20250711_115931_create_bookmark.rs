use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250711_115936_create_groups::Groups;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Bookmark::Table)
                    .if_not_exists()
                    .col(pk_auto(Bookmark::Id))
                    .col(string(Bookmark::Name))
                    .col(string(Bookmark::Url))
                    .col(string(Bookmark::Tags))
                    .col(boolean(Bookmark::IsFavorite))
                    .col(integer(Bookmark::GroupId).null())
                    .foreign_key(
                        ForeignKeyCreateStatement::new()
                            .name("fk-bookmark_group")
                            .from(Bookmark::Table, Bookmark::GroupId)
                            .to(Groups::Table, Groups::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(timestamp(Bookmark::CreatedAt))
                    .col(timestamp(Bookmark::UpdatedAt))
                    .col(timestamp(Bookmark::DeletedAt).null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Bookmark::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Bookmark {
    Table,
    Id,
    Name,
    Url,
    Tags,
    IsFavorite,
    GroupId,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}
