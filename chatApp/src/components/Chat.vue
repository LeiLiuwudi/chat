<template>
<div class="chat">
    <div class="top">
        <div class="img">
            <img src="../assets/images/wechat.jpg" alt="" width="70px" height="60px">
        </div>
        <div class="detail">
            <span>欢迎你，{{username}}</span>
            <img :src="dayPictureUrl" alt=""  style="margin-left:20px;margin-right:20px;">
            <span>{{currentTime}}</span>
        <Dropdown style="font-color:white;">
        <a href="javascript:void(0)">
            <img src="../assets/images/user.jpg" alt="" width=40px height=40px style="border-radius:40px;margin-left:20px;">
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem @click.native="changePassword">修改密码</DropdownItem>
            <DropdownItem @click.native="logout">退出登录</DropdownItem>
        </DropdownMenu>
    </Dropdown>
        </div>
    </div>
    <Modal
        v-model="change"
        title="修改密码"
        @on-ok="startChange"
        @on-cancel="cancel">
        <Form ref="form" :model="form" inline style="margin-left:25%" :rules="ruleInline">
        <FormItem prop="originalPassword" >
            <span>原密码：</span><Input type="password" v-model="form.originalPassword" placeholder="请输入原密码" >
            </Input>
        </FormItem>
        <FormItem prop="newPassword">
            新密码：<Input type="password" v-model="form.newPassword" placeholder="请输入新密码" >
            </Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="add"
        title="添加好友"
        @on-ok="startAdd"
        @on-cancel="cancel">
        请输入好友用户名：<Input type="text" v-model="newFriend" placeholder="好友用户名" >
            </Input>
    </Modal>
    <Menu   style="float:left;margin-top:60px;z-index:1;">
        <div style="margin-bottom:10px;margin-top:20px;">
            <Input placeholder="搜索" prefix='ios-search' style="width:85%;">
            </Input>
            <Icon type="ios-add" size='25' style="cursor:pointer;" @click="addFriend"/>
        </div>
        <MenuItem v-for='(friend,i) in friendsList' :name="i" class="item"  :key='i' style="border-bottom:1px solid black;" @click.native="push(friend.username)">
            <img src="../assets/images/machine.jpg" alt="" width="40px" height="40px" style="margin-right:20px;">
            <span style="float:right;">{{friend.username}}</span>
        </MenuItem>
    </Menu>
    <div style="position:fixed;margin-left:250px;margin-top:70px;">
        <router-view></router-view>
    </div>
</div>
</template>
<script>
    export default {
        data () {
            return {
                username:"",
                currentTime: this.formatDateToSecond(Date.now()), // 当前时间字符串
                dayPictureUrl: "", // 天气图片url
                weather: "", // 天气的文本
                change:false,
                add:false,
                newFriend:"",
                form:{
                    originalPassword:"",
                    newPassword:""
                },
                ruleInline: {
                    originalPassword: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不得少于6位', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不得少于6位', trigger: 'blur' }
                    ]
                },
                friendsList:[]
            }
        },
        created(){
            if(this.cookie.getCookie("username")==undefined){
                alert("请先登录")
                this.$router.push('/login')
            }
            else{
                this.username = this.cookie.getCookie("username")
            }
            // 获取天气
            this.$ajax.get('/weather')
            .then(response=>{
                this.weather = response.data.wea
                this.dayPictureUrl =  require('../assets/weather/'+response.data.wea_img+'.png')
            })
            //开启定时，每隔一秒获取当前时间
            this.intervalId = setInterval(() => {
                this.currentTime = this.formatDateToSecond(Date.now());
            }, 1000);
            // 获取好友列表
            this.$ajax.post('/api/getFriends',{
                username:this.username
            }).then(response => {
                this.friendsList = response.data
            })
        },
        methods: {
            formatDateToSecond(time) {
                if (!time) return ''
                let date = new Date(time)
                return date.getFullYear() + '-' +(String) (date.getMonth() + 1).padStart(2,'0') + '-' + (String)(date.getDate()).padStart(2,'0') +
                    '  ' + (String)(date.getHours()).padStart(2,"0") + ':' + (String)(date.getMinutes()).padStart(2,'0') + ':' +(String) (date.getSeconds()).padStart(2,'0')
            },
            changePassword(){
                this.change = true;
            },
            addFriend(){
                this.add = true;
            },
            startAdd(){
                let userExist = false
                for(let i=0;i<this.friendsList.length;i++){
                    if(this.friendsList[i].username == this.newFriend){
                        userExist = true
                        break
                    }
                }
                if(userExist){
                    alert("想要添加的好友已经在你的好友列表中，请勿重复添加")
                }
                else{
                    this.$ajax.post('/api/addFriend',{
                        username:this.username,
                        newFriend:this.newFriend
                    }).then(response =>{
                        if(response.data.code=="200"&&response.data.msg=="friendNotExist"){
                            alert("要添加的好友不存在")
                        }
                        else if(response.data.code=="200"&&response.data.msg=="addSuccess"){
                            alert("添加成功")
                            location.reload()
                        }
                    })
                }
            },
            startChange(){
                if(this.form.originalPassword.length<6||this.form.newPassword.length<6){
                    this.$refs.form.resetFields()
                    alert("输入的原密码或者新密码不符合要求，请返回重新修改")
                }
                else{
                    this.$ajax.post('/api/changePassword',{
                        username:this.username,
                        originalPassword:this.form.originalPassword,
                        newPassword:this.form.newPassword
                    }).then(response =>{
                        if(response.data.code=='200'&&response.data.msg=="originalError"){
                            this.$refs.form.resetFields()
                            alert("原密码输入错误")
                        }
                        else if(response.data.code=='200'&&response.data.msg=="changeSuccess"){
                            alert("密码修改成功，点击确定后，返回登录页")
                            this.cookie.clearCookie('username')
                            this.$router.push('/login')
                        }
                    })
                }
            },
            cancel(){
                this.change = false;
                this.add = false;
            },
            logout(){
                this.cookie.clearCookie('username')
                this.$router.push('/login')
            },
            push(username){
                this.$router.push('/interface?username='+username)
            }
        }
    }
</script>
<style>
.top{
    height:60px;
    background-color: rgb(0,135,255);
    width: 100%;
    position: fixed;
    z-index: 10;
}
.img{
    padding:0 35px;
    line-height: 60px;
}
.detail{
    color: white;
    font-family: '楷体';
    font-size:20px;
    float:right;
    margin-top:-80px;
}
.item{
    background-color: pink;
}
</style>