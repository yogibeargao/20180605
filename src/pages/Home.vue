<template>
  <r-page>
      <top title="主页"/>
      <r-body>
      <r-image :list="head"/>
      <div style='margin-top:-15px' v-if="user.userType==0 || user.userType==1">
           <r-card title="消息列表" :list="cardList"/>
      </div>
            <div :style="styleClass">
      <r-card title="功能列表">
        <r-grid :data='gridItems'/>
      </r-card>
            </div>
      </r-body>
      <r-dialog :model="this" value="shareShow">
            <r-button :onClick="goto">点击响应{{fkSharedRecordCreater}}</r-button>
      </r-dialog>
  </r-page>
</template>

<script>
import index from "../assets/top.gif";
import Util from "../util/util";
export default {
  data() {
    return {
      shareShow:false,
      fkSharedRecordCreater:null,
      shareId:null,
      user:{},
      head:[
        {"class":"index","src":index}
      ],
      styleClass:"",
      cardList: [],
      gridItems: [],
      gridData: [
        { 'text': '签到提交','code':'tjqd','link':'/location?type=sign'},
        { 'text': '位置响应','code':'wzxy','link':'/share'},
        { 'text': '实习单位','code':'sxdw','link':'/company'},
        { 'text': '实习记录','code':'sxjl','link':'/record'},
        { 'text': '实习总结','code':'sxzj','link':'/summary'},
        { 'text': '实习成绩','code':'sxcj','link':'/score'},
        { 'text': '实习表现','code':'sxbx','link':'/performance'},
        { 'text': '信息发布','code':'xxfb','link':'/publish'},
        { 'text': '学生总结','code':'xszj','link':'/summary/list'},
        { 'text': '学生考勤','code':'zskq','link':'/location/list'},
        { 'text': '学生记录','code':'xsjl','link':'/record/list'},
        { 'text': '请假审批','code':'qjsp','link':'/ill/list'},
        { 'text': '学生成绩','code':'xscj','link':'/score/list'},
        { 'text': '发起共享','code':'fqgx','link':'/share/create'},
        { 'text': '查看共享','code':'ckgx','link':'/share/list'},
        { 'text': '更换手机','code':'ghsj','link':'/phone/list'},
        { 'text': '实习评价','code':'sxpj','link':'/performance/List'},
        { 'text': '个人信息','code':'grxx','link':'/personal'},
        { 'text': '修改密码','code':'xgmm','link':'/password'},

      ]
    };
  },
  watch:{
    user(){
        this.styleClass = this.user.userType!=0?"":'margin-top:5px';
    }
  },
  methods :{
     goto(){
        window.location.hash='/location/detail?shareId='+this.shareId
     },
      getFuncations(){
          const functions = this.$route.params.functions;
          if(_.isEmpty(functions)){
            const functions = JSON.parse(sessionStorage.getItem("functions"));
            if(!_.isEmpty(functions)){
              return functions;
            }
          }else{
            return functions;
          }
      }
  },
  async mounted(){
            this.user = JSON.parse(sessionStorage.getItem("user"));
            const identityId = Util.getIdentityId(this);
            const isStudent = Util.isStudent(this);
            const isTeacher = Util.isTeacher(this);
            if(isStudent){
                  const sharing_url = `location/sharing/unresponsed?studentNo=${identityId}`;
                  const sharing = await this.$http.get(sharing_url);
                  if(!_.isEmpty(sharing.body)){
                        this.fkSharedRecordCreater = sharing.body.fkSharedRecordCreater;
                        this.shareId = sharing.body.id;
                        this.shareShow=true;
                  }
                  const location_url = `location/sharing/count?studentNo=${identityId}`;
                  const location = await this.$http.get(location_url);
                  const message_url = `message/count?identityId=${identityId}`;
                  const message = await this.$http.get(message_url);
                  const article_url = `article/count?identityId=${identityId}`;
                  const article = await this.$http.get(article_url);
                  const leave_url = `leave/count?identityId=${identityId}`;
                  const leave = await this.$http.get(leave_url);
                  this.cardList=[
                    { 'link': '/notes', 'number': article.body,'text': '实习公告' },
                    { 'link': '/notes?type=message', 'number': message.body,'text': '实习消息' }
                    //,{ 'link': '/share', 'number': location.body,'text': '共享消息' }
                    //{ 'link': '/ill/list', 'number': leave.body,'text': '请假申请' },
                  ]
                  
            }else if(isTeacher){
                  const location_url = `location/sharing/count?studentNo=${identityId}`;
                  const location = await this.$http.get(location_url);
                  const message_url = `message/count?identityId=${identityId}`;
                  const message = await this.$http.get(message_url);
                  const article_url = `article/count?identityId=${identityId}`;
                  const article = await this.$http.get(article_url);
                  const leave_url = `leave/count?identityId=${identityId}`;
                  const leave = await this.$http.get(leave_url);
                  this.cardList=[
                    { 'link': '/notes', 'number': article.body,'text': '实习公告' },
                    { 'link': '/notes?type=message', 'number': message.body,'text': '实习消息' }
                    //,{ 'link': '/share', 'number': location.body,'text': '共享消息' }
                    //{ 'link': '/ill/list', 'number': leave.body,'text': '请假申请' },
                  ]
                  
            }
           
            const gridItems = [];
            const functions = this.getFuncations();
            _.each(functions,(func)=>{
                  _.each(this.gridData,(grid)=>{
                    if(func.code==grid.code){
                      grid["text"]= func.appFunction;
                      grid["img"] = func.imageUrl;
                      gridItems.push(grid);
                    }
                  });
            });
            this.gridItems = gridItems;
             
  }
};
</script>


