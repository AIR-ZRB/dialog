<template>
    <div class="particulars">
        <div class="card">
            <img :src="message.picture" alt="" />
            <div>
                <h3>{{ message.id }}</h3>
                <ul>
                    <li>账号：1057605824</li>
                    <li>姓名：{{ message.id }}</li>
                    <li>性别：{{ message.sex }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Bus from "../../bus";
export default {
    data() {
        return {
            message: {},
        };
    },
    created() {
        Bus.$on("getUserMessage", (data) => {
            this.message = data;
        });
    },
};
</script>

<style scoped lang="scss">
@import url(../../assets/base.css);
.particulars {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--theme-light-color);
    .card {
        width: 60%;
        height: 90%;
        background: #fff;
        margin: 50px auto;
        border-radius: 20px;
        padding: 0 0 10px 0;
        img {
            width: 100%;
            height: 70%;
        }
        h3 {
            text-align: center;
            font-size: 26px;
            margin: 20px 0;
        }
        ul {
            width: 200px;
            margin: auto;
            li {
                list-style: none;
                // text-align: center;
                margin: 10px 0;
                font-size: 16px;
            }
        }
    }
}
</style>
