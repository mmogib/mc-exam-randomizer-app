# To DO

- [x] naming files (VerbNoun) (FunctionObject)
- [x] add link to documentation
- [x] overleaf button
- [x] download as template
- [x] redefine coverpage
- [x] how to fix order of a question. (add to docs)
- [x] how to fix order of options
- [ ] ~~dragable ordering of options~~
- [ ] styling and dark/light modes
- [x] saving last config

# How to update!

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
8. create a new release in github with tag `v.x.x.x`
9. update aitable base `MC-EXAM-RANDOMIZER-DB`
