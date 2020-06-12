<template>
  <div class="addGroup" @click="cancelEdit">
    <div class="addGroupBox">
      <img :src="picture" alt="" width="100" height="100" class="picture" />
      <section>
        <p>群头像</p>
        <el-input v-model="picture" placeholder="请输入头像连接"></el-input>
      </section>

      <section>
        <p>群名</p>
        <el-input v-model="input" placeholder="请输入群名"></el-input>
      </section>

      <section>
        <p>群成员</p>
        <el-tag
          v-for="tag in groupMembers"
          :key="tag"
          closable
          @close="handleClose(tag)"
          >{{ tag }}</el-tag
        >
      </section>

      <section>
        <p>群标签</p>
        <el-tag type="success" v-for="item in groupTags" :key="item">{{
          item
        }}</el-tag>
      </section>

      <el-button type="success" size="medium " @click="submitData">{{
        edit
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "", // 群名
      picture:
        "https://pic1.zhimg.com/80/v2-0d3a635ba2703360e0aac4afc71e91b2_720w.jpg", // 头像
      groupMembers: ["青空", "水无月一见", "白鸟留依"], // 群成员
      groupTags: ["交流群", "Vue"], // 群标签
      edit: "创建",
    };
  },
  methods: {
    handleClose(tag) {
      this.groupMembers.splice(this.groupMembers.indexOf(tag), 1);
    },
    submitData() {
      let GroupData = {
        groupName: this.input,
        picture: this.picture,
        groupMembers: this.groupMembers,
        groupTags: this.groupTags,
        data: [],
        lastDialog: "",
      };

      if (this._props.editData) {
        GroupData.state = "edit";
        this.$emit("submitData", GroupData);
        return;
      }

      GroupData.state = "new";
      // -------------------------------
      this.$emit("submitData", GroupData);
    },
    cancelEdit() {
      if (event.target.className === "addGroup") {
        this.$emit("submitData", false);
      }
    },
  },
  created() {
    if (this.editData) {
      this.input = this._props.editData.groupName;
      this.picture = this._props.editData.picture;
      this.groupMembers = this._props.editData.groupMembers;
      this.groupTags = this._props.editData.groupTags;
      this.edit = "修改";
    }
  },
  props: ["editData"],
};
</script>

<style scoped>
.addGroup {
  width: 100%;
  height: 100%;
  background: rgba(000, 000, 000, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addGroupBox {
  box-sizing: border-box;
  padding: 10px 10px 20px 10px;
  width: 400px;
  position: relative;
  background: #fff;
  border-radius: 10px;
}

.addGroupBox .picture {
  width: 100px;
  height: 100px;
  display: block;
  margin: -50px auto 0;
  border-radius: 50%;
}

.addGroupBox section {
  margin: 20px 0;
}
.addGroupBox section p {
  margin-bottom: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
