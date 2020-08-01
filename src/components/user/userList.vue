<template>
    <div class="user-list">
        <img :src="_props.picture" class="list-picture" />
        <div class="message">
            <p>{{ _props.name }}</p>
            <p>当前在线</p>
        </div>
    </div>
</template>

<script>
export default {
    props: ["picture", "name"],
};
</script>

<style lang="scss" scoped>
.user-list {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0 10px;

    img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
    }
    .message {
        margin-left: 10px;
    }
}
</style>
