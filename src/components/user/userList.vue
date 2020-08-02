<template>
    <div
        :class="['user-list', _props.message.active ? 'heightLight' : '']"
        @click="userMessage"
        v-clickActive
        :data-name="_props.message.id"
    >
        <img :src="_props.message.picture" class="list-picture" />
        <div class="message">
            <p>{{ _props.message.id }}</p>
            <p>当前在线</p>
        </div>
    </div>
</template>

<script>
import Bus from "../../bus";
export default {
    props: ["message"],
    data() {
        return {
            userList: this.$root.userList,
        };
    },
    methods: {
        userMessage() {
            this.$root.userList.forEach((item) => {
                item.active = false;
            });
            this.$root.userList.forEach((item) => {
                if (item.id === this._props.message.id) item.active = true;
            });
            Bus.$emit("getUserMessage", this._props.message);
        },

      
    },
    directives: {
        clickActive: {
            inserted(el) {
                const nowName = sessionStorage.getItem("nowName");
                el.dataset.name === nowName && el.click();
            },
        },
    },
};
</script>

<style lang="scss" scoped>
@import url(../../assets/base.css);
.user-list {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;

    img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
    }
    .message {
        margin-left: 10px;
    }
}

.heightLight {
    border-left: 5px solid var(--theme-color);
    background: var(--theme-light-color);
}
</style>
