<template>
  <r-page>
      <top title="实习记录" :showBack="true"/>
      <r-body>
                <r-card>
                      <r-table :data="data" />
                </r-card>
      </r-body>
                <r-tab-bar>
                  <r-cell type="row" :vertical="true">
                                <r-cell >
                                    <r-box>
                                        <r-button :onClick="addRecord">增加记录</r-button>
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
          [{'text':'开始时间'},{'text':'结束时间'},{'text':'操作'}]
        ],
        "body":[]
      },
    };
  },
  methods :{
      addRecord(){
                  this.$router.push({"name":"RecordDetail"});
      }
    
  },
  async mounted(){
                const identityId = Util.getIdentityId(this);
                const url = `intern/detail/list`;
                const list = await this.$http.post(url,{"studentNos":[identityId],"pageNo":1,"pageSize":50});
                if(list.body){
                    this.data.body = _.map(list.body,(s)=>{
                        s.startDate = s.startDate?s.startDate.substring(0,16):"";
                        s.endDate = s.endDate?s.endDate.substring(0,16):"";
                        return [{'text':s.startDate},{'text':s.endDate},{'text':"查看",'link':'/record/detail?id='+s.id}]
                    })
                    // sessionStorage.setItem("record",JSON.stringify(list.body));
                }
                
  }
};
</script>


