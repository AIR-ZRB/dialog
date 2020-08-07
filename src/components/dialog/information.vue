<template>
    <div :class="_props.nowName == _props.name ? 'fr' : 'dialogMessage'">
        <p class="id">{{ name }}</p>
        <p class="dialog">{{ dialog }}</p>
    </div>
</template>

<script>
export default {
    props: ["name", "dialog", "nowName"],
};
</script>

<style scoped lang="scss">
@import url(../../assets/base.css);
.dialogMessage,
.fr {
    overflow: hidden;
    margin-bottom: 10px;
    font-size: 18px;
    width: 100%;
    .id {
        font-size: 16px;
        color: #999;
        margin-bottom: 10px;
    }
    .dialog {
        // width: 120px;
        height: 50px;
        padding: 10px 20px;
        background: var(--theme-dialog-rests-color);
        color: var(--theme-dialog-rests-text-color);
        word-break: break-all;
        float: left;
        border-radius: 10px;
    }
}

.fr {
    display: grid;
    place-items: end;
    margin-left: auto;
    .dialog {
        background: var(--theme-dialog-oneself-color);
        color: var(--theme-dialog-oneself-text-color);
    }
}
</style>
