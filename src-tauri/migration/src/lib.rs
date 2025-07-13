pub use sea_orm_migration::prelude::*;

mod m20250711_115931_create_bookmark;
mod m20250711_115936_create_groups;
mod m20250711_115943_create_organization;
mod m20250711_115948_create_workspace;
mod m20250712_104206_create_user;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250711_115931_create_bookmark::Migration),
            Box::new(m20250711_115936_create_groups::Migration),
            Box::new(m20250711_115943_create_organization::Migration),
            Box::new(m20250711_115948_create_workspace::Migration),
            Box::new(m20250712_104206_create_user::Migration),
        ]
    }
}
