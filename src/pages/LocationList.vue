<template>
  <r-page>
      <top title="签到查看" :showBack="true"/>
      <r-body>
                    <search :condition="condition" :callBack="search" :showClass='!isShowClass'/>
                     <r-card>
                        <r-selector  title="状态" :options="options" :model="this" value="status" :onChange="search"></r-selector>
                    </r-card>
                    <r-card>
                                <r-table :data="data" />
                    </r-card>  
      </r-body>  
  </r-page>
</template>

<script>
import {ConfirmApi } from "rainbow-mobile-core";
import Util from "../util/util";
import  Search from '../components/Search.vue';

export default {
  components: {
    ConfirmApi,
    Search
  },
  data() {
    return {
       condition:{},
       status:null,
       options: [{ key: 0, value: "未签到" }, { key: 1, value: "已签到" }, {key: 2, value: "无需签到" }],
        data:{
        "head":[
          [{'text':'姓名'},{'text':'位置'},{'text':'时间'}]
        ],
        "body":[]
      }
    };
  },
  computed :{
      disableButton(){
        return _.isEmpty(this.student);
      },
      isShowClass(){
        return Util.isCompany(this);
      }
    
  },
  methods:{
    async updateStatus(item){
     const url = "online/signin/unwanted?id="+item.id;
     const changeStatus = await this.$http.get(url);
            if(changeStatus.body){
                                  ConfirmApi.show(this,{
                                  title: '',
                                  content: '操作成功',
                                });
                                this.search(this.condition);
                              }else{
                                ConfirmApi.show(this,{
                                  title: '',
                                  content: '操作失败',
                                });
            }

      this.$router.back();
   },
   async search(condition){
                  if(condition === 0 || condition === 1 || condition === 2){
                      this.condition.status = condition;
                  }
                  const identityId = Util.getIdentityId(this);
                  const param = {"status":this.condition.status,"identityId":identityId,"classId":this.condition.class,"studentNos":this.condition.student_Nos,"startDateStr":this.condition.startDateStr,"endDateStr":this.condition.endDateStr,"pageNo":1,"pageSize":50} 
                  const status = await this.$http.post(`online/signin/list`,param);
                  const status_data = [];
                  _.each(status.body,(student,index)=>{
                      var addressStr = {};
                      if(student.attendance === '1'){
                          addressStr = {'text':student.signAddress};
                      }else if(student.attendance === '2'){
                          addressStr = {'text':'无需签到'};
                      }else if(student.attendance === '0'){
                          addressStr = {'id':student.id,'text':'未签到',"onClick":this.updateStatus};
                      }
                      status_data.push([{'text':student.studentName}, addressStr ,{'text':student.signDate?student.signDate.substring(11,16):''}])
                  })
                  this.data.body = status_data;
          }
  }
};
</script>


