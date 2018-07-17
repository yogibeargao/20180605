<template>
  <r-page>
      <top title="企业考核打分" :showBack="true"/>
      <r-body>
             <!--  <r-card   title="实习记录信息：">
                  <r-date-time :readonly="isreadonly"  title='开始时间' format="YYYY-MM-DD HH:mm" :model="this.record" value="startDateStr" :minuteList="['00', '15', '30', '45']"></r-date-time>
                  <r-date-time  :readonly="isreadonly" title='结束时间' format="YYYY-MM-DD HH:mm" :model="this.record" value="endDateStr"  :minuteList="['00', '15', '30', '45']"></r-date-time>

                  <r-textarea title='实习描述:' :readonly="isreadonly" placeholder="请在这里输入实习描述" :model="this.record" value="internDescription" :height="200" :max="200"></r-textarea>
              
                  <r-textarea title='实习评价:'  :readonly="isreadonly"  :model="this.record" value="appraisalContent"  :autoSize="true" :rows="10" :max="200"></r-textarea>
              </r-card> -->
              <r-row title="学号" :model="this.record" value='studentNo' v-show="!isEdit"/>

              <r-card v-if='!isStudent || !isEdit'   title="企业考核打分：">
                  <r-input title="职业道德分:"  placeholder="最高7分" :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="workEthicsScore" :isNumber="true"/>
                  <r-input title="执行制度遵守纪律情况分:"  placeholder="最高7分" :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="complianceScore" :isNumber="true"/>
                  <r-input title="实习工作态度分:"  placeholder="最高7分" :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="attitudeScore" :isNumber="true"/>
                  <r-input title="专业业务能力分:"  placeholder="最高7分" :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="professionalScore" :isNumber="true"/>
                  <r-input title="工作实绩分:"  placeholder="最高7分"  :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="performanceScore" :isNumber="true"/>
              </r-card>
      </r-body>
                            <r-toast :model="this" value="showFlag" :text="toastText" :type='type'/>

              <r-tab-bar v-if="isShow">
                <r-cell type="row" :vertical="true" v-if="!isreadonly">
                              <r-cell >
                                  <r-box>
                                      <r-button :onClick="submit">提交</r-button>
                                  </r-box>
                              </r-cell>
                  </r-cell>
             </r-tab-bar>
  </r-page>
</template>

<script>
import Util from "../util/util";
import {ConfirmApi } from "rainbow-mobile-core";

