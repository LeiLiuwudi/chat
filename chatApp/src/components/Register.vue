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
            <Button type="primary" @click="handleSubmit()" >注册</Button>
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
            handleSubmit(name) {
                this.$refs.formInline.validate((valid) => {
                    if (valid) {
                        this.$ajax.post('/api/register',{
                            username:this.formInline.user,
                            password:this.formInline.password
                        }).then((response)=>{
                            if(response.data.code=="200"&&response.data.msg=="registerSuccess"){
                                alert("注册成功，点击确定后返回登录页面")
                                this.$router.push('/login')
                            }
                            else if(response.data.code=="200"&&response.data.msg=="userExist"){
                                alert("用户名已存在")
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