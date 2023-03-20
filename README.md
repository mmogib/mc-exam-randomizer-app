# To DO

- [x] naming files (VerbNoun) (FunctionObject)
- [x] add link to documentation
- [x] overleaf button
- [x] download as template
- [x] redefine coverpage
- [x] how to fix order of a question. (add to docs)
- [x] how to fix order of options
- [x] ~~dragable ordering of options~~
- [x] styling and dark/light modes
- [x] saving last config
- [x] Order and Groups (Questions first)
  - [x] Remove order and grouping functions when uploading the questions.
  - [x] Remove the group from the `edit exam setting`
  - [x] Make sure the order is ok in 'OrderQuestionsAndOptions'
  - [x] add a grouping step
- [x] Oredr of Options
- [x] item Analysis
- [ ] quiz headers

# How to update!

0. For dev run
   ```bash
   npm run tauri **dev**
   ```
1. Updtae `package.version` in tauri.conf.json
2. Updtae `version` in Cargo.toml
3. Updtae `version` in package.json
4. ```bash
   git add .
   ```
5. ```bash
   git commit -m "message"
   ```
6. ```bash
   git push
   ```
7. ```bash
   npm run tauri build
   ```
8. create a new release in [github](https://github.com/mmogib/mc-exam-randomizer-app/releases/new) with tag `vx.x.x`
9. Upload files from `src-tauri\target\release\bundle\msi\`.
10. update `airable` base `MC-EXAM-RANDOMIZER-DB`

# Check for updates to packages

- ```bash
  cargo tauri info
  ```
- ```bash
  npx npm-check-updates
  ```
