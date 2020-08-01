<template>
    <div class="file">
        <search />
        <el-upload
            class="upload-demo"
            action="http://localhost:3000/fileUpload"
            :file-list="fileList"
            :http-request="upload"
        >
            <el-button>点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fileList: [
                {
                    name: "food.jpeg",
                    url: "https://fuss10.elemecdn.com/",
                },
            ],
        };
    },
    methods: {
        upload(files) {
            let reads = new FileReader();
            const file = files.file;
            reads.readAsDataURL(file);
            reads.onloadend = (event) => {
                this.axios.post(`/fileUpload/${file.name}`, {
                    fileName: file.name,
                    body: event.target.result,
                });
            };
        },
    },
};
</script>

<style lang="scss">
.file {
    padding: 10px;
    .el-upload {
        width: 100%;
        .el-button {
            width: 100%;
            background: var(--theme-color);
            color: var(--theme-text-color);
        }
    }
}
</style>
