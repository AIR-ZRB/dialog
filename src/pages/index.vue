<template>
    <div class="index">
        <!-- 聊天组 -->
        <navigation />
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    methods: {
        // 用于判断是新增群还是修改群
        clickActiveGroup(text) {
            this.editGroupShow = true;
            this.currentState = text;
        },
        sendWebsocket(data) {
            const ws = new WebSocket(this.$root.wsAddress);
            ws.onopen = () => ws.send(JSON.stringify(data));
        },
    },
    created() {
        const name = sessionStorage.getItem("nowName");
        this.$router.push("/index/dialog");
        window.addEventListener("unload", logData, false);
        function logData() {
            navigator.sendBeacon("http://localhost:3000/TapeOut/" + name);
            this.sendWebsocket({
                state: "onLine",
            });
        }
    },
};
</script>

<style scoped lang="scss">
.index {
    overflow: hidden;
    box-shadow: #ccc 0px 0px 20px;
    width: 1200px;
    height: 85%;
    margin: auto;
    display: grid;
    grid-template-columns: 5% 95%;
    grid-template-rows: 100%;
}
</style>
