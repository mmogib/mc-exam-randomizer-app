#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use mc_exam_randomizer::shuffler::{shuffle_exam, Exam, ExamSetting};
use tauri_plugin_store::PluginBuilder;

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .setup(|_app| Ok(()))
        .invoke_handler(tauri::generate_handler![
            read_tex,
            read_csv,
            read_txt,
            get_random_version_tex,
            get_random_version_csv,
            get_random_version_txt,
            get_random_version
        ])
        .plugin(PluginBuilder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(context)
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_tex(filename: &str) -> Result<(Exam, Option<ExamSetting>), String> {
    match Exam::from_tex(filename, "master") {
        Ok(ex) => Ok(ex),
        Err(_err) => Err(format!("Error parsing your file {}", filename)),
    }
}

#[tauri::command]
fn read_csv(filename: &str) -> Result<Exam, String> {
    match Exam::from_csv(filename, "master") {
        Ok(ex) => Ok(ex),
        Err(_err) => Err(format!("Error parsing your file {}", filename)),
    }
}
#[tauri::command]
fn read_txt(filename: &str) -> Result<Exam, String> {
    match Exam::from_txt(filename, "master") {
        Ok(ex) => Ok(ex),
        Err(_err) => Err(format!("Error parsing your file {}", filename)),
    }
}
#[tauri::command]
fn get_random_version_tex(filename: &str, name: &str) -> Result<Exam, String> {
    match Exam::from_tex(filename, "master") {
        Ok(ex) => Ok(shuffle_exam(&ex.0, Some(name))),
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

#[tauri::command]
fn get_random_version_txt(filename: &str, name: &str) -> Result<Exam, String> {
    match Exam::from_txt(filename, "master") {
        Ok(ex) => Ok(shuffle_exam(&ex, Some(name))),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn get_random_version(exam: Exam, name: &str) -> Exam {
    shuffle_exam(&exam, Some(name))
}

// #[tauri::command]
// fn save_config_file(setting: Setting) -> Result<String, String> {
//     match toml::to_string(&setting) {
//         Ok(result) => Ok(result),
//         Err(err) => Err(err.to_string()),
//     }
// }

// #[tauri::command]
// fn get_config_from_file(rawstr: &str) -> Result<String, String> {
//     let config: Setting = toml::from_str(rawstr).unwrap();
//     Ok(format!("{:#?}", config))
// }
