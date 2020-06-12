<template>
    <div :class="_props.nowName == _props.name ? 'fr' :'dialogMessage'">
        <p class="id">{{name}}</p>
        <p class="dialog">{{dialog}}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: ["name", "dialog", "nowName"]
};
</script>

<style scoped>
.dialogMessage,
.fr {
    overflow: hidden;
    margin-bottom: 10px;
    font-size: 18px;
    width: 100%;
    float: left;
}

.fr {
    display: grid;
    place-items: end;
    margin-left: auto;
}

.id {
    font-size: 16px;
    color: #999;
    margin-bottom: 10px;
}
.dialog {
    padding: 10px 20px;
    background-image: linear-gradient(#66ccff, #ccffff);
    word-break: break-all;
    float: left;
    border-radius: 10px;
}
</style>