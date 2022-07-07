<template>
  <div>
    Download and install the latest version of the app from
    <a :href="version_link" target="_blank" rel="noopener noreferrer">here</a>.
  </div>
</template>
<script>
export default {
  data: () => ({
    version: "0.2.1",
  }),
  computed: {
    version_link() {
      return `https://github.com/mmogib/mc-exam-randomizer-app/releases/download/${
        this.version
      }/MC.Exam.Randomizer_${this.version.slice(1)}_x64_en-US.msi`;
    },
  },
  async mounted() {
    const response = await fetch(
      "https://api.github.com/repos/mmogib/mc-exam-randomizer-app/releases/latest"
    );
    const data = await response.json();
    this.version = data.tag_name;
  },
};
</script>
