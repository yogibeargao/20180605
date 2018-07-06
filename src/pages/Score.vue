<template>
  <r-page>
      <top title="实习成绩" :showBack="true"/>
      <r-body>
            <!--   <r-card>
                  <r-previewer title="总成绩" :value="score" :data="list1"></r-previewer>
              </r-card> -->

            <r-card title="辅导员考核：">
                  <r-input title="实习出勤分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_fdy_score_1" :isNumber="true"/>
                  <r-input title="实习材料分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_fdy_score_2" :isNumber="true"/>
                  <r-textarea title="评价:" :readonly="true" :model="this" value="fdyComments" :height="150" :max="200"></r-textarea>
            </r-card>

            <r-card title="学院导师考核：">
                <r-input title="专业学习情况分:"  :readonly="true"   :max="100" :min="0"  :model="this" value="v_xyds_score_1" :isNumber="true"/>
                <r-input title="顶岗实习小结分:"  :readonly="true"   :max="100" :min="0"  :model="this" value="v_xyds_score_2" :isNumber="true"/>
                <r-textarea title="评价:" :readonly="true"  :model="this" value="xydsComments" :height="200" :max="200"></r-textarea>
             </r-card>


            <r-card title="企业导师考核：">
                  <r-input title="职业道德分:"   :readonly="true"   :max="100" :min="0"  :model="this" value="v_qyds_score_1" :isNumber="true"/>
                  <r-input title="执行制度遵守纪律情况分:"   :readonly="true"   :max="100" :min="0"  :model="this" value="v_qyds_score_2" :isNumber="true"/>
                  <r-input title="实习工作态度分:"  :readonly="true"   :max="100" :min="0"  :model="this" value="v_qyds_score_3" :isNumber="true"/>
                  <r-input title="专业业务能力分:"  :readonly="true"   :max="100" :min="0"  :model="this" value="v_qyds_score_4" :isNumber="true"/>
                  <r-input title="工作实绩分:"    :readonly="true"   :max="100" :min="0"  :model="this" value="v_qyds_score_5" :isNumber="true"/>
                  <r-textarea title='实习评价:'  :readonly="true"  :model="this" value="qydsComments"  :autoSize="true" :rows="10" :max="200"></r-textarea>
            </r-card>
      </r-body>

              <r-tab-bar>
                  <r-cell type="row" :vertical="true">
                          <r-cell>
                            <r-box>
                                <r-button :onClick="download">下载实习成绩表</r-button>
                            </r-box>
                        </r-cell>
                    </r-cell>
              </r-tab-bar>
  </r-page>
</template>

<script>
import {RPreviewer} from 'rainbow-mobile-previewer'
import Util from "../util/util";
import Vue from 'vue';

export default {
  components: {
    RPreviewer,
  },
  data() {
        return {
          //score:"0",
          list1: [],
          v_fdy_score_1: null,
          v_fdy_score_2: null,
          v_xyds_score_1: null,
          v_xyds_score_2: null,
          v_qyds_score_1: null,
          v_qyds_score_2: null,
          v_qyds_score_3: null,
          v_qyds_score_4: null,
          v_qyds_score_5: null,
          fdyComments: null,
          xydsComments: null,
          qydsComments: null

        };
  },
  methods: {
        onChange() {},

        async download() {
            const identityId = Util.getIdentityId(this);
            window.location.href=Vue.http.options.root+"/intern/download/student/intern/all?studentNo=" + identityId;
        }
  },
  async mounted(){
       /*  const identityId = Util.getIdentityId(this);
        const url = `intern/score/list`;
        const list = await this.$http.post(url,{"studentNos":[identityId],"pageNo":1,"pageSize":50});
        if(list.body){
          this.score = list.body[0].schoolScore?list.body[0].schoolScore+"":"还没出成绩";
          this.list1 = [{
                label: '学生姓名',
                value: list.body[0].studentName
              }, {
                label: '老师姓名',
                value: list.body[0].teacherName
          }]
        } */

        const identityId = Util.getIdentityId(this);
        const url = "intern/student/intern/all?studentNo=" + identityId;
        const temp_record = await this.$http.get(url);
        if(temp_record.body){

          this.schoolScore = temp_record.body.schoolScore;
          this.v_fdy_score_1 = temp_record.body.attendanceScore;
          this.v_fdy_score_2 = temp_record.body.documentScore;
          this.v_xyds_score_1 = temp_record.body.professionalScore;
          this.v_xyds_score_2 = temp_record.body.postPracticeScore;
          this.v_qyds_score_1 = temp_record.body.workEthicsScore;
          this.v_qyds_score_2 = temp_record.body.complianceScore;
          this.v_qyds_score_3 = temp_record.body.attitudeScore;
          this.v_qyds_score_4 = temp_record.body.professionalScore;
          this.v_qyds_score_5 = temp_record.body.performanceScore;
          //this.fdyComments = temp_record.body.fdyComments;
          //this.xydsComments = temp_record.body.xydsComments;
          //this.qydsComments = temp_record.body.qydsComments;

        }
      

                
  }
};
</script>


