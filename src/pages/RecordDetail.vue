<template>
  <r-page>
      <top title="记录详情" :showBack="true"/>
      <r-body>
              <r-card>
                  <r-date-time :readonly="isreadonly"  title='开始时间' format="YYYY-MM-DD HH:mm" :model="this.record" value="startDateStr" :minuteList="['00', '15', '30', '45']"></r-date-time>
                  <r-date-time  :readonly="isreadonly" title='结束时间' format="YYYY-MM-DD HH:mm" :model="this.record" value="endDateStr"  :minuteList="['00', '15', '30', '45']"></r-date-time>
              </r-card>
              <r-card>
                  <r-textarea title='实习描述:' :readonly="isreadonly" placeholder="请在这里输入实习描述" :model="this.record" value="internDescription" :height="200" :max="200"></r-textarea>
              </r-card>
                <r-card v-if='!isStudent||!isEdit'>
                  <r-textarea title='实习评价:'  :readonly="isreadonly"  :model="this.record" value="appraisalContent"  :autoSize="true" :rows="10" :max="200"></r-textarea>
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

export default {

  data() {
    return {
      record:{},
      isShow:false,
      toastText:"操作失败",
      type : "warn",
      showFlag:false,
      apprisal:false,
      state:null
    };
  },
  methods :{
    async submit(){
        let temp_record = null;
        if(Util.isStudent(this)){
                  const url = "intern/detail/create";
                  const identityId = Util.getIdentityId(this);
                  this.record["studentNo"]= identityId;
                  this.record.startDateStr = this.record.startDateStr+":00";
                  this.record.endDateStr = this.record.endDateStr+":00";
                   temp_record = await this.$http.post(url,this.record);
        }else{
                   const id = this.$route.query.id+"";

                   const url = "intern/detail/appraisal/create?internDetailId="+id+"&comments="+this.record.appraisalContent;
                   temp_record = await this.$http.post(url);
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
      isreadonly(){
        return this.state==1?true:false;
      },
      isEdit(){
        const id = this.$route.query.id;
        return id?false:true;
      }
  },
   async mounted(){
          const id = this.$route.query.id;
          if(id){
                  const url = "intern/detail?internId="+id;
                  const temp_record = await this.$http.get(url);
                  if(temp_record.body){
                    temp_record.body.startDateStr = temp_record.body.startDateStr?temp_record.body.startDateStr.substring(0,16):"";
                    temp_record.body.endDateStr = temp_record.body.endDateStr?temp_record.body.endDateStr.substring(0,16):"";
                    temp_record.body.appraisalContent=temp_record.body.appraisalContent=='null'?'':temp_record.body.appraisalContent;
                    this.record = temp_record.body;
                    this.signStat = temp_record.body.signStat;
                    this.apprisal = temp_record.body.apprisal;
                    this.state = temp_record.body.apprisalState;
                  }

                  
          }
  },
  async created(){
                  const id = this.$route.query.id;
                  if(id){
                      const auditUrl = "user/processaudit?processCode=interndetail";
                      const audit = await this.$http.get(auditUrl);
                      this.isShow = audit.body;
                  }else if(this.isStudent){
                      this.isShow = true;
                  }
                  
  }
};
</script>


