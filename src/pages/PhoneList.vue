<template>
  <r-page>
      <top title="手机审批" :showBack="true"/>
      <r-body>
                                  <search :condition="condition" :callBack="search" :showTime="false"/>
               <r-card>
                  <r-selector  title="状态" :options="options" :model="this" value="status" :onChange="search"></r-selector>
              </r-card>
                  <r-card>
                      <r-table :data="data" />
                  </r-card>  
          <r-tab-bar v-if="isShow">
                  <r-cell type="row" :vertical="true">
                                <r-cell>
                                  <r-box>
                                      <r-button :onClick="approve">全部通过</r-button>
                                  </r-box>
                                </r-cell>
                                 <r-cell>
                                  <r-box>
                                      <r-button type='danger' :onClick="reject">全部拒绝</r-button>
                                  </r-box>
                                </r-cell>
                    </r-cell>
              </r-tab-bar>
      </r-body>         
  
     
  </r-page>
</template>

<script>
import {ConfirmApi } from "rainbow-mobile-core";
import Util from "../util/util";
import Search from '../components/Search.vue';
export default {
  components: {
    ConfirmApi,
    Search
  },
  data() {
    return {
      condition:{},
        data:{
        "head":[
          [{'text':'姓名'},{'text':'状态'},{'text':'同意'},{'text':'拒绝'}]
        ],
        "body":[]
      },
      options: [{ key: 0, value: "未审批" }, { key: 1, value: "已审批" }],
      startDate:null,
      name:[],
      students:[],
      auditId:[],
      phone:{},
      show:false,
      showFlag:false,
      toastText:"",
      status:null,
      showDialog:false,
      isShow:false
    };
  },
  methods :{
    async search(condition){
                if(condition==0||condition==1){
                      this.condition.status = condition;
                  }
                  const param = {"status":this.condition.status,"studentNos":this.condition.student_Nos,"pageNo":1,"pageSize":50};
                  const phones = await this.$http.post(`user/changephone/list`,param);
                  if(_.size(phones.body)>0){
                      const phone_data = [];
                      _.each(phones.body,(student,index)=>{
                          
                          phone_data.push(
                            [{'text':student.studentName},{'text':student.auditReply?student.auditReply:"未审批"},student.status==0?{'auditId':student.auditId,'text':"同意","onClick":this.approve}:{},student.status==0?{'text':"拒绝","onClick":this.reject}:{}
                          ])
                          this.auditId.push(student.auditId)
                      })
                      this.data.body = phone_data;
                  }else{
                    this.data.body = [];
                  }
                  
    },

     async approve(item){
        const changephone = await this.$http.post(`user/changephone/approval?auditReply=1`,[item.auditId]);
            if(changephone.body){
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
    },
    async reject(item){
       const changephone = await this.$http.post(`user/changephone/approval?auditReply=0`,[item.auditId]);
            if(changephone.body){
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
    },
    async approves(){
      if(!_.isEmpty(this.auditId)){
            const changephone = await this.$http.post(`user/changephone/approval?auditReply=1`,this.auditId);
            if(changephone.body){
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
      }else{
          ConfirmApi.show(this,{
                                  title: '',
                                  content: '请筛选学生',
           });
      }
    
    },
    async rejects(){
       if(!_.isEmpty(this.auditId)){
             const changephone = await this.$http.post(`user/changephone/approval?auditReply=0`,this.auditId);
            if(changephone.body){
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
      }else{
           ConfirmApi.show(this,{
                                  title: '',
                                  content: '请筛选学生',
           });
      }
     
    }
    
  },
  async created(){
                  const url = "user/processaudit?processCode=userphoneaudit";
                  const temp_record = await this.$http.get(url);
                  this.isShow = temp_record.body;
  }
};
</script>


