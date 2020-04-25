<template></template>

<script>
export default {
    created() {
        console.log('not found, handling to push.');
        this.$router.push(this.$router.toPath());
    }
}
</script>