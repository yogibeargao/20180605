<template>
  <r-page>
      <top title="位置共享" :showBack="true"/>
      <r-body>
                    <r-card>
                                <r-table :data="data" />
                    </r-card> 
      </r-body>          
  </r-page>
</template>

<script>
import Util from "../util/util";

export default {
  
  data() {
    return {
       data:{
        "head":[
          [{'text':'时间'},{'text':'发起人'},{'text':'响应结果'}]
        ],
        "body":[
        ]
      },
    };
  },
  computed :{
    
    
  },
  async mounted(){
            const identityId = Util.getIdentityId(this);
            let param = {"studentNos":[identityId],"status":0,"pageNo":1,"pageSize":5};
            let url = "location/sharing/list";
            const shareList= await this.$http.post(url,param);
            const List = [];
            _.each(shareList.body,(share)=>{
              const _share = [];
              _share.push({"text":share.updateTime});
             _share.push({"text":share.fkSharedRecordCreater});
             _share.push({'text':'点击响应','link':'/location/detail?shareId='+share.id});
              List.push(_share)
            });
            this.data.body = List;
  }




};
</script>


?studentNos={studentNos}&startDate={startDate}&endDate={endDate}&status={responseStatus}