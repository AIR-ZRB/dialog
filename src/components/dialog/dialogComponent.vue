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
        <dialogArea />
        <!-- 修改/添加群使用 -->
        <editGroup
            @submitData="editGroups"
            :currentState="currentState"
            v-if="editGroupShow"
        />
    </div>
</template>
<script>
import dialogArea from "./dialogArea";
import Bus from "../../bus"
export default {
    data() {
        return {
            dialogGroupData: [], // 相当于dialogData文件
            editGroupShow: false,
            currentState: "",
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
        // 修改群
        eidtGroup(data) {
            console.log("Edit Group");

            let currentIndex = this.dialogGroupData.findIndex((item) => {
                return item.groupName === this.editGroupName;
            });

            data.data = this.dialogGroupData[currentIndex].data;
            this.dialogGroupData[currentIndex] = data;
            this.currentDialogGroupName = this.dialogGroupData[
                currentIndex
            ].groupName;

            this.dialogGroupData = JSON.parse(
                JSON.stringify(this.dialogGroupData)
            );
        },
        // 获取所有群的聊天记录
        async getDialogData() {
            const data = await this.axios.get("/getDialogData");
            data.data.forEach((item) => {
                item.active = false;
            });
            this.dialogGroupData = data.data;
        },
    },

    // 生命周期，组件还未初始化
    created() {
        // 请求聊天数据
        this.getDialogData();
        
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
