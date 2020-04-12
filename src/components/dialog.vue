<template>
    <div class="dialogGroup" @click="giveParentMessage">
        <img :src="_props.picture" alt class="GroupPhoto" />
        <div class="message">
            <p>{{_props.groupName}}</p>
            <p>{{_props.lastDialog}}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
       giveParentMessage(){
           // 给父组件传值的
           this.$emit("givePrantMessage",this._props.allData)
       }
    },
    created() {
        // console.log(this._props);
    },
    props: ["picture", "lastDialog", "groupName","allData"]
};
</script>

<style scoped>
.dialogGroup {
    width: 100%;
    height: 80px;
    background:rgba(255, 255, 255,.8);
    cursor: pointer;
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