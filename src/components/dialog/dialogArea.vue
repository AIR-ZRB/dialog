<template>
    <!-- 消息部分可以用插槽 -->
    <div class="currentDialog">
        <!-- 标题和修改按钮 -->
        <p class="gourpTitle">
            <span>{{ currentDialogGroupName }}</span>
            <span class="setting" @click="settingButton">
                <i class="el-icon-setting item"></i>
            </span>
        </p>

        <!-- 所有人发的聊天信息渲染 -->
        <div class="dialog" ref="dialog">
            <transition-group name="fade-message" mode="out-in">
                <information
                    v-for="(item, index) in currentDialogGroup"
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
    data() {
        return {
            nowName: "",
            currentGroup: [],
            currentDialogGroup: [], // 当前聊天组的聊天内容
            currentDialogGroupName: "...", // 当前聊天组的名字
            currentGrouppicture: "", // 当前群头像
            sendMessage: "", // 即将发送的信息
            dialogGroupData: [],
        };
    },

    methods: {
        // 发送信息给服务端，只要发送，客户端就会即使返回对应的数据
        sendWebsocket(data) {
            const ws = new WebSocket("ws://localhost:3000/");
            ws.onopen = () => ws.send(JSON.stringify(data));
        },
        // 点击发送按钮，发送信息
        outputMessage() {
            this.sendWebsocket({
                groupName: this.currentDialogGroupName,
                name: this.nowName,
                dialog: this.sendMessage,
            });
        },
        // 修改群按钮
        settingButton() {
            Bus.$emit("editGroupData", {
                currentGroup: this.currentGroup,
                state: "edit",
            });
            this.$emit("update:editGroupShow", true);
        },
        // 修改完群后返回数据
        editGroup() {
            Bus.$on("editGroup", (data) => {
                data && this.sendWebsocket(data);
            });
        },
        // 通过返回的数据，修改群信息
        editGroupData(data) {
            console.log("Edit Group");
            console.log(data);

            let currentIndex = this.dialogGroupData.findIndex((item) => {
                return item.groupName === this.currentDialogGroupName;
            });
            const alldialogData = this.$root.allDialogGroupData[currentIndex];
            alldialogData.groupName = data.groupName;
            alldialogData.picture = data.picture;
            this.currentDialogGroupName = data.groupName;
        },

        // 添加组
        addGroup(data) {
            let flag = this.dialogGroupData.some((item) => {
                return item.groupName === data.groupName;
            });

            // 如果相同的组名，则提示
            if (flag) {
                this.$notify.error({
                    title: "错误",
                    message: "群组已存在",
                });
                return;
            }

            this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
            });
            this.dialogGroupData.push(data);
        },
        // 在不同群聊时过滤消息，添加消息
        filterMessage(data) {
            // 聊天
            let newData = JSON.parse(JSON.stringify(data));
            delete newData.groupName;
            if (this.currentDialogGroupName != data.groupName) {
                console.log(this.dialogGroupData);
                let currentIndex = this.dialogGroupData.findIndex((item) => {
                    return item.groupName === data.groupName;
                });

                this.dialogGroupData[currentIndex].data.push(newData);
                return;
            }
            // 并且添加进当前聊天数组
            this.currentDialogGroup.push(newData);
            this.$nextTick(() => {
                this.$refs.dialog.scrollTo(0, 100000);
            });
        },

        // 处理消息的响应
        websocket() {
            const ws = new WebSocket("ws://localhost:3000/");

            ws.onmessage = (event) => {
                let data = JSON.parse(event.data);
                console.log("触发websocket");
                // console.log(data);
                switch (data.state) {
                    case "new":
                        this.addGroup(data);
                        break;
                    case "edit":
                        this.editGroupData(data);
                        break;
                    default:
                        this.filterMessage(data);
                        break;
                }
            };
        },
    },
    created() {
        this.nowName = sessionStorage.getItem("nowName");
        this.websocket();
        this.editGroup();
        Bus.$on("currentGroupMessage", (data) => {
            // 从兄弟组件获取到当前群聊的信息
            this.currentGroup = data;
            this.currentDialogGroup = data.data;
            this.currentDialogGroupName = data.groupName;
            this.currentGrouppicture = data.picture;
        });
    },
    mounted() {
        // 延时处理，因为获取数据时是异步的
        setTimeout(() => {
            this.dialogGroupData = this.$root.allDialogGroupData;
        }, 1000);
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
