pub mod app_store {
    use serde::{Deserialize, Serialize};

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Setting {
        pub university: String,
        pub department: String,
    }
}
