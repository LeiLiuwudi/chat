<template>
<div class="interface">
    <div class="head">
        <span>{{username}}</span>
    </div>
    <div class="talk_con2">
        <!-- 显示区域 -->
        <div class="talk_show" id="words">
        <!-- 根据vue对象中的数组，遍历出对应的标签。 -->
        <div v-for="(i,k) in arr" :class="i.person=='guest'?'atalk':'btalk'">
        <div v-if="show[k]" style='margin:20px 50%;'>{{currentTime[k]}}</div>
        <img v-if="i.person=='guest'" src="../assets/images/machine.jpg" alt="" style="width:30px;height:30px;border-radius:30px;">
        <img v-else src="../assets/images/user.jpg" alt="" style="width:30px;height:30px;border-radius:30px;">
        <div :class="i.person=='guest'? 'amove':'bmove'">
            <div v-if="i.person=='guest'">{{username}}</div>
            <div v-else>{{cookieUsername}}</div>
            <span>{{ i.words }}</span>
        </div>
        </div>
        </div>

        <!-- 发送内容区域 -->
        <div class="talk_input">
        <!-- 请输入内容 -->
        <input type="text" class="talk_word" id="talkwords" v-model='str2' @keyup.enter="add_data()">
        <!-- 按钮 -->
        <input type="button" value="发送" class="talk_sub" id="talksub" @click="add_data()">
        </div>
    </div>
</div>
</template>
<script>
    export default {
        data () {
            return {
                username:"",
                arr:[],
                show:[],
                str2:"",
                cookieUsername:"",
                currentTime:[],
                originalTime:{},
            }
        },
        methods:{
            add_data: function(){
                    // bug: 内容不能为空。
                    if(this.str2 == ''){
                        alert('请输入内容...')
                        return;
                    }

                    // alert(111)
                    // 思路: 页面中遍历一个数组(对象),页面中就会有很多标签。将来添加标签，就是
                    // 数组中添加数据。
                    //     数组中的数据: 元素:  1.谁说的。   2.说的啥。(描述多条信息，用对象/字典)
                    //         数组中放入对象(默认两条数据):    [{}, {}, {person:'A/B', words:'...'}]

                    // 点击按钮之后，组成一个元素，放入数组中。
                    // alert(this.str1) // 0/1
                    // alert(this.str2)
                    var obj = {person: 'host', words: this.str2}
                    if(this.arr.length==0){
                        let obj1 = Date.now()
                        this.currentTime[this.arr.length] = this.formatTime(obj1)
                        this.originalTime = new Date(obj1)
                        this.show[this.arr.length] = true
                    }
                    else{
                        let obj1 = Date.now()
                        let currentObj1 = new Date(obj1)
                        if(parseInt(currentObj1 - this.originalTime) / 1000 / 60>=1){
                            this.currentTime[this.arr.length] = this.formatTime(obj1)
                            this.originalTime = new Date(obj1)
                            this.show[this.arr.length] = true
                        }
                        else{
                            this.currentTime[this.arr.length] = this.currentTime[this.arr.length-1]
                            this.show[this.arr.length] = false;
                        }
                    }
                    this.arr.push(obj)
                    this.$ajax.get('/AI?key=free&msg='+this.str2).then(response=>{
                        obj = {
                            person:'guest',
                            words:response.data.content
                        }
                        let obj1 = Date.now()
                        let currentObj1 = new Date(obj1)
                        if(parseInt(currentObj1 - this.originalTime) / 1000 / 60>=1){
                            this.currentTime[this.arr.length] = this.formatTime(obj1)
                            this.originalTime = new Date(obj1)
                            this.show[this.arr.length] = true
                        }
                        else{
                            this.currentTime[this.arr.length] = this.currentTime[this.arr.length-1]
                            this.show[this.arr.length] = false;
                        }
                        this.arr.push(obj)
                    })
                    // 添加完内容，清空
                    this.str2 = ''
                },
                formatTime(time) {
                    if (!time) return ''
                    let date = new Date(time)
                    return (String)(date.getHours()).padStart(2,"0") + ':' + (String)(date.getMinutes()).padStart(2,'0')
                },

        },
        created(){
            this.username = this.$route.query.username
            this.cookieUsername = this.cookie.getCookie("username")
            // console.log(this.username)
        },
        watch:{
            $route(to,from) {
                let storeObj = {
                    arr:this.arr,
                    show:this.show,
                    currentTime:this.currentTime,
                }
                window.localStorage.setItem(this.username+"and"+this.cookieUsername, JSON.stringify(storeObj))
                this.username = this.$route.query.username
                if(window.localStorage.getItem(this.username+"and"+this.cookieUsername)!=null){
                    let getObj =  JSON.parse(window.localStorage.getItem(this.username+"and"+this.cookieUsername))
                    this.arr = getObj.arr
                    this.show = getObj.show
                    this.currentTime = getObj.currentTime
                }
                else{
                    this.arr = []
                    this.show = []
                    this.currentTime = []
                }
            },
        },
    }
</script>
<style lang='scss' scoped>
.interface{
    width:1000px;
    height:540px;
    /* border:1px solid black; */
}
.head{
    font-family:'楷体';
    font-size:30px;
    border-bottom:1px solid grey;
    text-align: center;
    color:white;
    background-color: grey;
}
.content{
    height:300px;
    background-color: rgb(255,255,255);
}
 .talk_con1{
    width:600px;
    height:500px;
    border:1px solid #666;
    margin: 30px;
    float: left;
    background:#e98080;
}

.talk_con2{
    width:950px;
    height:500px;
    border:1px solid #666;
    margin: 0 30px;
    float: right;
    background:#7adbd3;
}
.talk_show{
    width:930px;
    height:420px;
    border:1px solid #666;
    background:#fff;
    margin:10px auto 0;
    overflow:auto;
    // padding-top:25px;
}
.talk_input{
    width:580px;
    margin:10px auto 0;
}
.whotalk{
    width:80px;
    height:30px;
    float:left;
    outline:none;
}
.talk_word{
    width:420px;
    height:26px;
    padding:0px;
    float:left;
    margin-left:10px;
    outline:none;
    text-indent:10px;
}        
.talk_sub{
    width:56px;
    height:30px;
    float:left;
    margin-left:10px;
}
.atalk{
    margin:30px; 
}
.atalk span{
    display:inline-block;
    background:#0181cc;
    border-radius:10px;
    color:#fff;
    padding:5px 10px;
}
.btalk{
    margin:30px;
    text-align:right;
}
.btalk span{
    display:inline-block;
    background:#ef8201;
    border-radius:10px;
    color:#fff;
    padding:5px 10px;
}
.amove{
    margin-left:40px;
    margin-top:-55px;
}
.bmove{
    margin-right:40px;
    margin-top:-55px;
}
</style>