<template>
  <r-page>
      <top title="查看共享" :showBack="true"/>
      <r-body>
                    <search :condition="condition" :callBack="search"/>
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
          [{'text':'姓名'},{'text':'地点'},{'text':'时间'}]
        ],
        "body":[]
      },
      condition:{},
      options: [{ key: 0, value: "未响应" }, { key: 1, value: "已响应" }],
      showFlag:false,
      toastText:"",
      status:null,
      showDialog:false
    };
  },
  computed :{
    
  },
  methods:{
    async search(condition){
                  if(condition==0||condition==1){
                      this.condition.status = condition;
                  }
                  const identityId = Util.getIdentityId(this);
                  const param = {"status":this.condition.status,"identityId":identityId,"classId":this.condition.class,"studentNos":this.condition.student_Nos,"startDateStr":this.condition.startDateStr,"endDateStr":this.condition.endDateStr,"pageNo":1,"pageSize":50} 
                  const list = await this.$http.post(`location/sharing/list`,param);
                  this.data.body = _.map(list.body,(s)=>{
                        return [{'text':s.studentName},{'text':s.sharedAddress?s.sharedAddress:"未响应"},{'text':s.responseTime?s.responseTime.substring(11,16):""}]
                  })
    }
  },
  
};
</script>


