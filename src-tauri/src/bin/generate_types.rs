//! Generate TypeScript types for frontend

use entity::dto::*;
use specta::export::ts;
use std::fs;

fn main() {
    // Generate TypeScript types for all DTOs
    let types = vec![
        ts::export::<BookmarkDto>(&Default::default()).unwrap(),
        ts::export::<CreateBookmarkInput>(&Default::default()).unwrap(),
        ts::export::<UpdateBookmarkInput>(&Default::default()).unwrap(),
        ts::export::<GroupsDto>(&Default::default()).unwrap(),
        ts::export::<CreateGroupInput>(&Default::default()).unwrap(),
        ts::export::<UpdateGroupInput>(&Default::default()).unwrap(),
        ts::export::<OrganizationDto>(&Default::default()).unwrap(),
        ts::export::<UserDto>(&Default::default()).unwrap(),
        ts::export::<WorkspaceDto>(&Default::default()).unwrap(),
    ];

    let content = types.join("\n\n");
    
    fs::write("../frontend/src/types/api.ts", content)
        .expect("Failed to write TypeScript types");
    
    println!("TypeScript types generated successfully!");
}
