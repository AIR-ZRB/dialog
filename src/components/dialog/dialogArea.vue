<template>
    <!-- 消息部分可以用插槽 -->
    <div class="currentDialog">
        <!-- 标题和修改按钮 -->
        <p class="gourpTitle">
            <span>{{ currentGroup.groupName }}</span>
            <span class="setting" @click="settingButton">
                <i class="el-icon-setting item"></i>
            </span>
        </p>

        <!-- 所有人发的聊天信息渲染 -->
        <div class="dialog" ref="dialog">
            <transition-group name="fade-message" mode="out-in">
                <information
                    v-for="(item, index) in currentGroup.data"
                    :key="item.dialog + index"
                    :name="item.name"
                    :dialog="item.dialog"
                    :nowName="nowName"
                />
            </transition-group>
        </div>

        <!-- 消息输入区域 -->
        <div class="inputDialog">
            <i class="el-icon-paperclip"></i>
            <i class="el-icon-picture-outline-round"></i>

            <el-input
                v-model="sendMessage"
                placeholder="请输入内容"
                @keyup.enter.native="outputMessage"
            ></el-input>
            <el-button
                type="primary"
                icon="el-icon-s-promotion"
                circle
                @click="outputMessage"
            ></el-button>
        </div>
    </div>
</template>

<script>
import Bus from "../../bus";
export default {
    props: ["getDialogGroupData"],
    data() {
        return {
            nowName: "", // 当前登录的用户名
            sendMessage: "", // input绑定，即将发送的信息
            currentGroup: [], // 当前正在聊天的组
            dialogGroupData: [],
        };
    },

    methods: {
        // 发送信息给服务端，只要发送，所有在线客户端就会即使返回对应的数据
        sendWebsocket(data) {
            const ws = new WebSocket(this.$root.wsAddress);
            ws.onopen = () => ws.send(JSON.stringify(data));
        },
        // 处理消息的响应
        websocket() {
            const ws = new WebSocket(this.$root.wsAddress);
            ws.onmessage = (event) => {
                event = JSON.parse(event.data);
                event.state === "dialog" && this.newMessage(event);
                event.state === "new" && this.addGroup(event);
                event.state === "edit" && this.editGroup(event);
            };
        },
        // 点击发送按钮，发送信息
        outputMessage() {
            this.sendWebsocket({
                groupName: this.currentGroup.groupName,
                name: this.nowName,
                dialog: this.sendMessage,
                state: "dialog",
            });
        },

        // 修改群信息按钮
        settingButton() {
            let currentGroup = this.currentGroup;
            this.$emit("update:editGroupShow", true);
            Bus.$emit("editGroupData", { currentGroup, state: "edit" });
        },
        // 添加组
        addGroup(data) {
            let dialogData = this._props.getDialogGroupData;
            let flag = dialogData.some((item) => {
                return item.groupName === data.groupName;
            });
            // 如果相同的组名，则提示
            if (flag) {
                this.$notify.error({
                    title: "错误",
                    message: "群已存在",
                });
                return;
            }

            dialogData.push(data);
            this.$emit("update:getDialogGroupData", dialogData);

            this.$notify.success({
                title: "成功",
                message: "创建成功",
            });
        },
        // 通过返回的数据，修改群信息
        editGroup(data) {
            const dialogData = this._props.getDialogGroupData;
            let currentIndex = dialogData.findIndex((item) => {
                return item.groupName === this.currentGroup.groupName;
            });
            let allDialogData = dialogData[currentIndex];
            allDialogData.groupName = data.groupName;
            allDialogData.picture = data.picture;
        },
        // 在不同群聊时过滤消息，添加消息
        newMessage(data) {
            const dialogData = this._props.getDialogGroupData;
            let currentIndex = dialogData.findIndex((item) => {
                return item.groupName === data.groupName;
            });
            dialogData[currentIndex].data.push(data);
            this.$nextTick(() => this.$refs.dialog.scrollTo(0, 1000000000));
        },
    },
    created() {
        // 建立websocket连接
        this.websocket();
        // 从兄弟组件获取到当前群聊的信息
        Bus.$on("currentGroupMessage", (data) => (this.currentGroup = data));
        // 修改/添加群触发
        Bus.$on("editGroup", (data) => data && this.sendWebsocket(data));
        
        this.nowName = sessionStorage.getItem("nowName");
    },
};
</script>

<style lang="scss" scoped>
@import url(../../assets/base.css);
$theme-icon-color: var(--theme-icon-color);
$top-height: 60px;
// 右边区域
.currentDialog {
    height: 100%;
    position: relative;
    // 顶部区域
    .gourpTitle {
        font-size: 24px;
        height: $top-height;
        // line-height: $top-height;
        padding: 15px 20px;

        position: relative;
        background: #fff;
        .setting i {
            float: right;
            font-weight: 700;
            cursor: pointer;
        }
    }
    // 内容区域
    .dialog {
        padding: 10px;
        width: 100%;
        overflow-y: scroll;
        position: absolute;
        top: $top-height;
        bottom: $top-height;
        background: var(--theme-light-color);
    }
    // 输入框区域
    .inputDialog {
        width: 100%;
        height: $top-height;
        bottom: 0;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        i {
            font-size: 34px;
            color: $theme-icon-color;
        }
        .el-input {
            width: 80%;
        }
        button {
            font-size: 18px;
            background: var(--theme-color);
        }
    }
}
.fade-message-enter,
.fade-message-leave-to {
    opacity: 0;
}

.fade-message-enter-to,
.fade-message-leave {
    opacity: 1;
}

.fade-message-enter-active,
.fade-message-leave-active {
    transition: all 0.3s;
}
</style>
