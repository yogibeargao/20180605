<template>
  <r-page>
      <top title="请假列表" :showBack="true"/>
<r-body>
              
               <search :condition="condition" :callBack="flash" :showClass="!isShowClass"/>

               <r-card>
                  <r-selector  title="状态" :options="options" :model="this" value="type" :onChange="flash"></r-selector>
              </r-card>
                <r-card>
                      <r-table :data="data" />
                </r-card>
</r-body>   
  <r-tab-bar>
                <r-cell type="row" :vertical="true" v-if="isStudent">
                              <r-cell>
                                  <r-box>
                                      <r-button link='/ill/detail?type=submit'>请假申请</r-button>
                                  </r-box>
                              </r-cell>
                  </r-cell>
            </r-tab-bar>  
  </r-page>
</template>

<script>
import Util from "../util/util";
import  Search from '../components/Search.vue';

export default {
  components: {
    Search
  },
  data() {
    return {
      data:{
        "head":[
          [{'text':'学生姓名'},{'text':'请假时间'},{'text':'状态'}]
        ],
        "body":[]
      },
      condition:{},
      type:null,
      options: [{ key: 0, value: "未审批" }, { key: 1, value: "已审批" }],
      class:[],
      name:[],
      flag:false
    };
  },
  computed:{
    isStudent(){
      return Util.isStudent(this);
    },
    isShowClass(){
       if(Util.isCompany(this)){
          return true;
       }else{
          return Util.isStudent(this);
       }
    }
  },
  methods:{
      goto(){
        window.location.hash='/record/evaluate'
      },
      flash(condition){
         if(condition==0||condition==1){
                      this.condition.status = condition;
          }
         this.loadLeave(this.condition);
         this.flag=!this.flag;
      },
      async loadLeave(condition){
            this.user = JSON.parse(sessionStorage.getItem("user"));
            const identityId = Util.getIdentityId(this);
            const url = `leave/list`;
            let param = {"pageNo":1,"pageSize":50};
            if(Util.isStudent(this)){
              param["studentNos"] = [identityId];
            }else{
              param["identityId"] = identityId;
              param["studentNos"] = condition.student_Nos;
            }
            if(this.type!=null){
              param["status"] = this.type;
            }else{
              param["status"] = "0"
            }
            if(condition.startDateStr!=null){
              param["startDateStr"] = condition.startDateStr;
            }
            if(condition.endDateStr!=null){
              param["endDateStr"] = condition.endDateStr;
            }
            const leaves = await this.$http.post(url,param);
            const loadLeaves = [];
            _.each(leaves.body,(leave)=>{
              leave.leaveStartDate = leave.leaveStartDate?leave.leaveStartDate.substring(0,16):"";
              leave.leaveEndDate = leave.leaveEndDate?leave.leaveEndDate.substring(0,16):"";
              loadLeaves.push([{'text':leave.studentName},{'text':leave.leaveStartDate},{'text':leave.auditReply?leave.auditReply:"查看",'link':'/ill/detail?leaveId='+leave.leaveId}])
            })
            if(!_.isEmpty(leaves.body)){
              sessionStorage.setItem("leaves",JSON.stringify(loadLeaves));
            }
            this.data.body = loadLeaves;
      }
  },
  mounted(){
       const leaves =  sessionStorage.getItem("leaves");
       if(leaves){
        this.data.body = JSON.parse(leaves);
       }

  }
};
</script>


