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
        this.$store.dispath('init');
    }
};
</script>

<style scoped></style>
