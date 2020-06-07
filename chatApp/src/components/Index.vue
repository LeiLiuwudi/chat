<template>
<div class="all">
    <div class="index">
        <Menu mode="horizontal" active-name="1" style="width:300px;margin:0 auto;">
        <MenuItem name="1" style="margin-left:50px;">
            <Icon type="ios-paper" />
            <router-link to="/login">登录</router-link>
        </MenuItem>
        <MenuItem name="2">
            <Icon type="ios-people" />
            <router-link to="/register">注册</router-link>
        </MenuItem>
       </Menu>
       <div style="padding:20px 60px 10px;">
           <router-view></router-view>
       </div>
    </div>
    
</div>
    
</template>
<script>
    export default {
        data () {
            return {
                theme1: 'light'
            }
        }
    }
</script>
<style>
.index{
    margin-top:200px;
    width:350px;
    padding:10px 0;
    margin:0 auto;
    background-color: white;
}
.all{
    background-image: url(../assets/images/background.jpg);
    background-size: 200% 100%;
    padding:12% 0;
}
</style>
