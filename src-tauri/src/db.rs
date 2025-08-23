// use sea_orm::{Database, DatabaseConnection, DbErr};
// use sea_orm_migration::MigratorTrait;

// pub async fn establish_connection(database_url: &str) -> Result<DatabaseConnection, DbErr> {
//     println!("Connecting to database: {}", database_url);

//     // Connect to database
//     let db = Database::connect(database_url).await?;

//     // run migration automatically - either for dev or production
//     println!("Running database migrations...");
//     migration::Migrator::up(&db, None).await?;
//     println!("Database migrations completed");

//     Ok(db)
// }

use std::time::Duration;

use sea_orm::{ConnectOptions, Database, DatabaseConnection, DbConn, DbErr};
use sea_orm_migration::MigratorTrait;

pub async fn establish_connection(database_uri: &str) -> Result<DbConn, DbErr> {
    let mut opt = ConnectOptions::new(database_uri);
    opt.max_connections(100)
        .min_connections(5)
        .idle_timeout(Duration::from_secs(8));

    let database: Result<DatabaseConnection, DbErr> = Database::connect(opt).await;

    match database {
        Ok(db) => {
            println!("Connected to database");
            migration::Migrator::up(&db, None).await?;
            Ok(db.into())
        }
        Err(err) => {
            println!("Failed to connect to database");
            Err(err)
        }
    }
}
