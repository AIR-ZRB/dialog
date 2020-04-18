<template>
  <div class="dialogBox">
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
        <dialogGroup
          v-for="(item, index) in dialogGroupData"
          :key="item.groupName"
          :picture="item.picture"
          :lastDialog="item.lastDialog"
          :groupName="item.groupName"
          :allData="item"
          :index="index"
          @givePrantMessage="parentFunction"
          v-initializeClick="index"
        ></dialogGroup>

        <div
          class="addGroup"
          @click="
            () => {
              this.editGroupShow = true;
            }
          "
        >
          +
        </div>
      </div>
      <!-- 发消息 -->
      <div class="currentDialog">
        <p class="gourpTitle">
          {{ currentDialogGroupName }}
          <span
            class="setting"
            @click="
              () => {
                this.editGroupShow = true;
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
        <div class="dialog" ref="dialog">
          <dialogMessage
            v-for="item in currentDialogGroup"
            :key="item.dialog"
            :name="item.name"
            :dialog="item.dialog"
            :nowName="nowName"
          />
        </div>
        <div class="inputDialog">
          <!-- 这个可以优化一下，滚动条太难看 -->
          <textarea class="inputBox" v-model="sendMessage"></textarea>
          <button @click="outputMessage">发送</button>
        </div>
      </div>
    </div>

    <editGroup v-show="editGroupShow" @submitData="submitData" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogGroupData: [], // 聊天组
      currentDialogGroup: [], // 当前聊天组的聊天内容
      currentDialogGroupName: "...", // 当前聊天组的名字
      nowName: "", // sessionStorage使用的
      sendMessage: "", // 即将发送的信息d
      editGroupShow: false,
    };
  },
  methods: {
    // 从子组件获取一些数据
    parentFunction(data) {
      this.currentDialogGroup = data.data;
      this.currentDialogGroupName = data.groupName;
    },

    // 点击发送按钮，发送信息
    outputMessage() {
      this.sendWebsocket(
        JSON.stringify({
          groupName: this.currentDialogGroupName,
          name: this.nowName,
          dialog: this.sendMessage,
        })
      );
    },

    // 创建群聊
    submitData(groupData) {
      this.editGroupShow = false;

      // cancel的情况，直接退出
      if (!groupData) {
        return;
      }

      // 还没写入文件。。。。。。。。。
      // 要发送到服务端来进行多端同步
     
      this.sendWebsocket(JSON.stringify(groupData));

      // 消息提示
      const h = this.$createElement;
      this.$notify({
        title: "标题名称",
        message: h("i", { style: "color: teal" }, "添加成功"),
      });
    },
    websocket() {
      // 1. 当点击发送按钮的时候给服务端发送请求 √
      // 2. 更新文件里的数据
      // 3. 把更新完的文件数据再次返回回来

      const ws = new WebSocket("ws://localhost:3000/");

      ws.onmessage = (event) => {
        // 接收信息
        // 1. 消息聊天的信息
        // 2. 创建/修改组的的变化

    
        let data = JSON.parse(event.data);

        // 如果有图片则是创建群
        if (JSON.parse(event.data).picture) {
          // 创建群
          console.log("New Group");

          console.log(this.dialogGroupData);
          this.dialogGroupData.push(data);


        } else {
          // 聊天
          console.log("dialog");

          delete data.groupName;

          this.currentDialogGroup.push({
            name: data.name,
            dialog: data.dialog,
          });

          this.$refs.dialog.scrollTo(0, 10000000);
        }
      };
    },
    sendWebsocket(data) {
      // 发送信息给服务端
      const ws = new WebSocket("ws://localhost:3000/");
      ws.onopen = () => {
        ws.send(data);
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
  width: 80%;
  height: 80%;
  min-width: 900px;
  margin: 100px auto 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ccc;
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
  /* background: red; */
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
  /* background: purple; */
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
}

.currentDialog .inputDialog {
  width: 100%;
  height: 150px;
  border-top: 1px solid #ccc;
  bottom: 0;
  position: absolute;
}
.currentDialog .dialog {
  padding: 10px;
  overflow-y: scroll;
  height: 450px;
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
