<template>
    <div class="dialogGroupItems" @click="giveParentMessage">
        <img :src="_props.picture" alt class="GroupPhoto" />
        <div class="message">
            <p>{{_props.groupName}}</p>
            <!-- <p>{{_props.lastDialog}}</p> -->
            <p></p>
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
            this.$emit("update:currentGroup",this._props.allData);
            this.$emit("update:currentDialogGroup",this._props.allData.data);
            this.$emit("update:currentDialogGroupName",this._props.allData.groupName);
            this.$emit("update:editGroupName",this._props.groupName);
 
            let dialogGroupItems = document.getElementsByClassName(
                "dialogGroupItems"
            );
        
            dialogGroupItems.forEach((element, index) => {
                this._props.index === index
                    ? element.classList.add("lightHeight")
                    : element.classList.remove("lightHeight");
            });
        }
    },
    created() {},
    props: ["picture", "groupName", "allData", "index"]
};
</script>

<style scoped>
.dialogGroupItems,
.lightHeight {
    width: 100%;
    height: 80px;
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
}

.lightHeight {
    background-image: linear-gradient(to right, #ccffff, #ccccff);
}

.GroupPhoto {
    width: 60px;
    height: 60px;
    margin: 10px 30px;
    border-radius: 50%;
    float: left;
}
.message {
    height: 100%;
    /* width: 50%; */
    float: left;
    padding: 10px 0;
}
.message p {
    width: 100%;
}
.message p:first-child {
    font-size: 20px;
    margin-bottom: 10px;
}

.message p:last-child {
    font-size: 14px;
}
</style>