export default {

  data() {
    return {
      record:{},
      isShow:false,
      toastText:"操作失败",
      type : "warn",
      showFlag:false,
      apprisal:false,
      status:null
    };
  },
  methods :{
    async submit(){
        let temp_record = null;

                if(!this.record.workEthicsScore){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '请输入职业道德分'
                    });
                  }else if(this.record.workEthicsScore > 7 || this.record.workEthicsScore < 0){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '职业道德分数<br/>评分规则为[0-7分]！'
                    });
                  }else if(!this.record.complianceScore){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '请输入执行制度遵守纪律情况分'
                    });
                  }else if(this.record.complianceScore > 7 || this.record.complianceScore < 0){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '执行制度遵守纪律情况分数<br/>评分规则为[0-7分]！'
                    });
                  }else if(!this.record.attitudeScore){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '请输入实习工作态度分'
                    });
                  }else if(this.record.attitudeScore > 7 || this.record.attitudeScore < 0){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '实习工作态度分数<br/>评分规则为[0-7分]！'
                    });
                  }else if(!this.record.professionalScore){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '请输入专业业务能力分'
                    });
                  }else if(this.record.professionalScore > 7 || this.record.professionalScore < 0){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '专业业务能力分数<br/>评分规则为[0-7分]！'
                    });
                  }else if(!this.record.performanceScore){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '请输入工作实绩分'
                    });
                  }else if(this.record.performanceScore > 7 || this.record.performanceScore < 0){
                    ConfirmApi.show(this,{
                          title: '',
                          content: '工作实绩分数<br/>评分规则为[0-7分]！'
                    });
                  }else{

                      const id = this.$route.query.id+"";
                      const studentNo = this.$route.query.studentNo;

                      const identityId = Util.getIdentityId(this);
                      this.record["studentNo"]= this.record.studentNo ? this.record.studentNo : studentNo;
                      this.record.apprisalId = id ? id : '';

                      const url = "intern/student/enterprise/apprisal";
                      //temp_record = await this.$http.post(url,this.record);
                      let param = {"apprisalId":this.record.apprisalId,"studentNo":this.record["studentNo"],"workEthicsScore":this.record.workEthicsScore,"complianceScore":this.record.complianceScore,"attitudeScore":this.record.attitudeScore,"professionalScore":this.record.professionalScore,"performanceScore":this.record.performanceScore};
                      temp_record = await this.$http.post(url,param);
                      
                }
      

               
                  if(temp_record.body){
                      this.toastText="操作成功";
                      this.type = "success";
                      this.showFlag=true;
                      this.$router.back()
                  }else{
                      this.showFlag=true;
                  }

                   if(!Util.isStudent(this)){
                         const id = this.$route.query.id+"";
                            const recordList = sessionStorage.getItem('recordList');
                            if(recordList&&!this.signStat){
                                    const newRecordList = [];
                                    _.each(JSON.parse(recordList),(record)=>{
                                        const link_id = record[2].link.split('=')[1];
                                        if(link_id!=id){
                                            newRecordList.push(record)
                                        }
                                    });
                                    sessionStorage.setItem('recordList',JSON.stringify(newRecordList)); 

                            }
                   }
    }
  },
  computed:{
      isStudent(){
      return Util.isStudent(this);
      },
      isCompany(){
      return Util.isCompany(this);
      },
      isreadonly(){
        return this.status===1?true:false;
      },
      isEdit(){
        const id = this.$route.query.id;
        return id?false:true;
      }
  },
   async mounted(){
          const id = this.$route.query.id;
          if(id){
                  const url = "intern/student/enterprise/detail?apprisalId="+id;
                  const temp_record = await this.$http.get(url);
                  if(temp_record.body){
                    temp_record.body.startDateStr = temp_record.body.startDateStr?temp_record.body.startDateStr.substring(0,16):"";
                    temp_record.body.endDateStr = temp_record.body.endDateStr?temp_record.body.endDateStr.substring(0,16):"";
                    temp_record.body.comments=temp_record.body.comments=='null'?'':temp_record.body.comments;
                    temp_record.body.workEthicsScore = temp_record.body.workEthicsScore ? temp_record.body.workEthicsScore : '';
                    temp_record.body.complianceScore = temp_record.body.complianceScore ? temp_record.body.complianceScore : '';
                    temp_record.body.attitudeScore = temp_record.body.attitudeScore ? temp_record.body.attitudeScore : '';
                    temp_record.body.professionalScore = temp_record.body.professionalScore ? temp_record.body.professionalScore : '';
                    temp_record.body.performanceScore = temp_record.body.performanceScore ? temp_record.body.performanceScore : '';

                    temp_record.body.status = temp_record.body.status ? temp_record.body.status : '';
                    temp_record.body.studentNo = temp_record.body.studentNo ? temp_record.body.studentNo : '';
                    temp_record.body.apprisalId = temp_record.body.apprisalId ? temp_record.body.apprisalId : '';

                    this.record = temp_record.body;
                    //this.signStat = temp_record.body.signStat;
                    //this.apprisal = temp_record.body.apprisal;

                  }

                  
          }
  },
  async created(){
                  const id = this.$route.query.id;
                  if(id){
                      const auditUrl = "user/processaudit?processCode=interndetail";
                      const audit = await this.$http.get(auditUrl);
                      this.isShow = audit.body;
                 // }else if(this.isStudent){
                     // this.isShow = true;
                  }else if(this.isCompany){
                      this.isShow = true;
                  }
                  
  }
};
</script>


