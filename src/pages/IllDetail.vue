<template>
  <r-page>
      <top title="请假详情" :showBack="true"/>
      <r-body>
              <r-card>
                  <r-date-time  title='开始时间' :required="true" :readonly="!isShowDetail" :model="this" value="leaveStartDate" format="YYYY-MM-DD HH:mm" :hourList="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minuteList="['00', '15', '30', '45']"></r-date-time>
                  <r-date-time  title='结束时间' :required="true" :readonly="!isShowDetail" :model="this" value="leaveEndDate" format="YYYY-MM-DD HH:mm" :hourList="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minuteList="['00', '15', '30', '45']"></r-date-time>
              </r-card>
              <r-card>
                  <r-selector  title="请假类型" :required="true" :readonly="!isShowDetail" :options="options" :model="this" value="leaveType" :onChange="type"></r-selector>
              </r-card>
           
              <r-card>
                  <r-textarea placeholder="请假事由" :required="true" :readonly="!isShowDetail" :model="this"  value="reason" :height="200" :max="300"></r-textarea>
              </r-card>

              <r-card title="上传病假单" v-if="isShowDetail&&isShowUpload">
                  <r-image-upload :max="1" url="leave/img" name="file" :onSuccess="uploadSuccess" />
              </r-card>

                   <r-cell type="row" :vertical="true" v-if="!isCompany&&!isSchoolTeacher">
                                <r-cell>
                                  <r-box>
                                      <r-button v-if="state==0&&!isStudent" :onClick="approve" >审核通过</r-button>
                                      <r-button v-if="state==0&&!isStudent" :onClick="reject" type="danger">审核拒绝</r-button>
                                      <r-button v-if="state==0&&!isStudent&&leaveType==1" :onClick="download" >下载病假单</r-button>

                                  </r-box>
                                </r-cell>
                    </r-cell>
      </r-body>
             <r-tab-bar v-if="isShowDetail">
                  <r-cell type="row" :vertical="true">
                                <r-cell>
                                  <r-box>
                                      <r-button :onClick="submit">提交</r-button>
                                  </r-box>
                                </r-cell>
                    </r-cell>
              </r-tab-bar>
           
  </r-page>
</template>

<script>

import {RImageUpload} from "rainbow-mobile-upload";
import Util from "../util/util";
import Vue from 'vue';
import {ConfirmApi } from "rainbow-mobile-core";

export default {
  components: {
    RImageUpload,
    ConfirmApi
  },
  data() {
    return {
      isShow:false,
      state:null,
      leavePath:null,
      leaveStartDate:null,
      leaveEndDate:null,
      leaveType:null,
      reason:null,
      leaveImg:null,
      options: [{ key: 2, value: "事假" }, { key: 1, value: "病假" }],
      showBill:false
    };
  },

  methods: {
    type(){
      if(this.leaveType==1){
        this.showBill = true;
      }
    },
    download(){
        const id = this.$route.query.leaveId;
        window.open(Vue.http.options.root+"/leave/download?leaveId="+id);
    },
    async submit() {
            if(!this.leavePath&&this.leaveType==1){
                  ConfirmApi.show(this,{
                    title: '',
                    content: '请上传病假单',
                  });
            }else{
                const url = `leave/create`;
                let param = {"imgUrl":this.leavePath,"reason":this.reason,"leaveStartDateStr":this.leaveStartDate+":00","leaveEndDateStr":this.leaveEndDate+":00","leaveType":this.leaveType};
                const leaves = await this.$http.post(url,param);
                if(!_.isEmpty(leaves.body)){
                  ConfirmApi.show(this,{
                    title: '申请失败',
                    content: leaves.bodyText,
                  });
                }else{
                    this.$router.back()
                }
            }
         
    },
    async approve() {
                const leaveId = this.$route.query.leaveId;
                const url = `leave/approval?auditReply=1`;
                const leaves = await this.$http.post(url,[Number(leaveId)]);
                this.$router.back()
    },
     async reject() {
                const leaveId = this.$route.query.leaveId;
                const url = `leave/approval?auditReply=0`;
                const leaves = await this.$http.post(url,[Number(leaveId)]);
                this.$router.back()
    },
    uploadSuccess(data){
        if(data){
          this.leavePath=data;
        }
    }
  },
  computed:{
    isReadlony(){
      return this.$route.query.leaveId?true:false;
    },
    isStudent(){
      return Util.isStudent(this);
    },
    isCompany(){
      return Util.isCompany(this);
    },
    isSchoolTeacher(){
      return Util.isSchoolTeacher(this);
    },
    isShowUpload(){
            const leaveId = this.$route.query.leaveId;
      return this.leaveType==1&&!leaveId?true:false;
    },
    isShowDetail(){
      const leaveId = this.$route.query.leaveId;
      if(leaveId){
          return false;
      }else{
          const type = this.$route.query.type;
          if(type=='submit'){
              return true;
          }else if(this.leaveType==1&&Util.isStudent(this)){
              return true;
          }else{
              return false;
          }
      }
    }
  },
  async mounted(){
           const leaveId = this.$route.query.leaveId;
           if(leaveId){
                  const leave = await this.$http.get("leave/detail?leaveId="+leaveId);
                  this.state=leave.body.state;
                  this.leaveType = leave.body.leaveType;
                  this.reason = leave.body.reason;
                  this.leaveEndDate = leave.body.leaveEndDate;
                  this.leaveStartDate = leave.body.leaveStartDate;
                  this.leaveImg = [{"class":"index","src":leave.body.imgUrl}];
                 
           }else{
                this.isShow = true;
           }
   
  },
  async created(){
                  const url = "user/processaudit?processCode=leave";
                  const temp_record = await this.$http.get(url);
                  this.isShow = temp_record.body;
  }
};
</script>
<style>
.cover{
  display: none
}
</style>


