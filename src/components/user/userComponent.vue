<template>
    <div class="user-message">
        <div class="sidebar">
            <search />
            <userList
                v-for="item in $root.userList"
                :key="item.id"
                :name="item.id"
                :picture="item.picture"
            />
        </div>
        <main>
            <particulars />
        </main>
    </div>
</template>

<script>
import userList from "./userList";
import particulars from "./particulars";
export default {
    components: {
        userList,
        particulars,
    },
};
</script>

<style scoped lang="scss">
.user-message {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 25% 75%;
}
</style>
