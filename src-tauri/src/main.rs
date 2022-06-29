#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use mc_exam_randomizer::shuffler::{shuffle_exam, Exam};
use tauri_plugin_store::PluginBuilder;

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .setup(|_app| Ok(()))
        .invoke_handler(tauri::generate_handler![
            read_tex,
            get_random_version_tex,
            get_random_version_csv,
            read_csv
        ])
        .plugin(PluginBuilder::default().build())
        .run(context)
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_tex(filename: &str) -> Result<Exam, String> {
    match Exam::from_tex(filename, "master") {
        Ok(ex) => Ok(ex),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn read_csv(filename: &str) -> Result<Exam, String> {
    match Exam::from_csv(filename, "master") {
        Ok(ex) => Ok(ex),
        Err(err) => Err(err.to_string()),
    }
}
#[tauri::command]
fn get_random_version_tex(filename: &str, name: &str) -> Result<Exam, String> {
    match Exam::from_tex(filename, "master") {
        Ok(ex) => Ok(shuffle_exam(&ex, Some(name))),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn get_random_version_csv(filename: &str, name: &str) -> Result<Exam, String> {
    match Exam::from_csv(filename, "master") {
        Ok(ex) => Ok(shuffle_exam(&ex, Some(name))),
        Err(err) => Err(err.to_string()),
    }
}
