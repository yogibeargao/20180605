<template>
  <r-page>
      <top title="实习单位" :showBack="true"/>
      <r-body>
       <r-card>
             <r-table :data="data" />
       </r-card>
      </r-body>
       <r-tab-bar>
            <r-cell type="row" :vertical="true">
                        <r-cell>
                            <r-box>
                                <r-button :onClick="addCompany">增加</r-button>
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
       data:{
         "head":[
          [{'text':'单位名称'},{'text':'单位地址'},{'text':'当前单位'}]
        ],
        "body":[]
      },
    };
  },
  methods :{
      addCompany(){
          this.$router.push({"name":"CompanyDetail"});
      }
  },
  async mounted(){
                const identityId = Util.getIdentityId(this);
                const url = `intern/company/stulist?studentNo=`+identityId;
                const list = await this.$http.get(url);
                console.log(list)
                if(list.body){
                    this.data.body = _.map(list.body,(s)=>{
                        return [{'text':s.companyName,'link':'/company/detail?id='+s.internId},{'text':s.companyAddress},{'text':s.currentCompany==1?"是":"否"}]
                    })
                }
                
  }
};
</script>


