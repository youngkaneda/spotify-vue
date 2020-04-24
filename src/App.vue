<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: 'App',
    data() {
        return {
        };
    },
    created() {
        this.$store.dispatch('init');
    }
};
</script>

<style scoped></style>
