<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    data() {
        return {
           
        };
    },
    methods: {
        async requestUser() {
            const userMessage = await this.axios.get("/getUser");
            this.$root.userList = userMessage.data;
        },
    },
    created() {
        window.onbeforeunload = function() {
            alert("???");
        };

        window.onunload = function() {
            alert("??????");
        };
        this.requestUser();
    },
};
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    width: 100%;
    height: 100%;
}

#app {
    width: 100%;
    height: 100%;
    min-width: 1200px;
    overflow: hidden;
    display: flex;
}
</style>
