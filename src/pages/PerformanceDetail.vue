<template>
  <r-page>
      <top title="实习评价详情" :showBack="true"/>
      <r-body>
            <r-card title="实习评价:">
                <r-input title="实习出勤分"   placeholder="最高15分"  :max="100" :min="0"  :model="this" value="v_score_1" :isNumber="true"/>
                <r-input title="实习材料提交分"   placeholder="最高15分"  :max="100" :min="0"  :model="this" value="v_score_2" :isNumber="true"/>
                <r-textarea placeholder="请输入评价"  :model="this" value="comments" :height="200" :max="600"></r-textarea>
            </r-card>

              <r-card title="实习表现:">
                  <div id="perform" style="width: 100%;height:270px;"></div>
            </r-card>

      </r-body>
             <r-tab-bar>
                  <r-cell type="row" :vertical="true">
                                <r-cell v-if="!score || status !== 1">
                                  <r-box>
                                      <r-button :onClick="submit">提交</r-button>
                                  </r-box>
                                </r-cell>
                                
                    </r-cell>
              </r-tab-bar>
  </r-page>
</template>

<script>
import Vue from 'vue';
import Util from "../util/util";
import {ConfirmApi } from "rainbow-mobile-core";

export default {
   components: {
    ConfirmApi
  },
  data() {
    return {
      comments: null,
      score: null,
      v_score_1: null,
      v_score_2: null,
      status: null,
      performInfo: {}
    };
  },
  methods: {
   
    async submit() {
                  const id = this.$route.query.id;

                   if(!this.v_score_1){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入实习出勤分'
                      });
                    }else if(this.v_score_1 > 15 || this.v_score_1 < 0){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '实习出勤分数<br/>评分规则为[0-15分]！'
                      });
                    }else if(!this.v_score_2){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入实习材料提交分'
                      });
                    }else if(this.v_score_2 > 15 || this.v_score_1 < 0){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '实习材料提交分数<br/>评分规则为[0-15分]！'
                      });
                    }else if(!this.comments){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入实习评价'
                      });

                    }else{
                       const studentNo = this.$route.query.studentNo;
                      const param = {"studentNo":studentNo,"attendanceScore":this.v_score_1,"documentScore":this.v_score_2,"comments":this.comments,"status":1} 
                      const list = await this.$http.post(`intern/attendenceAppraisal/create`,param);
                      if(list.body){
                            ConfirmApi.show(this,{
                                title: '',
                                content: '操作成功',
                              });
                      }else{
                              ConfirmApi.show(this,{
                                title: '',
                                content: '操作失败',
                              });
                      }
                  }
                  
    },
  
  },
  async mounted(){
          const id = this.$route.query.id;
          if(id !== 'null'){
                  const url = "intern/attendenceAppraisal/detail?attendenceAppraisalId="+id;
                  const temp_record = await this.$http.get(url);
                  if(temp_record.body){
                    this.comments = temp_record.body.comments;
                    this.score = temp_record.body.attendanceScore;
                    this.v_score_1 = temp_record.body.attendanceScore;
                    this.v_score_2 = temp_record.body.documentScore;
                    this.status = temp_record.body.status;
                  }
          }

          const studentNo = this.$route.query.studentNo;
          if(studentNo !== 'null'){
                  const url = "intern/summary/student/attendence?studentNo="+studentNo;
                  const temp_attend = await this.$http.get(url);
                  if(temp_attend.body){
                    const performInfoTemp = {};
                    performInfoTemp['attendaceDays']= temp_attend.body.attendaceDays;
                    performInfoTemp['sickLeaveDays'] = temp_attend.body.sickLeaveDays;
                    performInfoTemp['personalDays'] = temp_attend.body.personalDays;
                    performInfoTemp['absenteeismDays'] = temp_attend.body.absenteeismDays;

                    this.performInfo = performInfoTemp;
                  }
          }

          const perform = echarts.init(document.getElementById('perform'));
          const performOption = {
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'left',
                  data:['出勤天数','病假天数','事假天数','旷工天数']
              },
              series: [
                  {
                      name:'实习表现',
                      type:'pie',
                      radius: ['50%', '70%'],
                      avoidLabelOverlap: false,
                      label: {
                          normal: {
                              show: false,
                              position: 'center'
                          },
                          emphasis: {
                              show: true,
                              textStyle: {
                                  fontSize: '30',
                                  fontWeight: 'bold'
                              }
                          }
                      },
                      labelLine: {
                          normal: {
                              show: false
                          }
                      },
                      data:[
                          {value:this.performInfo.attendaceDays, name:'出勤天数'},
                          {value:this.performInfo.sickLeaveDays, name:'病假天数'},
                          {value:this.performInfo.personalDays, name:'事假天数'},
                          {value:this.performInfo.absenteeismDays, name:'旷工天数'}
                      ]
                  }
              ]
          };
          perform.setOption(performOption);

  
  }
};
</script>


