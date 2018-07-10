<template>
  <r-page>
      <top title="走访记录列表" :showBack="true"/>
      <r-body>
              <search :condition="condition" :callBack="search"  />
              <r-card>
                  <r-selector  title="状态" :options="options" :model="this" value="status" :onChange="search"></r-selector>
              </r-card>
              <r-card>
                   <r-table :data="data" />
              </r-card>
             
      </r-body> 

      <r-tab-bar>
          <r-cell type="row" :vertical="true" v-if="isSchoolTeacher">
                <r-cell>
                    <r-box>
                        <r-button link='/survey/detail'>增加记录</r-button>
                    </r-box>
                </r-cell>
            </r-cell>
      </r-tab-bar>  
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
          [{'text':'走访单位'},{'text':'状态'},{'text':'操作'}]
        ],
        "body":[]
      },
      options: [{ key: 0, value: "未走访" }, { key: 1, value: "已走访" }],
    };
  }, 
  computed:{
    isSchoolTeacher(){
      return Util.isSchoolTeacher(this);
    },
    isShowClass(){
      return !Util.isSchoolTeacher(this);
    }
  },
  methods: {
    async search(condition) {
                  if(condition==0||condition==1){
                      this.condition.status = condition;
                  }
                  const identityId = Util.getIdentityId(this);
                  const param = {"status":this.condition.status?this.condition.status:0,"classId":this.condition.class,"studentNos":this.condition.student_Nos,"startDateStr":this.condition.startDateStr,"endDateStr":this.condition.endDateStr,"pageNo":1,"pageSize":50} 
                  const surveys = await this.$http.post(`intern/student/intern/survey/list`,param);
                  const surveys_data = [];
                  _.each(surveys.body,(survey,index)=>{
                      surveys_data.push([{'text':survey.enterpriseName},{'text':survey.status===1?'已走访':'未走访'},{'text':"查看","link":"/survey/detail?id="+survey.surveryId}])
                  })
                  this.data.body = surveys_data;
                  sessionStorage.setItem("surveys_data",JSON.stringify(surveys_data));

    }
  },
   mounted(){
    const surveyList = sessionStorage.getItem("surveys_data");
    if(surveyList){
        this.data.body = JSON.parse(surveyList);
    }
  }
};
</script>


