<script lang="ts">
  import { fly } from "svelte/transition";
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

<div class="relative  ">
  <div class="top-0  left-0 w-full">
    <div class="flex -mt-1 justify-between  items-start">
      <div>
        version {app_version}
        {#if new_version}
          <div in:fly={{ y: -20 }}>
            click
            <button
              class="underline underline-red-600 text-red-500"
              on:click={downloadNewVersion}>here</button
            > to install
          </div>
        {/if}
      </div>
      <h1 class="text-2xl text-center font-bold">Multiple Choice Exam Only</h1>
      <div>
        <button
          class="rounded-lg px-2 pb-1 mr-2"
          on:click={() => {
            openShell(`https://mc-exam-randomizer-docs.mshahrani.website/`);
          }}>Documentaion</button
        >
      </div>
    </div>
  </div>
  <main class="container mx-auto">
    <Home />
  </main>
</div>
