<template>
  <r-page>
      <top title="个人信息" :showBack="true"/>
      <r-body>
            <r-image :list="userImg"/>
            <r-row title="姓名" :model="this.user" value='studentName' v-if="isStudent"/>
            <r-row title="姓名" :model="this.user" value='teachername' v-if="!isStudent"/>
            <r-row title="性别" :model="this.user" value='sex'/>
            <r-row title="学号" :model="this.user" value='studentNo' v-if="isStudent"/>
            <r-row title="班级" :model="this.user" value='className' v-if="isStudent"/>
            <r-row title="工号" :model="this.user" value='teacherNo' v-if="!isStudent"/>
            <r-row title="实习单位" :model="this.user" value='internShipUnit' v-if="isStudent"/>
            <r-row title="实习地址" :model="this.user" value='workAddress' v-if="isStudent"/>
            <r-row title="工作地址" :model="this.user" value='address' v-if="!isStudent"/>
            <r-row title="电话" :model="this.user" value='phoneNo'/>
      </r-body>     
  </r-page>
</template>

<script>
import user from "../assets/user.gif";
import Util from "../util/util";
import {ConfirmApi } from "rainbow-mobile-core";

export default {
  components: {
    ConfirmApi
  },
  data() {
    return {
       userImg: [
        {
          src: user
        }
      ],
      user:{},
      isStudent:true,
      show:false
    };
  },
  methods :{
    async changPhone(){
                  // const user = JSON.parse(sessionStorage.getItem("user"));
                  // const param = {"studentNos":[user.identityId],"pageNo":1,"pageSize":50};
                  // const phones = await this.$http.post(`user/changephone/list`,param);
                  // console.log(phones.body)
                  // if(_.size(phones.body)>0){
                  //      ConfirmApi.show(this,{
                  //       title: '',
                  //       content: '不能重复申请',
                  //      });
                  // }else{
                        const url = "user/changephone";
                        const changephone = await this.$http.post(url);
                        if(changephone.body){
                            ConfirmApi.show(this,{
                            title: '',
                            content: '申请成功',
                          });
                        }else{
                          ConfirmApi.show(this,{
                            title: '',
                            content: '申请失败',
                          });
                        }
                  // }


               
    }, 
    modifyPhone(value){
       
    }
  },
  async mounted(){
                this.user = JSON.parse(sessionStorage.getItem("user"));
                const url = "user/detail?identityId="+this.user.identityId;
                const signList = await this.$http.get(url);
                this.isStudent = Util.isStudent(this);
                if(this.isStudent){
                    this.user = signList.body.student;
                    //this.user.phoneNo = this.user.phoneNo;
                }else{
                    this.user = signList.body.teacher;
                }
  }
};
</script>


