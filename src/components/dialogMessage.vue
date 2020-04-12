<template>
    <div class="dialogMessage">
        <p class="id">{{name}}</p>
        <p class="dialog">{{dialog}}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: ["name", "dialog"]
};
</script>

<style scoped>
.dialogMessage {
    overflow: hidden;
    margin-bottom: 10px;
     font-size: 18px;
}

.dialogMessage .id {
    font-size: 16px;
    color: #999;
    margin-bottom: 10px;
}
.dialogMessage .dialog {
 
    padding: 10px 20px;
    background-image: linear-gradient(#66CCFF,#CCFFFF);
    float: left;
    border-radius: 10px;
}
</style>