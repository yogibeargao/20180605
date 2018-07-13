<template>
  <r-page>
      <top title="企业考核" :showBack="true"/>
        <r-body>
                <search :condition="condition" :callBack="search" :showClass="isShowClass"/>
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
import Search from '../components/Search.vue';
import Util from "../util/util";

export default {
  components: {
    Search
  },
  data() {
    return {
       data:{
        "head":[
          [{'text':'姓名'},{'text':'状态'},{'text':'操作'}]
        ],
        "body":[]
      },
      condition:{},
      options: [{ key: 0, value: "未打分" }, { key: 1, value: "已打分" }],
      status:null,
      commons:""
    };
  },
  computed:{
      isShowClass(){
        return !Util.isCompany(this);
      }
  },
  methods:{
      async search(condition){
        debugger;
                  if(condition==0||condition==1){
                      this.condition.status = condition;
                  }
                  const identityId = Util.getIdentityId(this);
                  const param = {"status":this.condition.status,"identityId":identityId,"classId":this.condition.class,"startDateStr":this.condition.startDateStr,"endDateStr":this.condition.endDateStr,"pageNo":1,"pageSize":50}; 
                  const list = await this.$http.post(`intern/student/enterprise/list`,param);
                  
                  this.data.body = _.map(list.body,(s)=>{
                        return [{'text':s.studentName},{'text':s.workEthicsScore?'已打分':"未打分"},{'text':"打分","link": s.workEthicsScore ? "/student/enterprise/detail?id="+s.id : "/enterprise/detail"}];
                  })
                  sessionStorage.setItem("enterpriseList",JSON.stringify(this.data.body));
    }
  },
  mounted(){
    const enterpriseList = sessionStorage.getItem("enterpriseList");
    if(enterpriseList){
        this.data.body = JSON.parse(enterpriseList);
    }
  }
};
</script>


