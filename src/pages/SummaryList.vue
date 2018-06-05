<template>
  <r-page>
      <top title="实习总结列表" :showBack="true"/>
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
      condition: {},
      status: 0,
      name: [],
      data:{
        "head":[
          [{'text':'姓名'},{'text':'状态'},{'text':'操作'}]
        ],
        "body":[]
      },
      options: [{ key: 0, value: "未批阅" }, { key: 1, value: "已批阅" }],
    };
  },
  methods: {
    async search(condition) {
                  if(condition==0||condition==1){
                      this.condition.status = condition;
                  }
                  const identityId = Util.getIdentityId(this);
                  const param = {"status":this.condition.status?this.condition.status:0,"classId":this.condition.class,"studentNos":this.condition.student_Nos,"startDateStr":this.condition.startDateStr,"endDateStr":this.condition.endDateStr,"pageNo":1,"pageSize":50} 
                  const status = await this.$http.post(`intern/summary/list`,param);
                  const status_data = [];
                  _.each(status.body,(student,index)=>{
                      status_data.push([{'text':student.studentName},{'text':student.state==1?'已批阅':'未批阅'},{'text':"查看","link":"/summary/detail?id="+student.id}])
                  })
                  this.data.body = status_data;
                  sessionStorage.setItem("summary_data",JSON.stringify(status_data));

    }
  },
   mounted(){
    const recordList = sessionStorage.getItem("summary_data");
    if(recordList){
        this.data.body = JSON.parse(recordList);
    }
  }
};
</script>


