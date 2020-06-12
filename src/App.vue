<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {};
</script>

<style>
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
	overflow: hidden;
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
</style>
