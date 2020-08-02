<template>
    <!-- 消息部分可以用插槽 -->
    <div class="currentDialog">
        <!-- 标题和修改按钮 -->
        <p class="gourpTitle">
            <span>{{ currentDialogGroupName }}</span>
            <span class="setting" @click="() => this.clickActiveGroup('edit')">
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
            sendMessage: "", // 即将发送的信息
        };
    },
    created() {
        this.nowName = sessionStorage.getItem("nowName");
        this.websocket();
        // 发送在线消息
        this.sendWebsocket({
            state: "onLine",
            name: this.nowName,
            picture: "blue",
        });

        Bus.$on("currentGroupMessage", (data) => {
            console.log("BusOn");
            console.log(data);
            this.currentGroup = data;
            this.currentDialogGroup = data.data;
            this.currentDialogGroupName = data.groupName;
        });
    },
    methods: {
        // 发送信息给服务端
        sendWebsocket(data) {
            const ws = new WebSocket("ws://localhost:3000/");
            ws.onopen = () => {
                ws.send(JSON.stringify(data));
            };
        },
        // 点击发送按钮，发送信息
        outputMessage() {
            this.sendWebsocket({
                groupName: this.currentDialogGroupName,
                name: this.nowName,
                dialog: this.sendMessage,
            });
        },
        // 用于判断是新增群还是修改群
        clickActiveGroup(text) {
            Bus.$emit("editGroup",true)
            this.editGroupShow = true;
            this.currentState = text;
        },
        editGroups(data) {
            this.editGroupShow = false;
            data && this.sendWebsocket(data);
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

            // 深拷贝
            let newData = JSON.parse(JSON.stringify(data));
            delete newData.groupName;

            if (this.currentDialogGroupName != data.groupName) {
                let currentIndex = this.dialogGroupData.findIndex((item) => {
                    return item.groupName === data.groupName;
                });

                this.dialogGroupData[currentIndex].data.push(newData);
                return;
            }

            // 并且添加进当前聊天数组
            let goBottom = () => {
                this.currentDialogGroup.push(newData);
                return new Promise((reject) => reject());
            };
            goBottom().then(() => this.$refs.dialog.scrollTo(0, 100000));
        },
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
        // 当前在线
        async currentOnLine(data) {
            const datas = await this.axios.post("/getCurrentOnLine", {
                body: JSON.stringify(data),
            });
            console.log("查看当前在线用户");
            console.log(datas);
        },

        // 处理消息的响应
        websocket() {
            const ws = new WebSocket("ws://localhost:3000/");

            ws.onmessage = (event) => {
                let data = JSON.parse(event.data);

                console.log("触发websocket");
                console.log(data);
                switch (data.state) {
                    case "new":
                        this.addGroup(data);
                        break;
                    case "edit":
                        this.eidtGroup(data);
                        break;
                    case "onLine":
                        this.currentOnLine(data);
                        break;
                    default:
                        this.filterMessage(data);
                        break;
                }
            };
        },

        // 获取所有群的聊天记录
        async getDialogData() {
            const data = await this.axios.get("/getDialogData");
            this.dialogGroupData = data.data;
        },
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
