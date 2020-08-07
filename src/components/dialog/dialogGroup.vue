<template>
    <div
        :class="['dialogGroupItems', _props.group.active ? 'lightHeight' : '']"
        @click="giveParentMessage"
    >
        <img :src="_props.group.picture" alt class="GroupPhoto" />
        <div class="message">
            <p>{{ _props.group.groupName }}</p>
            <p>{{ lastDialog }}</p>
        </div>
    </div>
</template>

<script>
import Bus from "../../bus";
export default {
    props: ["group", "allData"],
    computed: {
        // 筛选最后一句话
        lastDialog() {
            // let user = this._props.group.data.length;
            // let dialog = this._props.group.data[user - 1].dialog;
            // if (user && dialog) {
            //     user = this._props.group.data[user - 1].name;
            //     return `${user}：${dialog}`;
            // }
            // console.log(dialog)

            return ``;
        },
    },
    methods: {
        giveParentMessage() {
            // 给父组件传值的
            this._props.allData.forEach((element) => {
                element.active = false;
            });
            this._props.group.active = true;
            Bus.$emit("currentGroupMessage", this._props.group);
        },
    },
};
</script>

<style scoped lang="scss">
@import url(../../assets/base.css);
.lightHeight {
    border-left: 5px solid var(--theme-color);
    background: var(--theme-light-color);
}
.dialogGroupItems {
    width: 100%;
    height: 70px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    .GroupPhoto {
        width: 56px;
        height: 56px;
        border-radius: 50%;
    }
    .message {
        margin: 0 0 0 10px;
        p {
            &:first-child {
                font-size: 20px;
            }
            &:last-child {
                font-size: 14px;
                color: #333;
            }
        }
    }
}
</style>
