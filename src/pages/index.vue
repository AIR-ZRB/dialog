<template>
    <div class="dialogBox">
        <!-- 聊天组 -->
        <div class="center">
            <div class="menus"></div>

            <div class="dialogGroup">
                <div class="dialog-group-menu">
                    <i class="el-icon-s-operation"></i>
                    <el-input
                        placeholder="请输入内容"
                        suffix-icon="el-icon-search"
                        v-model="input1"
                    />
                    <i class="el-icon-more-outline"></i>
                </div>
                <!-- 左边聊天列表 -->
                <dialogGroup
                    v-for="(item, index) in dialogGroupData"
                    :allData="item"
                    :key="item.picture + index"
                    :picture="item.picture"
                    :groupName="item.groupName"
                    :index="index"
                    v-initializeClick="index"
                    :currentGroup.sync="currentGroup"
                    :currentDialogGroup.sync="currentDialogGroup"
                    :currentDialogGroupName.sync="currentDialogGroupName"
                    :editGroupName.sync="editGroupName"
                ></dialogGroup>

                <div
                    class="addGroup"
                    @click="() => this.clickActiveGroup('add')"
                >
                    +
                </div>
            </div>
            <!-- 发消息 -->
            <div class="currentDialog">
                <!-- 标题和修改按钮 -->
                <p class="gourpTitle">
                    <span>{{ currentDialogGroupName }}</span>
                    <span
                        class="setting"
                        @click="() => this.clickActiveGroup('edit')"
                    >
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="设置群信息"
                            placement="top"
                        >
                            <i class="el-icon-setting"></i>
                        </el-tooltip>
                    </span>
                </p>

                <!-- 所有人发的聊天信息渲染 -->
                <div class="dialog" ref="dialog">
                    <transition-group name="fade-message" mode="out-in">
                        <dialogMessage
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
                    <el-input v-model="sendMessage" placeholder="请输入内容"></el-input>
                    <el-button type="primary"  icon="el-icon-s-promotion" circle @click="outputMessage"></el-button>
                </div>
            </div>
        </div>

        <!-- 修改/添加群使用 -->
        <editGroup
            @submitData="editGroups"
            :editData="currentGroup"
            :currentState="currentState"
            v-if="editGroupShow"
        />
    </div>
</template>

<script>
export default {
    props: {
        onLine: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            input1: "",
            dialogGroupData: [], // 所有聊天数据
            currentGroup: [],
            currentDialogGroup: [], // 当前聊天组的聊天内容
            currentDialogGroupName: "...", // 当前聊天组的名字
            nowName: "", // sessionStorage使用的
            sendMessage: "", // 即将发送的信息
            editGroupShow: false,
            editGroupName: "",
            currentState: "",
            testOnLine: [],
        };
    },
    methods: {
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
        currentOnLine(data) {
            fetch("http://localhost:3000/getCurrentOnLine", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log("req");
                    console.log(res);
                    this.$emit("getCurrentOnLine", res);
                });
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
        // 发送信息给服务端
        sendWebsocket(data) {
            const ws = new WebSocket("ws://localhost:3000/");
            ws.onopen = () => {
                ws.send(JSON.stringify(data));
            };
        },
    },

    // 生命周期，组件还未初始化
    created() {
        fetch("http://localhost:3000/dialogData")
            .then((data) => data.json())
            .then((data) => {
                this.dialogGroupData = data;
            });
        this.nowName = sessionStorage.getItem("nowName");

        this.sendWebsocket({
            state: "onLine",
            name: this.nowName,
            picture: "blue",
        });
    },

    // 生命周期，组件已初始化完成
    mounted() {
        this.websocket();
    },
    //  自定义指令
    directives: {
        // 给初始化时，自动选择第一个聊天组
        initializeClick: {
            inserted(el, binding) {
                if (binding.value === 0) {
                    el.click();
                }
            },
        },
    },
};
</script>

<style scoped lang="scss">
$theme-icon-color: #ccc;
.dialogBox {
    overflow: hidden;
    box-shadow: #ccc 0px 0px 20px;
    width: 1200px;
    height: 85%;
    margin: auto;
}

.center {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 5% 25% 70%;
    grid-template-rows: 100%;
}

// 最左侧选项栏
.menus {
    background: #222;
}

// 中间聊天组样式
.dialogGroup {
    position: relative;
    height: 100%;
    min-width: 300px;
    overflow: hidden;

    .dialog-group-menu {
        width: 100%;
        height: 50px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-input {
            width: 75%;
            input {
                border-radius: 20px;
            }
        }
        i {
            font-size: 24px;
            color: $theme-icon-color;
            &:last-child {
                transform: rotate(90deg);
            }
        }
    }

    .addGroup {
        width: 60px;
        height: 60px;
        line-height: 60px;
        border-radius: 50%;
        background: skyblue;
        position: absolute;
        bottom: 30px;
        right: 30px;
        cursor: pointer;
        text-align: center;
        font-size: 28px;
        color: #fff;
    }
}

.currentDialog {
    height: 100%;
    border-left: 1px solid #ccc;
    position: relative;
    .setting i {
        float: right;
        font-weight: 700;
        cursor: pointer;
    }
}

.currentDialog p {
    font-size: 24px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    position: relative;
}

$currentDialogTitleHeight: 70px;

.currentDialog {
    .inputDialog {
        width: 100%;
        height: $currentDialogTitleHeight;
        border-top: 1px solid #ccc;
        bottom: 0;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        .el-input {
            width: 80%;
            .el-input__inner {
               border-radius: 10px;
            }
        }
        button {
            font-size: 18px;
        }
    }
}
.currentDialog .dialog {
    padding: 10px;
    width: 100%;
    overflow-y: scroll;
    position: absolute;
    top: 52px;
    bottom: $currentDialogTitleHeight;
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
