pub mod app_store {
    use mc_exam_randomizer::shuffler::Exam;
    use serde::{Deserialize, Serialize};

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Setting {
        pub university: String,
        pub department: String,
        pub term: String,
        pub coursecode: String,
        pub examname: String,
        pub examdate: String,
        pub numberofvestions: u32,
        pub numberofgroups: u32,
        pub exam: Exam,
    }
}
