<script lang="ts">
  import Home from "./lib/Home.svelte";
  import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
  import { relaunch } from "@tauri-apps/api/process";
  import { message as diaMsg, confirm } from "@tauri-apps/api/dialog";
  import { onMount } from "svelte";
  onMount(async () => {
    try {
      const { shouldUpdate, manifest } = await checkUpdate();
      if (shouldUpdate) {
        const ok = await confirm(
          `A new version (${manifest.version}) is available. Do you want to update now?`,
          {
            title: "Update",
            type: "warning",
          }
        );
        if (ok) {
          await installUpdate();
          await diaMsg("Update complete, your app will relaunce now.");
          await relaunch();
        }
        // install complete, restart app
      }
    } catch (error) {
      await diaMsg(`Problem updaing ${error}`, {
        title: "Updater",
        type: "error",
      });
    }
  });
</script>

<main class="relative container mx-auto p-4 my-5 ">
  <Home />
</main>
