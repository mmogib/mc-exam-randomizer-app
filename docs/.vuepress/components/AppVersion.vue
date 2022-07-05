<template>
  <div>
    Download and install the latest version of the app from
    <a :href="version_link" target="_blank" rel="noopener noreferrer">here</a>
  </div>
</template>
<script>
export default {
  data: () => ({
    version: "0.2.2",
  }),
  computed: {
    version_link() {
      return `https://github.com/mmogib/mc-exam-randomizer-app/releases/download/v${this.version}/MC.Exam.Randomizer_${this.version}_x64_en-US.msi`;
    },
  },
};
</script>
