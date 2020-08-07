<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        // 请求当前的用户
        async requestUser() {
            const userMessage = await this.axios.get("/getUser");
            userMessage.data.forEach((item) => {
                item.active = false;
            });
            this.$root.userList = userMessage.data;
        },
        sendWebsocket(data) {
            const ws = new WebSocket(this.$root.wsAddress);
            ws.onopen = () => ws.send(JSON.stringify(data));
        },
        // 当前在线
        // async currentOnLine(data) {
        //     const datas = await this.axios.post("/getCurrentOnLine", {
        //         body: JSON.stringify(data),
        //     });
        //     console.log("查看当前在线用户");
        //     console.log(datas);
        // },
        // sendWebsocket(data) {
        //     const ws = new WebSocket("ws://localhost:3000/");
        //     ws.onopen = () => ws.send(JSON.stringify(data));
        // },
        // websocket() {
        //     const ws = new WebSocket("ws://localhost:3000/");
        //     ws.onmessage = (event) => {
        //         let data = JSON.parse(event.data);
        //     };
        // },
    },
    created() {
        // 发送在线消息
        // this.sendWebsocket({
        //     state: "onLine",
        //     name: this.nowName,
        //     picture: "blue",
        // });
        // this.currentOnLine();
        // this.websocket();
        this.$router.push("/index/dialog")
        window.onbeforeunload = () => {
            alert("???");
            this.sendWebsocket({
                groupName: "基本群聊",
                name: "白鸟留依",
                dialog: "hhhhhhh",
                state: "dialog",
            });
            window.localStorage.setItem("aa", "bb");
        };

        window.onunload = () => {};
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
