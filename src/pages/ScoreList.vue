<template>
  <r-page>
      <top title="学生成绩" :showBack="true"/>
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
import  Search from '../components/Search.vue';

export default {
  components: {
    Search
  },
  data() {
    return {
      showDialog: false,
      condition: {},
      v_student: null,
      status: null,
      classes:[],
      student:null,
      options: [{ key: 0, value: "未打分" }, { key: 1, value: "已打分" }],
      data:{
        "head":[
          [{'text':'姓名'},{'text':'分数'},{'text':'操作'}]
        ],
        "body":[]
      },

    };
  },
  methods: {
     async search(condition){
                  if(condition==0||condition==1){
                      this.condition.status = condition;
                  }
                  const param = {"status":this.condition.status,"classId":this.condition.class,"studentNos":this.condition.student_Nos,"pageNo":1,"pageSize":50};
                  const scores = await this.$http.post(`intern/score/list`,param);
                  const scores_data = [];
                  _.each(scores.body,(score,index)=>{
                      scores_data.push([{'text':score.studentName},{'text':score.schoolScore},{'text':score.schoolScore?'查看':'打分','link':"/score/detail?id="+score.id}])
                  })
                  this.data.body = scores_data;
                  sessionStorage.setItem("scores_data",JSON.stringify(scores_data));

    },
  },
   async mounted(){
                  const _scores_data = sessionStorage.getItem("scores_data");
                  if(_scores_data){
                    this.data.body = JSON.parse(_scores_data);
                  }
  }
};
</script>


