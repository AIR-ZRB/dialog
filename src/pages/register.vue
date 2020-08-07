<template>
    <div class="box">
        <transition>
            <div class="registerBox" v-if="boxShow">
                <div class="input-box">
                    <h1>Air Dialog</h1>
                    <div class="formBox">
                        <div class="input-field">
                            <input type="text" v-model.trim="name" />
                            <span>
                                <i class="el-icon-message"></i>
                                邮箱
                            </span>
                            <el-link
                                type="primary"
                                :underline="false"
                                v-if="!register"
                                @click="outputEmail"
                                :disabled="verificationTimer"
                                >{{ verificationEmailText }}</el-link
                            >
                        </div>
                        <div class="input-field">
                            <input type="password" v-model.trim="password" />
                            <span>
                                <i class="el-icon-magic-stick"></i>
                                密码
                            </span>
                        </div>

                        <div class="input-field" v-if="!register">
                            <input
                                type="text"
                                v-model.trim="verificationCode"
                            />
                            <span>
                                <i class="el-icon-magic-stick"></i>
                                验证码
                            </span>
                        </div>

                        <div class="sureBox">
                            <input
                                type="submit"
                                :value="register == true ? '登录' : '注册'"
                                @click="signIn"
                            />
                            <el-link
                                type="primary"
                                :underline="false"
                                @click="registerAnimate"
                                >{{ signInText }}</el-link
                            >
                        </div>
                    </div>
                </div>

                <div class="right-banner">
                    <h2>应用介绍</h2>
                    <p>还属于测试阶段</p>
                    <p>发邮件验证注册邮箱</p>
                    <p>页面关闭聊天信息清空</p>
                    <p>可上传图片/文件</p>
                    <p>可查看当前在线用户</p>
                    <p>目前只支持群聊模式</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            register: true, // true为登录，false为注册
            boxShow: true,
            verificationTimer: false,
            verificationEmailText: "发送验证码",
            name: "",
            password: "",
            verificationCode: "",
        };
    },
    computed: {
        signInText() {
            return this.register ? "还没有账号？去注册" : "已有账号？登录";
        },
    },
    methods: {
        // 发送登录/注册请求
        async signIn() {
            let address = this.register ? "/signIn" : "/register";
            const flag = await this.axios.post(address, {
                id: this.name,
                password: this.password,
                verificationCode: this.verificationCode,
            });

            if (flag.data) {
                this.$message.success({ message: "登录成功" });
                sessionStorage.setItem("nowName", this.name);
                this.$router.push("/index/dialog");
            } else {
                this.$message.error({ message: "账号/密码/验证码错误" });
            }
        },
        // 注册/登录动画切换
        registerAnimate() {
            this.register = !this.register;
            this.boxShow = false;
            setTimeout(() => (this.boxShow = true), 300);
        },
        // 发送邮件
        outputEmail() {
            this.axios.post("/sendEmail", { id: this.name });
            this.verificationTimer = true;
            let sum = 0;
            let timer = setInterval(() => {
                sum += 1;
                this.verificationEmailText = `${sum}秒后重试`;
                if (sum >= 60) {
                    this.verificationTimer = false;
                    clearInterval(timer);
                    this.verificationEmailText = `发送验证码`;
                }
            }, 1000);
        },
    },
};
</script>

<style scoped lang="scss">
.box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: preserve-3d;
    transition: all 0.3s;
}
.registerBox {
    padding: 50px 20px;
    width: 900px;
    // background:;
    // opacity:;
    transition: all 0.5s;
    background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0)
        ),
        url(../server/uploads/images/origin_201912152327203428.jpg);
    box-shadow: #ccc 0px 0px 10px;
    text-align: center;
    transition: all 0.5s;
    transform: rotateY(0deg);
    border-radius: 20px;
    display: flex;
    .right-banner {
        width: 50%;
        height: 100%;
        h2 {
            margin-bottom: 20px;
        }
        p {
            line-height: 40px;
        }
    }
}

.input-box {
    width: 50%;
    .formBox {
        margin-top: 50px;
    }
    .input-field {
        width: 400px;
        margin: 0 auto;
        position: relative;
        height: 50px;
        margin-bottom: 20px;
        span {
            position: absolute;
            top: 50%;
            font-size: 18px;
            margin-top: -14px;
            left: 10px;
        }
        .el-link {
            position: absolute;
            right: 0;
            top: 50%;
            font-size: 16px;
            margin-top: -12px;
        }
        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            border: none;
            border-bottom: 1px solid #000;
            outline: none;
            background: transparent;
            margin-bottom: 30px;
            padding-left: 80px;
            font-size: 18px;
        }
        &:nth-of-type(3) {
            input {
                padding-left: 100px;
            }
        }
    }

    .sureBox {
        width: 100%;
        input {
            width: 400px;
            height: 50px;
            border-radius: 150px;
            border: 1px solid #000;
            outline: none;
            background: transparent;
            margin-bottom: 10px;
            padding: 0 20px;
            font-size: 20px;
        }
        .el-link {
            display: block;
        }
    }
}
.v-enter-active,
.v-leave-active {
    transform: translateX(0);
}
.v-enter,
.v-leave-to {
    transform: translateX(200%);
}
</style>
