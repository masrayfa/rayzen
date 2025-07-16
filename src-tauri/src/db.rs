use std::time::Duration;

use sea_orm::{ConnectOptions, Database, DatabaseConnection, DbConn, DbErr};

pub async fn establish_connection(database_uri: &str) -> Result<DbConn, DbErr> {
    let mut opt = ConnectOptions::new(database_uri);
    opt.max_connections(100)
        .min_connections(5)
        .idle_timeout(Duration::from_secs(8));

    let database: Result<DatabaseConnection, DbErr> = Database::connect(opt).await;

    match database {
        Ok(db) => {
            println!("Connected to database");
            Ok(db.into())
        }
        Err(err) => {
            println!("Failed to connect to database");
            Err(err)
        }
    }
}
