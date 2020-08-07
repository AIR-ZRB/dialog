<template>
    <div class="dialog-box">
        <div class="dialogGroup">
            <search />
            <!-- 左边聊天列表 -->
            <dialogGroup
                v-for="(item, index) in dialogGroupData"
                :key="item.picture + index"
                :group="item"
                :allData="dialogGroupData"
                v-initializeClick="index"
            />
        </div>
        <!-- 右边发消息区域 -->
        <dialogArea
            :editGroupShow.sync="editGroupShow"
            :getDialogGroupData.sync="dialogGroupData"
        />
        <!-- 修改/添加群使用 -->
        <editGroup :editGroupShow.sync="editGroupShow" v-show="editGroupShow" />
    </div>
</template>
<script>
import dialogArea from "./dialogArea";
import Bus from "../../bus";
export default {
    data() {
        return {
            dialogGroupData: [], // 相当于dialogData文件
            editGroupShow: false,
        };
    },
    components: { dialogArea },
    //  自定义指令
    directives: {
        // 给初始化时，自动选择第一个聊天组
        initializeClick: {
            inserted(el, binding) {
                if (binding.value === 0) el.click();
            },
        },
    },
    methods: {
        // 获取所有群的聊天记录
        async getDialogData() {
            const data = await this.axios.get("/getDialogData");
            data.data.forEach((item) => {
                item.active = false;
            });
            this.dialogGroupData = data.data;
        },
        sendWebsocket(data) {
            const ws = new WebSocket(this.$root.wsAddress);
            ws.onopen = () => ws.send(JSON.stringify(data));
        },
    },

    // 生命周期，组件还未初始化
    created() {
        // 请求聊天数据
        this.getDialogData();
        Bus.$on("clickActiveGroup", () => (this.editGroupShow = true));
    },
    mounted() {
        setTimeout(() => {
            this.sendWebsocket({
                groupName: "基本群聊",
                name: "白鸟留依",
                dialog: "hhhhhhh",
                state: "dialog",
            });
        }, 2000);
    },
};
</script>

<style scoped lang="scss">
@import url(../../assets/base.css);
$theme-icon-color: var(--theme-icon-color);
$top-height: 60px;

.dialog-box {
    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-rows: 100%;
}

// 中间聊天组样式
.dialogGroup {
    position: relative;
    height: 100%;
    overflow: hidden;
}
</style>
