<template>
     <div class="box">
        <div class="registerBox" ref="registerBox">
            <h1>Air Dialog</h1>
            <p>让对话更简单:{{register == true ? "登录":"注册"}}</p>
            

            <div class="formBox">
                <!-- 提交链接还没处理 -->

                <form :action="register == true ? 'http://localhost:3000/signIn' : 'http://localhost:3000/register'" method="POST">
                    <label>{{register == true ? "账号":"设置账号"}}</label>
                    <input type="text" name="id" v-model="name"> 
                    <label>{{register == true ? "密码":"设置密码"}}</label>   
                    <input type="password" name="password">

                    <div class="sureBox">
                        <input type="submit" name="" :value="register == true ? '登录':'注册'" @click="nowName"> 
                        <input type="button" name="" :value="register == true ? '去注册':'去登录'" @click="registerAnimate">
                    </div>

                </form>
            </div>




        </div>
     </div>

</template>

<script>
export default {
    data() {
        return {
            register: true,     // true为登录，false为注册
            name: "",
        };
    },
    methods: {
        registerAnimate(){
            // 改为动画钩子
            if (this.register) {
                this.$refs.registerBox.style.transform = "rotateY(360deg)";
            }else {
                this.$refs.registerBox.style.transform = "rotateY(0deg)";
            }
            this.register = !this.register;
            
        },
        nowName(){
            sessionStorage.setItem("nowName",this.name);
        }
    },

};
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /*background: #000;*/
    transform: preserve-3d;

}
.registerBox {
    /*background: #fff;*/
    padding:50px 20px;
    width: 400px;
    height: 600px;
    box-shadow: -5px -5px 20px #FFFFCC,-5px -5px 20px #FFFFCC,5px 5px 20px #CCFFFF,5px 5px 20px #CCFFFF;
    text-align: center;
    transition: all .5s;
    transform: rotateY(0deg);

}

.registerBox h1{
    margin: 20px;
}


.registerBox .formBox {
    margin-top: 50px;
}

.registerBox label {
    display: block;
    text-align: left;
    font-size: 18px;
    line-height: 50px;
}

.registerBox input {
    width: 100%;
    height: 50px;
    border-radius: 20px;
    border: 1px solid skyblue;
    outline: none;
    margin-bottom: 30px;
    padding: 0 20px;
    font-size: 20px;

}

.registerBox .sureBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

.sureBox input {
    width: 70px;
    height: 70px;
    line-height: 100%;
    color: skyblue;
    background: white;
    border-radius: 50%;
    font-size:20px;
    padding: 0;
}


</style>