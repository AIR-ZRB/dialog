<template>
    <div id="app">
        <router-view
            :onLine.sync="onLine"
            @getCurrentOnLine="getCurrentOnLine"
        />

        <!-- 当前在线人数 -->
        <!-- <div class="right-onLine" v-show="this.$route.fullPath === '/index'">
            <h2>当前在线</h2>
            <ul>
                <li v-for="item in onLine" :key="item.name">
                    <span :style="{ background: item.picture }"></span>
                    <span>{{ item.name }}</span>

                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            onLine: [],
        };
    },
    methods: {
        getCurrentOnLine(data) {
            this.onLine = data;
        },
    },
    created(){
        window.onbeforeunload = function(){
           alert("???")
        }

        window.onunload = function(){
            alert("??????")
        }
    }
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
    min-width: 1400px;
    overflow: hidden;
    display: flex;
}
</style>
