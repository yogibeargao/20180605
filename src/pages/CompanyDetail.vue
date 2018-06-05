<template>
  <r-page>
      <top title="实习单位详情" :showBack="true"/>
      <r-body>
                <r-card>
                    <r-input title="名称" :required="true" :model="this.company" value="companyName" placeholder="请输入实习单位名称"/>
                    <r-input title="地址" :required="true" :model="this.company" value="companyAddress" placeholder="请输入实习单位地址"/>
                </r-card>
                <r-card>
                    <r-date-time  title='开始时间' :required="true" :model="this.company" value="internStartDateStr" format="YYYY-MM-DD HH:mm" :hourList="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minuteList="['00', '15', '30', '45']"></r-date-time>
                    <r-date-time  title='结束时间' :required="true" :model="this.company" value="internEndDateStr" format="YYYY-MM-DD HH:mm" :hourList="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minuteList="['00', '15', '30', '45']"></r-date-time>
                </r-card>
                <r-card>
                    <r-input title="导师名字" :required="true" :model="this.company" value="tutor" placeholder="请输入导师名字"/>
                    <r-input title="导师电话" :required="true" :model="this.company" value="tutorPhoneNo" placeholder="请输入导师手机号"/>
                    <r-date-time  title='工作时间' :required="true" :model="this.company" value="workingTime" format="HH:mm" :hourList="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minuteList="['00', '15', '30', '45']"></r-date-time>
                </r-card>
                 <r-card>
                    <r-switch title="是否当前单位" :required="true" :model="this.company" value="currentCompany" />
                </r-card>
                
      </r-body>
                <r-tab-bar>
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
import Util from "../util/util";

export default {
  data() {
    return {
      company:{},
    };
  },
  methods :{
    async submit(){
                const id = this.$route.query.id;
                const identityId = Util.getIdentityId(this);
                let url = `intern/company/create`;
                if(id){
                   url = `intern/company/update`
                }
                    this.company.internStartDateStr = this.company.internStartDateStr+":00";
                    this.company.internEndDateStr = this.company.internEndDateStr+":00";
                    this.company.workingTime = this.company.workingTime+":00";;
                    this.company.currentCompany = this.company.currentCompany?1:0;
                    this.company["studentNo"]=identityId;
                    const list = await this.$http.post(url,this.company);
                    this.$router.back(-1);
    }
  },
  async mounted(){
                    const id = this.$route.query.id;
                    if(id){
                      const url = `intern/company/detail?companyId=`+id;  
                      const list = await this.$http.get(url);
                      if(list.body){
                          list.body.internStartDateStr = list.body.internStartDate?list.body.internStartDate.substring(0,16):"";
                          list.body.internEndDateStr = list.body.internEndDate?list.body.internEndDate.substring(0,16):"";
                          list.body.workingTime = list.body.workingTime?list.body.workingTime.substring(0,16):"";
                          list.body.currentCompany = list.body.currentCompany==1?true:false;
                          
                          this.company = list.body;
                          console.log(this.company)
                          delete this.company["internStartDate"];
                          delete this.company["internEndDate"];
                      }
                   }
                
  }
};
</script>


