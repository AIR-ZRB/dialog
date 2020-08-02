<template>
    <div class="collect">
        <search />
        <el-upload
            action="http://localhost:3000/pictureUpload"
            list-type="picture-card"
            :multiple="true"
            :http-request="upload"
            :on-preview="handlePictureCardPreview"
            :beforeUpload="beforeAvatarUpload"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <div class="picture-list">
            <ul>
                <li v-for="item in fileList" :key="item">
                    <img :src="item" />
                </li>
            </ul>
        </div>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogImageUrl: "", // 查看图片的URL
            dialogVisible: false, // 查看图片是否显示
            fileList: [],
        };
    },
    methods: {
        // 文件查看
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        upload(files) {
            let reads = new FileReader();
            const file = files.file;
            reads.readAsDataURL(file);
            reads.onloadend = (event) => {
                this.axios.post(`/pictureUpload/${file.name}`, {
                    fileName: file.name,
                    body: event.target.result,
                });
            };
            console.log(this.fileList);
        },
        // 重写上传方法（把限制大小调正到10MB）
        beforeAvatarUpload(file) {
            let isLt2M = file.size / 1024 / 1024 > 10;
            if (isLt2M) {
                this.$message({
                    message: "上传文件大小不能超过 10MB!",
                    type: "warning",
                });
            }
            // return isLt2M;
        },
        async getPictureUrl() {
            const data = await this.axios.get("/getPictureUrl");

            data.data.forEach((item) => {
                item = "http://localhost:3000/getPicture/" + item;
                this.fileList.push(item);
                console.log(item);
            });
        },
    },
    created() {
        this.getPictureUrl();
    },
};
</script>

<style lang="scss">
.collect {
    padding: 10px;
    overflow-y: scroll;
    .el-upload {
        width: 100%;
        .el-button {
            width: 100%;
            background: var(--theme-color);
            color: var(--theme-text-color);
        }
    }
    .el-upload-list {
        .el-upload-list__item {
            width: 20%;
            height: 100%;
        }
    }
    .picture-list {
        margin-top: 20px;
        ul {
            column-count: 3;
            column-gap: 20px;
            width: 100%;
            li {
                margin: 10px 0;
                width: 100%;
                list-style: none;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: #ccc 0px 0px 20px;
                }
            }
        }
    }
}
</style>
