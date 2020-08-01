<template>
    <div class="dialog-group-menu">
        <i class="el-icon-s-operation"></i>
        <el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="search"
        />
        <i class="el-icon-more-outline"></i>
    </div>
</template>

<script>
export default {
    data(){
        return {
            search: ""
        }
    }
};
</script>

<style lang="scss" scoped>
@import url(../assets/base.css);
$theme-icon-color: var(--theme-icon-color);
$top-height: 60px;

.dialog-group-menu {
    width: 100%;
    height: $top-height;
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
</style>
