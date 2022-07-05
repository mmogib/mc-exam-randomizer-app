<script lang="ts">
  import Home from "./lib/Home.svelte";
  import { app } from "@tauri-apps/api";
  import { open as openShell } from "@tauri-apps/api/shell";
  import { checkUpdate } from "@tauri-apps/api/updater";

  import { onMount } from "svelte";
  const update_url =
    "https://github.com/mmogib/mc-exam-randomizer-app/releases/download/v{VERSION}/MC.Exam.Randomizer_{VERSION}_x64_en-US.msi";
  let app_version = "";
  let new_version: string | null = null;
  let new_version_url: string = "";
  onMount(async () => {
    app_version = await app.getVersion();
    const { shouldUpdate, manifest } = await checkUpdate();
    if (shouldUpdate) {
      new_version = manifest.version;
      new_version_url = update_url.replaceAll("{VERSION}", manifest.version);
    }
  });

  const downloadNewVersion = async () => {
    await openShell(new_version_url);
  };
</script>

<div class="absolute top-0 left-0 ">
  version {app_version}
  {#if new_version}
    click
    <button
      class="underline underline-red-600 text-red-500"
      on:click={downloadNewVersion}>here</button
    > to install
  {/if}
</div>
<div class="absolute top-0 right-0 ">
  <button
    class="bg-green-900 text-white rounded-lg px-2 pb-1 mr-2"
    on:click={() => {
      openShell(`https://mc-exam-randomizer-docs.mshahrani.website/`);
    }}>Documentaion</button
  >
</div>
<main class="relative container mx-auto p-4 my-5 ">
  <Home />
</main>
