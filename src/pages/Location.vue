<template>
  <r-page>
      <top title="签到" :showBack="true"/>
      <r-body>
                    <r-card>
                          <r-table :data="data" />
                    </r-card>  
      </r-body>         
        <r-tab-bar>
            <r-cell type="row" :vertical="true">
                          <r-cell >
                            <r-box>
                                <r-button link="/location/detail" >在线签到</r-button>
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
          [{'text':'时间'},{'text':'地点'}]
        ],
        "body":[]
      },
    };
  },
  computed :{
    
    
  },
  async mounted(){
                const identityId = Util.getIdentityId(this);
                const url = `online/signin/list`;
                const signList = await this.$http.post(url,{"identityId":identityId,"pageNo":1,"pageSize":50});
                if(signList.body){
                    this.data.body = _.map(signList.body,(s)=>{
                        return [{'text':s.signDate},{'text':s.signAddress}]
                    })
                }
                
  }
};
</script>


