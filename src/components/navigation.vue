<template>
    <nav>
        <div class="menu-list">
            <i
                v-for="(item, index) in listMenu"
                :key="item.name"
                :class="[item.icon, item.active == true ? 'heightLight' : '']"
                :title="item.name"
                v-iconActive
                @click="() => iconHeightLight(index)"
            />
            <i class="el-icon-plus" title="添加群" @click="addGroup"></i>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            listMenu: [
                { name: "会话", icon: "el-icon-chat-round", active: true },
                { name: "联系人", icon: "el-icon-user", active: false },
                { name: "收藏", icon: "el-icon-receiving", active: false },
                { name: "文件", icon: "el-icon-folder-opened", active: false },
            ],
        };
    },
    methods: {
        iconHeightLight(index) {
            this.listMenu.forEach((item) => (item.active = false));
            this.listMenu[index].active = true;
        },
        addGroup() {
            this.$emit("clickActiveGroup", "add");
        },
    },
    directives: {
        iconActive: {
            inserted(el, binding, vnode) {
                if (vnode.key === vnode.context.listMenu[0].name) {
                    el.click();
                }
            },
        },
    },
};
</script>

<style scoped lang="scss">
@import url(../assets/base.css);
nav {
    width: 100%;
    justify-content: center;
    padding: 20px 0;

    .menu-list {
        text-align: center;
        i {
            font-size: 36px;
            color: var(--theme-icon-color);
            margin: 20px 0;
            cursor: pointer;
            &.heightLight {
                color: var(--theme-color);
            }
        }
    }
}
</style>
