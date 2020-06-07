<template>
<div class="form">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="user">
            <Input type="text" v-model="formInline.user" placeholder="用户名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem style="margin:0 35%;">
            <Button type="primary" @click="handleSubmit()" >登录</Button>
        </FormItem>
    </Form>
</div>
</template>
<script>
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不得少于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.formInline.validate((valid) => {
                    if (valid) {
                        this.$ajax.post('/api/login',{
                            username:this.formInline.user,
                            password:this.formInline.password
                        }).then((response)=>{
                            if(response.data.code=="200"&&response.data.msg=="OK"){
                                let loginInfo = {
                                    username:this.formInline.user
                                }
                                this.cookie.setCookie(loginInfo,2)
                                this.$router.push('/chat')
                            }
                            else if(response.data.code=="200"&&response.data.msg=="userNull"){
                                alert("用户名不存在")
                            }
                            else if(response.data.code=="200"&&response.data.msg=="passwordError"){
                                alert("密码不正确")
                            }
                        });
                    } else {
                        this.$Message.error('用户名或密码不合乎规则');
                    }
                })
            }
        }
    }
</script>
<style>
.form{
    margin:20px 0;
}
</style>