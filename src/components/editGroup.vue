<template>
    <div class="addGroup">
        <div class="addGroupBox">

            <img :src="picture" alt="" width="100" height="100" class="picture">
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
                >{{tag}}</el-tag>
            </section>

            <section>
                <p>群标签</p>
                <el-tag type="success" v-for="item in groupTags" :key="item">{{item}}</el-tag>
            </section>

            <el-button type="success" size="medium " @click="submitData">创建</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: "",      // 群名 
            picture: "http://b-ssl.duitang.com/uploads/item/201807/06/20180706112153_kYsVd.thumb.700_0.jpeg",    // 头像
            groupMembers: ["青空", "水无月一见", "白鸟留依"], // 群成员
            groupTags: ["交流群","Vue"] // 群标签
        };
    },
    methods: {
        handleClose(tag) {
            this.groupMembers.splice(this.groupMembers.indexOf(tag), 1);
        },
        submitData(){
            let GroupData = {
                groupName: this.input,
                picture: this.picture,
                groupMembers: this.groupMembers,
                groupTags: this.groupTags,
                data:[],
                lastDialog: ""
            }
            this.$emit("submitData",GroupData)
        }
    }
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
    padding:10px 10px 20px 10px;
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