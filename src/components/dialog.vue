<template>
    <div class="dialogGroupItems" @click="giveParentMessage">
        <img :src="_props.picture" alt class="GroupPhoto" />
        <div class="message">
            <p>{{ _props.groupName }}</p>
            <p>last dialog</p>
            <!-- <p>{{_props.lastDialog}}</p> -->    
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        giveParentMessage() {
            // 给父组件传值的
            this.$emit("update:currentGroup", this._props.allData);

            this.$emit("update:currentDialogGroup", this._props.allData.data);
            this.$emit(
                "update:currentDialogGroupName",
                this._props.allData.groupName
            );
            this.$emit("update:editGroupName", this._props.groupName);

            let dialogGroupItems = document.getElementsByClassName(
                "dialogGroupItems"
            );

            dialogGroupItems.forEach((element, index) => {
                this._props.index === index
                    ? element.classList.add("lightHeight")
                    : element.classList.remove("lightHeight");
            });
        },
    },
    created() {},
    props: ["picture", "groupName", "allData", "index"],
};
</script>

<style scoped lang="scss">
@import url(../assets/base.css);
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
                margin-bottom: 10px;
            }
            &:last-child {
                font-size: 14px;
                color: #333;
            }
        }
    }
}
</style>
