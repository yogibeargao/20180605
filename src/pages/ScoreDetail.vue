<template>
  <r-page>
      <top title="实习成绩" :showBack="true"/>
      <r-body>
           <!--  <r-input title="分数" :required="true" :max="100" :min="0"  :model="this" value="schoolScore" :isNumber="true"/>
            <r-textarea placeholder="请输入评价" :model="this" value="comments" :height="600" :max="600"></r-textarea> -->

             <r-card title="辅导员考核：">
                  <r-input title="实习出勤分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_fdy_score_1" :isNumber="true"/>
                  <r-input title="实习材料分:" :readonly="true"  :max="100" :min="0"  :model="this" value="v_fdy_score_2" :isNumber="true"/>
                  <r-textarea title="评价:" :readonly="true" :model="this" value="comments" :height="150" :max="200"></r-textarea>
            </r-card>

            <r-card title="学院导师考核：">
                <r-input title="专业学习情况分:"  :readonly="!isShow"   :max="100" :min="0"  :model="this" value="v_xyds_score_1" :isNumber="true"/>
                <r-input title="顶岗实习小结分:"  :readonly="!isShow"   :max="100" :min="0"  :model="this" value="v_xyds_score_2" :isNumber="true"/>
                <r-textarea title="评价:" :readonly="!isShow"  :model="this" value="comments" :height="200" :max="200"></r-textarea>
             </r-card>


            <r-card title="企业导师考核：">
                  <r-input title="职业道德分:"   :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="v_qyds_score_1" :isNumber="true"/>
                  <r-input title="执行制度遵守纪律情况分:"   :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="v_qyds_score_2" :isNumber="true"/>
                  <r-input title="实习工作态度分:"  :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="v_qyds_score_3" :isNumber="true"/>
                  <r-input title="专业业务能力分:"  :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="v_qyds_score_4" :isNumber="true"/>
                  <r-input title="工作实绩分:"    :readonly="isreadonly"   :max="100" :min="0"  :model="this.record" value="v_qyds_score_5" :isNumber="true"/>
                  <r-textarea title='实习评价:'  :readonly="isreadonly"  :model="this.record" value="appraisalContent"  :autoSize="true" :rows="10" :max="200"></r-textarea>
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
  </r-page>
</template>

<script>
import Util from "../util/util";

export default {
  data() {
    return {
      schoolScore: null,
      comments: null,
    };
  },
  methods: {
    async submit() {
                  const s_identityId =   this.$route.query.id;
                  const identityId = Util.getIdentityId(this);
                  const result = await this.$http.post(`intern/score/create`,{"studentNo":s_identityId,"teacherNo":identityId,"schoolScore":Number(this.score),"comments":this.comments});
                  if(result.body){
                     this.$router.back(-1);
                  }
    }
  },
  async mounted(){
          const id = this.$route.query.id;
          if(id){
                  const url = "intern/score/detail?studentSchoolScoreId="+id;
                  const temp_record = await this.$http.get(url);
                  if(temp_record.body){
                    this.comments = temp_record.body.comments;
                    this.schoolScore = temp_record.body.schoolScore;
                  }
          }
  
  }
};
</script>

