<template>
    <div class="dialogBox">
        <!-- 顶部栏 -->
        <header>
            <img
                src="https://pic4.zhimg.com/80/v2-bfdf1bf48988291c43ab3c1ed1d02526_720w.jpg"
                alt
                class="photo"
            />
            <span>{{ nowName }}</span>
        </header>

        <!-- 聊天组 -->
        <div class="center">
            <div class="dialogGroup">
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
                ></dialogGroup>

                <div class="addGroup"  @click="() => (this.editGroupShow = true)">
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
                        @click="
                            () => {
                                this.editGroupShow = true;
                                this.sendWebsocket({
                                    nowEditGroup: this.currentDialogGroupName,
                                });
                            }
                        "
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
                    <dialogMessage
                        v-for="(item, index) in currentDialogGroup"
                        :key="item.dialog + index"
                        :name="item.name"
                        :dialog="item.dialog"
                        :nowName="nowName"
                    />
                </div>

                <!-- 消息输入区域 -->
                <div class="inputDialog">
                    <!-- 这个可以优化一下，滚动条太难看 -->
                    <textarea class="inputBox" v-model="sendMessage"></textarea>
                    <button @click="outputMessage">发送</button>
                </div>
            </div>
        </div>

        <!-- 如何让add和edit共用一个组件 -->
        <editGroup v-if="addGroupShow" @submitData="submitData" />
        <editGroup
            @submitData="submitEditGroup"
            :editData="currentGroup"
            :editGroupShow.sync="editGroupShow"
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
            dialogGroupData: [], // 所有聊天数据
            currentGroup: [],
            currentDialogGroup: [], // 当前聊天组的聊天内容
            currentDialogGroupName: "...", // 当前聊天组的名字
            nowName: "", // sessionStorage使用的
            sendMessage: "", // 即将发送的信息
            addGroupShow: false,
            editGroupShow: false,
            editGroupIndex: "",
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
        // cancel的情况，直接退出
        submitEditGroup(groupData) {
            this.editGroupShow = false;
            if (!groupData) {
                return;
            }
            this.sendWebsocket(groupData);
        },
        // 创建群聊
        submitData(groupData) {
            this.addGroupShow = false;
            // cancel的情况，直接退出
            if (!groupData) {
                return;
            }

            // 发送到服务端来进行多端同步
            this.sendWebsocket(groupData);
        },
        // 添加组
        addGroup(data) {
            // console.log("New Group");
            let flag = "";

            this.dialogGroupData.forEach((item) => {
                if (item.groupName === data.groupName) {
                    flag = true;
                    return;
                }
            });

            // 消息提示
            if (flag) {
                this.$notify.error({
                    title: "错误",
                    message: "群组已存在",
                });
                return;
            }

            this.$notify({
                title: "成功",
                message: "这是一条成功的提示消息",
                type: "success",
            });

            this.dialogGroupData.push(data);
        },
        // 在不同群聊时过滤消息，添加消息
        filterMessage(data) {
            // 聊天
            // 当我再其他群聊的时候，另外一个再哪个群就会添加到哪个群（要筛选加判断）

            // console.log("dialog");

            // 引用类型
            let newData = JSON.parse(JSON.stringify(data));
            delete newData.groupName;

            if (this.currentDialogGroupName != data.groupName) {
                let currentIndex = "";

                this.dialogGroupData.forEach((item, index) => {
                    item.groupName === data.groupName
                        ? (currentIndex = index)
                        : null;
                });

                this.dialogGroupData[currentIndex].data.push(newData);

                return;
            }
            // 并且添加进当前聊天数组

            let goBottom = new Promise((reject) => {
                reject();
            });

            goBottom
                .then(() => {
                    this.currentDialogGroup.push(newData);
                })
                .then(() => {
                    this.$refs.dialog.scrollTo(0, 10000);
                });
        },
        // 修改群
        eidtGroup(data) {
            // console.log("Edit Group");

            let currentIndex = "";

            this.dialogGroupData.forEach((item, index) => {
                item.groupName === this.editGroupIndex
                    ? (currentIndex = index)
                    : null;
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
        // 处理消息的响应
        websocket() {
            const ws = new WebSocket("ws://localhost:3000/");

            ws.onmessage = (event) => {
                let data = JSON.parse(event.data);
                // console.log(data);
                console.log("触发websocket");
                if (data.nowEditGroup) {
                    this.editGroupIndex = data.nowEditGroup;
                    return;
                }

                switch (data.state) {
                    case "new":
                        this.addGroup(data);
                        break;
                    case "edit":
                        this.eidtGroup(data);
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
p {
    font-size: 50px;
}
$theme: red;

.dialogBox {
    overflow: hidden;
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;
    padding-right: 200px;
    min-width: 1200px;
}

header {
    background-image: linear-gradient(to right, #ccffff, #ccccff);
    width: 100%;
    height: 80px;
    padding: 0 10px;
    display: flex;
}

header .photo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 10px 20px;
}

header span {
    font-size: 20px;
    height: 100%;
    line-height: 80px;
}
.center {
    display: grid;
    width: 100%;
    height: 90%;
    grid-template-columns: 30% 70%;
    grid-template-rows: 100%;
}

.dialogGroup {
    position: relative;
    height: 100%;
    min-width: 300px;
    overflow: hidden;
}

.dialogGroup .addGroup {
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

.currentDialog {
    height: 100%;
    border-left: 1px solid #ccc;
    position: relative;
}

.currentDialog .setting i {
    float: right;
    font-weight: 700;
    cursor: pointer;
}


.currentDialog p {
    font-size: 24px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    position: relative;
}

$currentDialogTitleHeight: 150px;
.currentDialog .inputDialog {
    width: 100%;
    height: $currentDialogTitleHeight;
    border-top: 1px solid #ccc;
    bottom: 0;
    position: absolute;
}
.currentDialog .dialog {
    padding: 10px;
    width: 100%;
    overflow-y: scroll;
    position: absolute;  
    top: 52px;
    bottom: $currentDialogTitleHeight;
}

.inputDialog .inputBox {
    width: 100%;
    height: 75%;
    padding: 5px;
    font-size: 20px;
    border-top: 1px solid #ccc;
    resize: none;
    border: 0;
    outline: none;
}
.inputDialog button {
    width: 70px;
    height: 25px;
    line-height: 25px;
    color: #000;
    background-image: linear-gradient(to right, #ccffff, #ccccff);
    border: 0;
    position: absolute;
    bottom: 10px;
    right: 10px;
    outline: none;
}
</style>
