<template>
    <div id="app">
        <router-view
            :onLine.sync="onLine"
            @getCurrentOnLine="getCurrentOnLine"
        />

        <!-- 当前在线人数 -->
        <div class="right-onLine" v-show="this.$route.fullPath === '/index'">
            <h2>当前在线</h2>
            <ul>
                <li v-for="item in onLine" :key="item.name">
                    <span :style="{ background: item.picture }"></span>
                    <span>{{ item.name }}</span>
                </li>
            </ul>
        </div>
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
        console.log(this.$route.fullPath)
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

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 8px; /*滚动条宽度*/
    height: 1px; /*!*滚动条高度*!*/
}

/*定义滑块 内阴影 + 圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 99px; /*滚动条的圆角*/
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: skyblue; /*!*滚动条的背景颜色*!*/
}

@media (max-width: 1400px) {
    .right-onLine {
        display: none;
    }
}

.right-onLine {
    width: 200px;
    padding: 10px;
    position: absolute;
    right: 0;
    height: 100%;

    li {
        list-style: none;
    }
    border: 1px solid #000;
    line-height: 30px;
    span:first-child {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
    }
}
</style>
