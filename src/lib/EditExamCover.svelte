<script>
  import { Highlight, HighlightAuto, HighlightSvelte } from "svelte-highlight";
  import typescript from "svelte-highlight/languages/typescript";
  import atomOneDark from "svelte-highlight/styles/atom-one-dark";
  let code = "const add = (a: number, b: number) => a + b;";
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>
<div bind:textContent={code} bind:innerHTML={code} contentEditable={true} />
<Highlight language={typescript} bind:code />
