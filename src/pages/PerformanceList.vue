<template>
  <r-page>
      <top title="实习评价列表" :showBack="true"/>
      <r-body>
              <search :condition="condition" :callBack="search" :showTime="false"/>
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
import Search from '../components/Search.vue';
export default {
  components: {
    Search
  },
  data() {
    return {
      status:null,
      condition: {},
      options: [{ key: 0, value: "未评价" }, { key: 1, value: "已评价" }],
      data:{
        "head":[
          [{'text':'姓名'},{'text':'状态'},{'text':'操作'}]
        ],
        "body":[]
      },

    };
  },
   methods: {
    async search(condition) {
                  if(condition==0||condition==1){
                      this.condition.status = condition;
                  }
                  const identityId = Util.getIdentityId(this);
                  const param = {"status":this.condition.status,"classId":this.condition.class,"studentNos":this.condition.student_Nos,"startDateStr":this.condition.startDate,"endDateStr":this.condition.endDate,"pageNo":1,"pageSize":50} 
                  const status = await this.$http.post(`intern/attendenceAppraisal/list`,param);
                  const status_data = [];
                  _.each(status.body,(student,index)=>{
                      status_data.push([{'text':student.studentName},{'text':student.comments?'已评价':'未评价'},{'text':"查看","link":"/performance/detail?id="+student.id+"&studentNo="+student.studentNo}])
                  })
                  this.data.body = status_data;
                  sessionStorage.setItem("appraisal_data",JSON.stringify(status_data));

    }
  },
   mounted(){
    // const recordList = sessionStorage.getItem("appraisal_data");
    // if(recordList){
    //     this.data.body = JSON.parse(recordList);
    // }
  }
};
</script>


