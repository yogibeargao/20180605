<template>
  <r-page>
      <top title="实习成绩" :showBack="true"/>
      <r-body>
           <!--  <r-input title="分数" :required="true" :max="100" :min="0"  :model="this" value="schoolScore" :isNumber="true"/>
            <r-textarea placeholder="请输入评价" :model="this" value="comments" :height="600" :max="600"></r-textarea> -->

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
                  <r-textarea title='评价:'  :readonly="true"  :model="this" value="qydsComments"  :autoSize="true" :rows="10" :max="200"></r-textarea>
            </r-card>
           
      </r-body>
            <!--  <r-tab-bar v-if="!schoolScore">
                  <r-cell type="row" :vertical="true">
                                <r-cell >
                                  <r-box>
                                      <r-button :onClick="submit">提交</r-button>
                                  </r-box>
                                </r-cell>
                    </r-cell>
              </r-tab-bar> -->

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
import Util from "../util/util";
import Vue from 'vue';
export default {
  data() {
    return {
      schoolScore: null,
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
      qydsComments: null,
      stuNo: null

    };
  },
  methods: {
       /*  async submit() {
                      const s_identityId =   this.$route.query.id;
                      const identityId = Util.getIdentityId(this);
                      const result = await this.$http.post(`intern/score/create`,{"studentNo":s_identityId,"teacherNo":identityId,"schoolScore":Number(this.score),"comments":this.comments});
                      if(result.body){
                        this.$router.back(-1);
                      }
        }, */
        async download() {
            const identityId = Util.getIdentityId(this);
            window.location.href=Vue.http.options.root+"/intern/download/student/intern/all?studentNo=" + this.stuNo;
        }
  },
  async mounted(){
        const id = this.$route.query.id;
        const identityId = Util.getIdentityId(this);
        if(id){
                //  查询实习学生成详细数据
                const score = await this.$http.get("intern/score/detail?studentSchoolScoreId="+id);
                this.stuNo=score.body.studentNo;

                // 查询某学生实习各项成绩数据
                const url = "intern/student/intern/all?studentNo=" + this.stuNo;
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
                  this.v_qyds_score_4 = temp_record.body.professionalScore1;
                  this.v_qyds_score_5 = temp_record.body.performanceScore;
                  this.fdyComments = temp_record.body.counsellorApprisalContent;
                  this.xydsComments = temp_record.body.teacherApprisalComments;
                  this.qydsComments = temp_record.body.enterpriseComments;
                }
        }
  
  }
};
</script>

